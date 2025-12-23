import { DataResponse, Dimension, Granularity, Measure } from '@embeddable.com/core';
import { useEmbeddableState, useTheme } from '@embeddable.com/react';
import React, { useEffect, useState } from 'react';

import Container from '../../Container';
import BarChart from '../BarChart/components/BarChart';
import { Theme } from '../../../../themes/theme';
import formatValue from '../../../util/format';

export type Props = {
  description?: string;
  displayHorizontally?: boolean;
  dps?: number;
  enableDownloadAsCSV?: boolean;
  granularity?: Granularity;
  metrics: Measure[];
  results: DataResponse;
  reverseXAxis?: boolean;
  showLabels?: boolean;
  showLegend?: boolean;
  title?: string;
  xAxis: Dimension;
  xAxisOptions?: Dimension[];
  theme?: Theme;
};

export default (props: Props) => {
  const { results } = props;

  const [value, setValue] = useState(props.xAxis.name);
  const [_, setDimension] = useEmbeddableState({ dimension: null }) as [
    { dimension: Dimension | null },
    (d: { dimension: Dimension | null }) => void,
  ];

  const theme: Theme = useTheme() as Theme;

  const xAxisOptions = props.xAxisOptions?.find((item) => props.xAxis.name === item.name)
    ? props.xAxisOptions
    : [...(props.xAxisOptions || []), props.xAxis];

  const handleChange = (newValue: string) => {
    setValue(newValue);
    const selectedDimension = xAxisOptions.find((item) => newValue === item.name) || null;
    setDimension({ dimension: selectedDimension });
  };

  const xAxis = xAxisOptions.find((item) => value === item.name);
  let dateFormat: string | undefined;
  if (xAxis?.nativeType === 'time' && props.granularity && props.granularity in theme.dateFormats) {
    dateFormat = theme.dateFormats[props.granularity];
  }
  const updatedProps = {
    ...props,
    theme,
    xAxis: xAxis ? xAxis : props.xAxis,
  };
  const mappedData = results?.data?.map((d) => ({
    ...d,
    ...(xAxis?.name && {
      [xAxis.name]: dateFormat
        ? formatValue(d?.[xAxis.name], {
            meta: xAxis?.meta,
            dateFormat,
          })
        : d?.[xAxis.name],
    }),
  })) ?? [];

  return (
    <Container {...props} className="overflow-y-hidden">
      <div className="flex h-[60px] w-full">
        <div>
          <select
            className={`
              border
              flex
              h-10
              items-center
              min-w-[50px]
              px-3
              relative
              w-full
              border-controls-borders-normal
              rounded-controls-borders-radius
            `}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
          >
            {xAxisOptions?.map((o, i) => (
              <option key={i} value={o.name}>
                {o.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex grow overflow-hidden">
        {results.isLoading ||
        !xAxis ||
        !mappedData?.filter((_, i) => i < 10)?.some((row) => row[xAxis.name]) ? null : (
          <BarChart key={value} {...updatedProps} results={{ ...results, data: mappedData }} />
        )}
      </div>
    </Container>
  );
};
