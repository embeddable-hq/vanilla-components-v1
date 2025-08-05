import React, { useEffect, useRef, useState } from 'react';
import { addDays, endOfWeek, startOfWeek } from 'date-fns';
import { tz, TZDate } from '@date-fns/tz';

import Container from '../../Container';
import { Theme } from '../../../../themes/theme';
import { useTheme } from '@embeddable.com/react';
import { DataResponse, Dimension, Measure, TimeRange } from '@embeddable.com/core';

type Props = {
  metric: Measure;
  timeFilter?: TimeRange;
  timeProperty?: Dimension;
  title?: string;
  description?: string;
  value?: string | number;
  className?: string;
  results?: DataResponse;
  style?: React.CSSProperties;
  onChange?: (value: string | number) => void;
  enableDownloadAsCSV?: boolean;
  enableDownloadAsPNG?: boolean;
};

export default (props: Props) => {
  const { metric, results, timeProperty } = props;
  const { data = [], isLoading } = results || { data: [], isLoading: false };
  const [dataToDisplay, setDataToDisplay] = useState(data);

  const theme: Theme = useTheme() as Theme;

  // Find the highest value in the data, the lowest value, and the average value
  const highestValue = data.reduce((max, item) => Math.max(max, item[metric.name]), -Infinity);
  const lowestValue = data.reduce((min, item) => Math.min(min, item[metric.name]), Infinity);
  const totalValue = data.reduce((sum, item) => sum + parseInt(item[metric.name], 10), 0);
  const nonZeroValues = data.filter((item) => item[metric.name] > 0);
  const averageValue = Math.round(totalValue / nonZeroValues.length) || 0;

  // For now assume a 7 day week for a full year. Weeks are horizontal, days are vertical
  const weeks = 52;
  const days = 7;
  const cellWidth = 12;
  const cellHeight = 12;
  const cellStyle: React.CSSProperties = {
    width: cellWidth,
    height: cellHeight,
    display: 'inline-block',
    margin: '2px',
    borderRadius: '2px',
    lineHeight: 1,
    fontSize: '11px',
  };

  const getColor = (value: number) => {
    const rgb = hexToRgb(theme.brand.primary);

    // determine the opacity based on the value. In 20% increments from 0% to 100%. 0% is always a value of 0. 20% is always the lowest value. 100% is always the highest value. Other values should be interpolated between 20% and 100%.
    let opacity = 0;
    if (value < 0) {
      opacity = 0;
    } else if (value === 0) {
      opacity = 0.2;
    } else if (value === lowestValue) {
      opacity = 0.4; // 40%
    } else if (value === highestValue) {
      opacity = 1; // 100%
    } else {
      const range = highestValue - lowestValue;
      const normalizedValue = (value - lowestValue) / range; // Normalize value between 0 and 1
      // opacity = 0.4 + normalizedValue * 0.6; // Interpolate between 0.4 and 1
      opacity = 0.2 + normalizedValue * 0.8; // Interpolate between 0.2 and 1
    }
    // Ensure opacity is between 0 and 1
    opacity = Math.max(0, Math.min(1, opacity));

    return `rgba(${value > 0 ? rgb : '0,0,0'} , ${opacity})`;
  };

  useEffect(() => {
    const generateMatrix = () => {
      // Get the start and end dates from the results (array 0 is oldest, array length -1 is newest)

      if (data.length === 0) {
        setDataToDisplay([]);
        return;
      }

      // strip out the time from item[timeProperty?.name || 'date'] - we just want the date
      const cleanedData = data.map((item) => {
        const strippedDate = item[timeProperty?.name || 'date'].replace('T', ' ').split(' ')[0];
        return {
          [metric.name]: item[metric.name],
          [timeProperty?.name || 'date']: strippedDate,
        };
      });

      // Doing some juggling to get around time zones here
      const startDate = new TZDate(cleanedData[0][timeProperty?.name || 'date'], 'UTC');
      const endDate = new TZDate(
        cleanedData[cleanedData.length - 1][timeProperty?.name || 'date'],
        'UTC',
      );
      const startOfWeekDate = startOfWeek(new TZDate(startDate, 'UTC'), {
        weekStartsOn: 1,
      });

      // Create a matrix of weeks and days
      const dateMatrix: string[][] = [];
      let currentDate = startOfWeekDate;
      while (currentDate <= endDate) {
        const week: string[] = [];
        for (let i = 0; i < days; i++) {
          // Strip the date to just YYYY-MM-DD format
          const strippedDate = currentDate.toISOString().split('T')[0];
          // If the currentDate is before the startDate, add the strippedDate to the cleanedData array and give it a value of -1. Do the same if the currentDate is after the endDate
          if (currentDate < startDate || currentDate > endDate) {
            cleanedData.push({
              [metric.name]: -1,
              [timeProperty?.name || 'date']: strippedDate,
            });
          }
          week.push(strippedDate);
          currentDate = addDays(currentDate, 1);
        }
        dateMatrix.push(week);
      }

      // Then iterate through the data, using dimension.name for the date and metric.name for the value. If a date in the array does not exist in the data, give it a value of zero.
      const dataMatrix = dateMatrix.map((week) => {
        const timePropertyName = timeProperty?.name || 'date';
        return week.map((date) => {
          const dateString = date;
          const item = cleanedData.find((d) => d[timePropertyName] === dateString);
          return {
            date: dateString,
            value: item ? parseInt(item[metric.name], 10) : 0,
          };
        });
      });

      setDataToDisplay(dataMatrix);
    };

    if (data.length > 0) {
      generateMatrix();
    }
  }, [data, props.timeFilter, metric.name, timeProperty?.name]);

  return (
    <Container {...props} className="overflow-y-hidden">
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-bold mb-2">{props.title || metric.name}</h2>
        {props.description && <p className="text-sm text-gray-600 mb-4">{props.description}</p>}
        <div className="flex flex-wrap" style={{ width: '100%' }}>
          <div className="flex flex-col items-center">
            <div className="text-xs" style={{ ...cellStyle, width: 'auto', textAlign: 'right' }}>
              Mon
            </div>
            <div className="text-xs" style={{ ...cellStyle, width: 'auto', textAlign: 'right' }}>
              &nbsp;
            </div>
            <div className="text-xs" style={{ ...cellStyle, width: 'auto', textAlign: 'right' }}>
              Wed
            </div>
            <div className="text-xs" style={{ ...cellStyle, width: 'auto', textAlign: 'right' }}>
              &nbsp;
            </div>
            <div className="text-xs" style={{ ...cellStyle, width: 'auto', textAlign: 'right' }}>
              Fri
            </div>
            <div className="text-xs" style={{ ...cellStyle, width: 'auto', textAlign: 'right' }}>
              &nbsp;
            </div>
            <div className="text-xs" style={{ ...cellStyle, width: 'auto', textAlign: 'right' }}>
              Sun
            </div>
          </div>
          {/* Using the data matrix, generate a grid of weeks and days, getting the appropriate color opacity (using getColor) for each day by iterating over the data and finding data[dimension.name] for the date and data[metric.name] for the value. If a date in the array does not exist in the data, give it a value of zero. important: The weeks should be columns and the days should be rows */}
          {dataToDisplay.length > 0 &&
            dataToDisplay.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col">
                {week.map((day: { value: number; date: string }, dayIndex: number) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    style={{
                      ...cellStyle,
                      backgroundColor: getColor(day.value),
                      border:
                        day.value < 0
                          ? `1px solid rgba(${hexToRgb(theme.brand.primary)}, 0.2)`
                          : 'none',
                    }}
                    title={`${day.date}: ${day.value}`}
                  />
                ))}
              </div>
            ))}
        </div>
        <div className="mt-4">
          <span>Highest: {highestValue}</span> |<span> Lowest: {lowestValue}</span> |
          <span> Average: {averageValue}</span>
        </div>
      </div>
    </Container>
  );
};

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
};
