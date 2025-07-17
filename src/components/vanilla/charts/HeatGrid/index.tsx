import React, { useEffect, useRef, useState } from 'react';

import Container from '../../Container';
import { Theme } from '../../../../themes/theme';
import { useTheme } from '@embeddable.com/react';
import { Dimension, Measure, TimeRange } from '@embeddable.com/core';

type Props = {
  metric: Measure;
  timeFilter?: TimeRange;
  timeProperty?: Dimension;
  title?: string;
  description?: string;
  value?: string | number;
  className?: string;
  results?: { data: any[]; isLoading: boolean };
  style?: React.CSSProperties;
  onChange?: (value: string | number) => void;
  enableDownloadAsCSV?: boolean;
  enableDownloadAsPNG?: boolean;
};

type DataToDisplay = {
  date: string;
  value: number;
};

export default (props: Props) => {
  const { metric, results, timeProperty } = props;
  const { data = [], isLoading } = results || { data: [], isLoading: false };
  const [dataToDisplay, setDataToDisplay] = useState<DataToDisplay[][]>(data);

  const theme: Theme = useTheme() as Theme;

  // Find the highest value in the data, the lowest value, and the average value
  const highestValue = data.reduce((max, item) => Math.max(max, item[metric.name]), -Infinity);
  const lowestValue = data.reduce((min, item) => Math.min(min, item[metric.name]), Infinity);
  const totalValue = data.reduce((sum, item) => sum + parseInt(item[metric.name], 10), 0);
  const averageValue = Math.round(totalValue / data.length) || 0;

  // For now assume a 7 day week for a full year. Weeks are horizontal, days are vertical
  const weeks = 52;
  const days = 7;
  const cellWidth = 10;
  const cellHeight = 10;
  const cellStyle: React.CSSProperties = {
    width: cellWidth,
    height: cellHeight,
    display: 'inline-block',
    margin: '1px',
    borderRadius: '2px',
  };

  const getColor = (value: number) => {
    // Convert theme.brand.primary hex to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
        : [0, 0, 0];
    };
    const rgb = hexToRgb(theme.brand.primary);

    // determine the opacity based on the value. In 20% increments from 0% to 100%. 0% is always a value of 0. 20% is always the lowest value. 100% is always the highest value. Other values should be interpolated between 20% and 100%.
    let opacity = 0;
    if (value === 0) {
      opacity = 0.2;
    } else if (value === lowestValue) {
      opacity = 0.2; // 20%
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

  useEffect(() => {
    const generateMatrix = () => {
      // Get the start and end dates of the time filter
      const startDate = props.timeFilter?.from || new Date();
      const endDate = props.timeFilter?.to || new Date();

      // Create a 2D matrix of weeks and days, where each cell is a date in the range from startDate to endDate. If the startDate is not a Sunday, set the start of the matrix to the Sunday that precedes it. If the end date is not a Saturday, set the end of the matrix to the Saturday that follows it.
      // Set start of week to Monday and end of week to Sunday
      const startOfWeek = new Date(startDate);
      const startDay = startOfWeek.getDay();
      startOfWeek.setDate(startOfWeek.getDate() - (startDay === 0 ? 6 : startDay - 1));
      const endOfWeek = new Date(endDate);
      const endDay = endOfWeek.getDay();
      endOfWeek.setDate(endOfWeek.getDate() + (endDay === 0 ? 0 : 7 - endDay));
      const dateMatrix: Date[][] = [];
      const currentDate = new Date(startOfWeek);
      while (currentDate <= endOfWeek) {
        const week: Date[] = [];
        for (let i = 0; i < days; i++) {
          week.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        dateMatrix.push(week);
      }

      // Then iterate through the data, using dimension.name for the date and metric.name for the value. If a date in the array does not exist in the data, give it a value of zero.
      const dataMatrix = dateMatrix.map((week) => {
        const timePropertyName = timeProperty?.name || 'date';
        return week.map((date) => {
          const dateString = date.toISOString().replace('Z', '');
          const item = data.find((d) => d[timePropertyName] === dateString);
          console.log(item);
          return {
            date: dateString,
            value: item ? parseInt(item[metric.name], 10) : 0,
          };
        });
      });

      console.log(data);
      console.log('Data Matrix:', dataMatrix);
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
          {/* Using the data matrix, generate a grid of weeks and days, getting the appropriate color opacity (using getColor) for each day by iterating over the data and finding data[dimension.name] for the date and data[metric.name] for the value. If a date in the array does not exist in the data, give it a value of zero. important: The weeks should be columns and the days should be rows */}
          {dataToDisplay.length > 0 &&
            dataToDisplay.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    style={{
                      ...cellStyle,
                      backgroundColor: getColor(day.value),
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
