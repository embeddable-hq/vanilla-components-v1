import React, { useEffect, useState } from 'react';
import { DataResponse, Dimension, Measure, TimeRange } from '@embeddable.com/core';
import { addDays, format, startOfWeek } from 'date-fns';
import { TZDate } from '@date-fns/tz';

import Container from '../../Container';
import { Theme } from '../../../../themes/theme';
import { useTheme } from '@embeddable.com/react';
import hexToRgb from '../../../util/hexToRgb';

type Props = {
  baseColor?: string;
  className?: string;
  description?: string;
  displayLegend?: boolean;
  displayStats?: boolean;
  enableDownloadAsCSV?: boolean;
  enableDownloadAsPNG?: boolean;
  includeZeroValues?: boolean;
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

const BASE_OPACITY = 0.2;
const CELL_HEIGHT = 12;
const CELL_WIDTH = 12;
const CELL_STYLE: React.CSSProperties = {
  width: CELL_WIDTH,
  height: CELL_HEIGHT,
  display: 'inline-block',
  margin: '2px',
  borderRadius: '2px',
  lineHeight: 1,
  fontSize: '11px',
};
const DAYS = 7;

// Helper Function
const generateBox = (color: string, opacity: number, cellStyle: React.CSSProperties) => {
  const shade = hexToRgb(color, opacity);
  return (
    <div
      style={{
        ...cellStyle,
        backgroundColor: shade,
      }}
    />
  );
};

// Main Component
const HeatGrid: React.FC<Props> = (props) => {
  const {
    baseColor,
    displayLegend,
    displayStats,
    includeZeroValues,
    metric,
    results,
    statsPrefix,
    statsSuffix,
    timeProperty,
  } = props;
  const { data = [] } = results || { data: [], isLoading: false };
  const [dataToDisplay, setDataToDisplay] = useState(data);
  const [averageValue, setAverageValue] = useState(0);

  const theme: Theme = useTheme() as Theme;

  // Find the highest value in the data and the lowest value
  const highestValue = data.reduce((max, item) => Math.max(max, item[metric.name]), -Infinity);
  const lowestValue = data.reduce((min, item) => Math.min(min, item[metric.name]), Infinity);
  const totalValue = data.reduce((sum, item) => sum + parseInt(item[metric.name], 10), 0);
  const nonZeroValues = data.filter((item) => item[metric.name] > 0);

  // We may need to update the average later so we use a useEffect
  useEffect(() => {
    const avg = nonZeroValues.length > 0 ? Math.round(totalValue / nonZeroValues.length) : 0;
    setAverageValue(avg);
  }, [totalValue, nonZeroValues.length]);

  const getColor = (value: number) => {
    // determine the opacity based on the value. In 20% increments from 0% to 100%.
    let opacity = 0;
    if (value < 0) {
      opacity = 0.00001; // effectively transparent for "no data"
    } else if (value === 0) {
      opacity = BASE_OPACITY;
    } else {
      const range = highestValue - lowestValue;
      const normalizedValue = (value - lowestValue) / range; // Normalize value between 0 and 1
      // Interpolate between 0.2 and 1 but only in 20% increments
      opacity = BASE_OPACITY + Math.ceil(normalizedValue * 5) * BASE_OPACITY;
      if (opacity < BASE_OPACITY) opacity = BASE_OPACITY;
      if (opacity > 1) opacity = 1;
    }
    const mainColor = baseColor ? baseColor : theme.brand.primary;
    const zeroValueColor = '#000000';
    const colorToUse = value > 0 ? mainColor : zeroValueColor;
    const rgb = hexToRgb(colorToUse, opacity);
    return rgb;
  };

  // This is how we generate the grid of weeks and days
  useEffect(() => {
    const generateMatrix = () => {
      if (data.length === 0) {
        setDataToDisplay([]);
        return;
      }

      // strip out the time from item[timeProperty?.name || 'date'] - we just want the date
      const cleanedData = data.map((item) => {
        // Instead use date-fns instead to generate the date only
        const strippedDate = format(new Date(item[timeProperty?.name || 'date']), 'yyyy-MM-dd');
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
        for (let i = 0; i < DAYS; i++) {
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

      // If includeZeroValues is true, we need to recalculate the average
      if (includeZeroValues) {
        const total = dataMatrix
          .flat()
          .reduce((sum, item) => sum + (item.value > 0 ? item.value : 0), 0);
        const count = dataMatrix.flat().filter((item) => item.value >= 0).length;
        const avg = Math.round(total / count);
        setAverageValue(avg);
      }

      setDataToDisplay(dataMatrix);
    };

    if (data.length > 0) {
      generateMatrix();
    }
  }, [data, props.timeFilter, metric.name, timeProperty?.name, includeZeroValues]);

  return (
    <Container {...props} className="overflow-y-hidden">
      <div className="flex flex-col items-left">
        <div
          className={`flex flex-nowrap ${displayLegend || displayStats ? 'border-b-2 mb-2 pb-2' : null} border-gray-200 `}
        >
          <div className="flex flex-col items-center">
            <div className="text-xs" style={{ ...CELL_STYLE, width: '24px', textAlign: 'right' }}>
              Mon
            </div>
            <div className="text-xs" style={{ ...CELL_STYLE, width: '24px', textAlign: 'right' }}>
              &nbsp;
            </div>
            <div className="text-xs" style={{ ...CELL_STYLE, width: '24px', textAlign: 'right' }}>
              Wed
            </div>
            <div className="text-xs" style={{ ...CELL_STYLE, width: '24px', textAlign: 'right' }}>
              &nbsp;
            </div>
            <div className="text-xs" style={{ ...CELL_STYLE, width: '24px', textAlign: 'right' }}>
              Fri
            </div>
            <div className="text-xs" style={{ ...CELL_STYLE, width: '24px', textAlign: 'right' }}>
              &nbsp;
            </div>
            <div className="text-xs" style={{ ...CELL_STYLE, width: '24px', textAlign: 'right' }}>
              Sun
            </div>
          </div>
          <div className="flex flex-grow overflow-auto">
            {dataToDisplay.length > 0 &&
              dataToDisplay.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col">
                  {week.map((day: { value: number; date: string }, dayIndex: number) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      style={{
                        ...CELL_STYLE,
                        backgroundColor: getColor(day.value),
                        border:
                          day.value < 0
                            ? `1px solid ${hexToRgb(baseColor ? baseColor : theme.brand.primary, BASE_OPACITY)}`
                            : 'none',
                      }}
                      title={`${day.date}: ${day.value}`}
                    />
                  ))}
                </div>
              ))}
          </div>
        </div>
        <div className="flex justify-between items-center w-full">
          {displayLegend && (
            <div className="flex justify-between items-center pr-2">
              <div style={{ ...CELL_STYLE, width: '24px' }}>Less</div>
              {generateBox(baseColor ? baseColor : theme.brand.primary, BASE_OPACITY, CELL_STYLE)}
              {generateBox(baseColor ? baseColor : theme.brand.primary, 0.4, CELL_STYLE)}
              {generateBox(baseColor ? baseColor : theme.brand.primary, 0.6, CELL_STYLE)}
              {generateBox(baseColor ? baseColor : theme.brand.primary, 0.8, CELL_STYLE)}
              {generateBox(baseColor ? baseColor : theme.brand.primary, 1, CELL_STYLE)}
              <div style={{ ...CELL_STYLE, width: 'auto' }}>More</div>
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

export default HeatGrid;
