import React, { useEffect, useRef, useState } from 'react';
import { addDays, endOfWeek, startOfWeek } from 'date-fns';
import { tz, TZDate } from '@date-fns/tz';

import Container from '../../Container';
import { Theme } from '../../../../themes/theme';
import { useTheme } from '@embeddable.com/react';
import { DataResponse, Dimension, Measure, TimeRange } from '@embeddable.com/core';

type Props = {
  baseColor?: string;
  className?: string;
  description?: string;
  displayLegend?: boolean;
  displayStats?: boolean;
  enableDownloadAsCSV?: boolean;
  enableDownloadAsPNG?: boolean;
  metric: Measure;
  onChange?: (value: string | number) => void;
  results?: DataResponse;
  statsPrefix?: string;
  statsSuffix?: string;
  style?: React.CSSProperties;
  timeFilter?: TimeRange;
  timeProperty?: Dimension;
  title?: string;
  value?: string | number;
};

export default (props: Props) => {
  const {
    baseColor,
    displayLegend,
    displayStats,
    metric,
    results,
    statsPrefix,
    statsSuffix,
    timeProperty,
  } = props;
  const { data = [] } = results || { data: [], isLoading: false };
  const [dataToDisplay, setDataToDisplay] = useState(data);

  const theme: Theme = useTheme() as Theme;

  // Find the highest value in the data, the lowest value, and the average value
  const highestValue = data.reduce((max, item) => Math.max(max, item[metric.name]), -Infinity);
  const lowestValue = data.reduce((min, item) => Math.min(min, item[metric.name]), Infinity);
  const totalValue = data.reduce((sum, item) => sum + parseInt(item[metric.name], 10), 0);
  const nonZeroValues = data.filter((item) => item[metric.name] > 0);
  const averageValue = Math.round(totalValue / nonZeroValues.length) || 0;

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
    const rgb = hexToRgb(baseColor ? baseColor : theme.brand.primary);

    // determine the opacity based on the value. In 20% increments from 0% to 100%.
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
      opacity = 0.2 + normalizedValue * 0.8; // Interpolate between 0.2 and 1
    }
    // Ensure opacity is between 0 and 1
    opacity = Math.max(0, Math.min(1, opacity));

    return `rgba(${value > 0 ? rgb : '0,0,0'} , ${opacity})`;
  };

  // This is how we generate the grid of weeks and days
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
      const dataStartDate = cleanedData[0][timeProperty?.name || 'date'];
      const dataEndDate = cleanedData[cleanedData.length - 1][timeProperty?.name || 'date'];
      const startDate = new TZDate(dataStartDate, 'UTC');
      const endDate = new TZDate(dataEndDate, 'UTC');
      const startOfWeekDate = startOfWeek(startDate, {
        weekStartsOn: 1,
      });

      // Create a matrix of weeks and days
      const dateMatrix: string[][] = [];
      let currentDate = startOfWeekDate;
      while (currentDate <= endDate) {
        const week: string[] = [];
        for (let i = 0; i < days; i++) {
          const strippedDate = currentDate.toISOString().split('T')[0];
          if (currentDate < startDate || currentDate > endDate) {
            cleanedData.push({
              [metric.name]: -1, // used to generate "empty" boxes at start and end of the grid
              [timeProperty?.name || 'date']: strippedDate,
            });
          }
          week.push(strippedDate);
          currentDate = addDays(currentDate, 1);
        }
        dateMatrix.push(week);
      }

      // Iterate through the data, using dimension.name for the date and metric.name for the value.
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
      <div className="flex flex-col items-left">
        <div
          className={`flex flex-wrap ${displayLegend || displayStats ? 'border-b-2 mb-2 pb-2' : null} border-gray-200 `}
        >
          <div className="flex flex-col items-center">
            <div className="text-xs" style={{ ...cellStyle, width: '24px', textAlign: 'right' }}>
              Mon
            </div>
            <div className="text-xs" style={{ ...cellStyle, width: '24px', textAlign: 'right' }}>
              &nbsp;
            </div>
            <div className="text-xs" style={{ ...cellStyle, width: '24px', textAlign: 'right' }}>
              Wed
            </div>
            <div className="text-xs" style={{ ...cellStyle, width: '24px', textAlign: 'right' }}>
              &nbsp;
            </div>
            <div className="text-xs" style={{ ...cellStyle, width: '24px', textAlign: 'right' }}>
              Fri
            </div>
            <div className="text-xs" style={{ ...cellStyle, width: '24px', textAlign: 'right' }}>
              &nbsp;
            </div>
            <div className="text-xs" style={{ ...cellStyle, width: '24px', textAlign: 'right' }}>
              Sun
            </div>
          </div>
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
        <div className="flex justify-between items-center w-full">
          {displayLegend && (
            <div className="flex justify-between items-center">
              <div style={{ ...cellStyle, width: '24px' }}>Less</div>
              {generateBox(baseColor ? baseColor : theme.brand.primary, 0.2, cellStyle)}
              {generateBox(baseColor ? baseColor : theme.brand.primary, 0.4, cellStyle)}
              {generateBox(baseColor ? baseColor : theme.brand.primary, 0.6, cellStyle)}
              {generateBox(baseColor ? baseColor : theme.brand.primary, 0.8, cellStyle)}
              {generateBox(baseColor ? baseColor : theme.brand.primary, 1, cellStyle)}
              <div style={{ ...cellStyle, width: 'auto' }}>More</div>
            </div>
          )}
          {displayStats && (
            <div>
              <span>
                Highest: {statsPrefix}
                {highestValue.toLocaleString()}
                {statsSuffix}
              </span>{' '}
              |
              <span>
                {' '}
                Lowest: {statsPrefix}
                {lowestValue.toLocaleString()}
                {statsSuffix}
              </span>{' '}
              |
              <span>
                {' '}
                Average: {statsPrefix}
                {averageValue.toLocaleString()}
                {statsSuffix}
              </span>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

const hexToRgb = (hex: string) => {
  // Sanity check: remove leading '#' if present
  hex = hex.replace(/^#/, '');
  // Make sure the hex is 6 characters long
  if (hex.length !== 6) {
    return [0, 0, 0]; // Return black if invalid
  }

  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
};

const generateBox = (color: string, opacity: number, cellStyle: React.CSSProperties) => {
  const rgb = hexToRgb(color);
  return (
    <div
      style={{
        ...cellStyle,
        backgroundColor: `rgba(${rgb}, ${opacity})`,
      }}
    />
  );
};
