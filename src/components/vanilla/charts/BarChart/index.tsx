import { DataResponse, Dimension, Granularity, Measure } from '@embeddable.com/core';
import { useTheme } from '@embeddable.com/react';
import React, { useMemo } from 'react';

import useTimeseries from '../../../hooks/useTimeseries';
import Container from '../../Container';
import BarChart from './components/BarChart';
import { Theme } from '../../../../themes/theme';
import formatValue from '../../../util/format';

export type Props = {
  clientContext?: any;
  description?: string;
  displayHorizontally?: boolean;
  dps?: number;
  enableDownloadAsCSV?: boolean;
  granularity?: Granularity;
  isTSBarChart?: boolean;
  limit?: number;
  metrics: Measure[];
  lineMetrics?: Measure[];
  results: DataResponse;
  reverseXAxis?: boolean;
  showLabels?: boolean;
  showLegend?: boolean;
  sortBy?: Dimension | Measure;
  stackMetrics?: boolean;
  title?: string;
  xAxis: Dimension;
  xAxisTitle?: string;
  yAxisTitle?: string;
  showSecondYAxis?: boolean;
  secondAxisTitle?: string;
  theme?: Theme;
};

type PropsWithRequiredtheme = Props & { theme: Theme };

export default (props: Props): React.JSX.Element => {
  const theme: Theme = useTheme() as Theme;

  //add missing dates to time-series barcharts
  const { fillGaps } = useTimeseries(props, 'desc');
  const { results, isTSBarChart } = props;

  // Create mapped data with proper date formatting for time-series bar charts
  const mappedData = useMemo(() => {
    if (!isTSBarChart) return results?.data;
    
    const filledData = results?.data?.reduce(fillGaps, []);
    let dateFormat: string | undefined;
    if (props.xAxis?.nativeType === 'time' && props.granularity && props.granularity in theme.dateFormats) {
      dateFormat = theme.dateFormats[props.granularity as keyof typeof theme.dateFormats];
    }
    
    return filledData?.map((d) => ({
      ...d,
      ...(props.xAxis?.name && {
        [props.xAxis.name]: dateFormat
          ? formatValue(d?.[props.xAxis.name], {
              meta: props.xAxis?.meta,
              dateFormat,
              granularity: props.granularity,
            })
          : d?.[props.xAxis.name],
      }),
    })) ?? [];
  }, [isTSBarChart, results?.data, fillGaps, props.xAxis, props.granularity, theme]);

  // Update props with theme and mapped data
  const updatedProps: PropsWithRequiredtheme = {
    ...props,
    theme,
    results: { ...props.results, data: mappedData },
  };

  return (
    <Container {...props} className="overflow-y-hidden">
      <BarChart {...updatedProps} />
    </Container>
  );
};
