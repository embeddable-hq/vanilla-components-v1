import { DataResponse, Dimension, Measure, TimeRange } from '@embeddable.com/core';
import React, { useMemo } from 'react';

import formatValue from '../../../util/format';
import Container from '../../Container';
import { WarningIcon } from '../../icons';
import { Theme } from '../../../../themes/theme';
import { useTheme } from '@embeddable.com/react';

type Props = {
  abbreviateLongNumbers?: boolean;
  dimension?: Dimension;
  displayMetric?: boolean;
  dps?: number;
  fontSize?: number;
  metric?: Measure;
  prefix?: string;
  prevResults?: DataResponse;
  prevTimeFilter?: TimeRange;
  results: DataResponse;
  showNullValuesAsZero?: boolean;
  showPrevPeriodLabel?: boolean;
  suffix?: string;
  title?: string;
};

export default (props: Props) => {
  const {
    abbreviateLongNumbers,
    dimension,
    displayMetric,
    dps,
    metric,
    prefix,
    prevResults,
    prevTimeFilter,
    results,
    showNullValuesAsZero = true,
    showPrevPeriodLabel,
    suffix,
  } = props;

  const theme: Theme = useTheme() as Theme;

  const { nFormatted, pFormatted, p } = useMemo<{
    nFormatted: string;
    pFormatted: string;
    p: number;
  }>(() => {
    /*
      n: value from metric
      p: percentage change - previous value from metric to current value from metric
      nFormatted: formatted n as string
      pFormatted: formatted p as string
    */
    let nFormatted: string = showNullValuesAsZero ? '0' : '--';
    let pFormatted: string = showNullValuesAsZero ? '0' : '--';
    let p = 0;
    let n = 0;

    // Helper func
    const skipCalc = () => ({ nFormatted, pFormatted, p });

    // If we're missing any of these, skip calculations
    if (!metric?.name || !results?.data?.length) return skipCalc();
    // Will always be a number, null, or undefined
    const numberToParse = results?.data?.[0]?.[metric.name];

    // Handle nFormatted first
    if (numberToParse === null || numberToParse === undefined) return skipCalc();
    n = parseFloat(numberToParse);
    if (isNaN(n)) return skipCalc();

    nFormatted = formatValue(n.toString(), {
      type: 'number',
      meta: metric?.meta,
      dps: dps,
      abbreviateLongNumbers,
    }) as string; // always a string due to using toString()

    // Handle pFormatted second
    const prevToParse = prevResults?.data?.[0]?.[metric.name];
    if (prevToParse === null || prevToParse === undefined) return skipCalc();
    const prev = parseFloat(prevToParse);

    // Use infinity symbol for divide by zero
    if (isNaN(prev) || prev === 0) {
      pFormatted = '∞';
      return skipCalc();
    }

    // Calculate percentage change
    p = Math.round((n / prev) * 100) - 100;
    pFormatted = formatValue(p.toString(), {
      type: 'number',
      meta: metric?.meta,
      dps: dps,
    }) as string; // always a string due to using toString()

    return {
      nFormatted,
      pFormatted,
      p,
    };
  }, [
    abbreviateLongNumbers,
    dps,
    metric?.meta,
    metric?.name,
    prevResults?.data,
    results?.data,
    showNullValuesAsZero,
  ]);

  const fontSize = props.fontSize || theme.charts.kpi.font.size;
  const metaFontSize = Math.max(fontSize / 3, parseInt(theme.font.size.replace('px', ''), 10));
  const fontColor = theme.font.colorNormal;
  const negativeColor = theme.charts.kpi.font.negativeColor;

  if (results?.error) {
    return (
      <div className="h-full flex items-center justify-center font-embeddable text-sm">
        <WarningIcon />
        <div className="whitespace-pre-wrap p-4 max-w-sm text-xs">{results?.error}</div>
      </div>
    );
  }

  return (
    <Container {...props} className="overflow-y-hidden">
      <div
        className={`
          flex
          flex-col
          font-embeddable
          h-full
          items-${theme.charts.kpi?.alignment || 'center'}
          justify-center
          leading-tight
          relative
          text-${theme.charts.kpi?.alignment || 'center'}
          font-charts-kpi
        `}
      >
        {dimension ? (
          <>
            <div
              className={`text-font-color-normal`}
              style={{ fontSize: `${fontSize}px` }}
            >
              <p>{results?.data?.[0]?.[dimension.name]}</p>
            </div>
            {displayMetric && metric && (
              <p
                className={`font-normal`}
                style={{
                  fontSize: `${metaFontSize}px`,
                  color: fontColor,
                }}
              >
                {`${prefix ? prefix : ''}${nFormatted}${suffix ? suffix : ''}`}
              </p>
            )}
          </>
        ) : (
          <>
            <div
              className={`text-font-color-normal`}
              style={{ fontSize: `${fontSize}px` }}
            >
              <p>{`${prefix ? prefix : ''}${nFormatted}${suffix ? suffix : ''}`}</p>
            </div>
            {prevTimeFilter?.to && (
              <div
                className={`
                  flex
                  flex-wrap
                  font-normal
                  items-${theme.charts.kpi?.alignment || 'center'}
                  justify-center
                  text-${theme.charts.kpi?.alignment || 'center'}
                `}
                style={{
                  color: p && p < 0 ? negativeColor : fontColor,
                  fontSize: `${metaFontSize}px`,
                }}
              >
                <Chevron
                  className={`${p && p < 0 ? 'rotate-180' : ''} h-[20px] w-[9px] min-w-[9px] mr-1.5`}
                />
                <span>{`${prefix ? prefix : ''}${pFormatted}%${suffix ? suffix : ''}`}</span>
                {showPrevPeriodLabel &&
                  prevTimeFilter?.relativeTimeString &&
                  prevTimeFilter.relativeTimeString.length > 0 && (
                    <span style={{ color: fontColor }}>
                      &nbsp;
                      {`vs ${prevTimeFilter.relativeTimeString}`}
                    </span>
                  )}
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export const Chevron = ({ className }: { className?: string }) => (
  <svg
    className={className || ''}
    width="16"
    height="14"
    viewBox="0 0 16 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.14028 0.753268C7.5422 0.0998221 8.4578 0.099822 8.85972 0.753268L15.8366 12.0964C16.2727 12.8054 15.7846 13.7369 14.9769 13.7369H1.02308C0.215416 13.7369 -0.272737 12.8054 0.163359 12.0964L7.14028 0.753268Z"
      fill="currentcolor"
    />
  </svg>
);
