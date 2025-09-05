import { DataResponse, Dimension, Measure, Granularity } from '@embeddable.com/core';
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  InteractionItem,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React, { useRef, useState, useMemo } from 'react';
import { Pie, getElementAtEvent } from 'react-chartjs-2';

import formatValue from '../../../util/format';
import Container from '../../Container';
import { setChartJSDefaults } from '../../../util/chartjs/common';
import { Theme } from '../../../../themes/theme';
import { useTheme } from '@embeddable.com/react';

ChartJS.register(
  ChartDataLabels,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

type Props = {
  results: DataResponse;
  title: string;
  dps?: number;
  slice: Dimension;
  metric: Measure;
  showLabels?: boolean;
  showLegend?: boolean;
  maxSegments?: number;
  displayAsPercentage?: boolean;
  enableDownloadAsCSV?: boolean;
  onClick: (args: { slice: string | null; metric: string | null }) => void;
  granularity?: Granularity;
};

type PropsWithRequiredTheme = Props & { theme: Theme };
type Record = { [p: string]: string };

export default (props: Props) => {
  const { results, title, enableDownloadAsCSV, maxSegments, metric, slice, onClick, granularity } =
    props;

  const theme: Theme = useTheme() as Theme;

  // Create mapped data with proper date formatting
  const mappedData = useMemo(() => {
    let dateFormat: string | undefined;
    if (slice?.nativeType === 'time' && granularity && granularity in theme.dateFormats) {
      dateFormat = theme.dateFormats[granularity as keyof typeof theme.dateFormats];
    }

    return (
      results?.data?.map((d) => ({
        ...d,
        ...(slice?.name && {
          [slice.name]: dateFormat
            ? formatValue(d?.[slice.name], {
                meta: slice?.meta,
                dateFormat,
              })
            : d?.[slice.name],
        }),
      })) ?? []
    );
  }, [results?.data, slice, granularity, theme.dateFormats]);
  // Set ChartJS defaults
  setChartJSDefaults(theme, 'pie');

  // Check for color overrides in the theme
  let chartColors = theme.charts.colors;
  if (theme.charts.pie.colors) {
    chartColors = theme.charts.pie.colors;
  }

  // Add the theme to props
  const updatedProps: PropsWithRequiredTheme = {
    ...props,
    theme,
    results: { ...results, data: mappedData },
  };

  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  const chartRef = useRef<ChartJS<'pie', []>>(null);

  const fireClickEvent = (element: InteractionItem[]) => {
    if (!element.length || element[0].index === clickedIndex) {
      //clicked outside pie, or re-clicked slice
      onClick({ slice: null, metric: null });
      setClickedIndex(null);
      return;
    }
    const { datasetIndex, index } = element[0];
    if (maxSegments && index + 1 >= maxSegments) {
      // clicked "OTHER"
      return;
    }
    setClickedIndex(index);
    onClick({
      slice: mappedData?.[index][slice.name],
      metric: mappedData?.[index][metric.name],
    });
  };

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { current: chart } = chartRef;

    if (!chart) {
      return;
    }

    fireClickEvent(getElementAtEvent(chart, event));
  };

  return (
    <Container {...props} className="overflow-y-hidden">
      <Pie
        aria-label={title ? `Pie Chart: ${title}` : 'Pie Chart'}
        aria-roledescription="pie chart"
        height="100%"
        options={chartOptions(updatedProps, theme)}
        data={chartData(updatedProps, chartColors)}
        ref={chartRef}
        onClick={handleClick}
      />
    </Container>
  );
};

function chartOptions(props: Props, theme: Theme): ChartOptions<'pie'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 400,
      easing: 'linear',
    },
    cutout: '45%',
    plugins: {
      datalabels: {
        // Great resource: https://quickchart.io/documentation/chart-js/custom-pie-doughnut-chart-labels/
        backgroundColor: theme.charts.pie.labels.backgroundColor,
        borderRadius: theme.charts.pie.labels.borderRadius,
        color: theme.charts.pie.labels.color,
        display: props.showLabels ? 'auto' : false,
        font: {
          size: theme.charts.pie.labels.font.size,
          weight: theme.charts.pie.labels.font.weight,
        },
        formatter: (v) => {
          const val = v
            ? formatValue(v, {
                type: 'number',
                dps: props.dps,
                meta: props.displayAsPercentage ? undefined : props.metric.meta,
              })
            : null;
          return props.displayAsPercentage ? `${val}%` : val;
        },
      },
      tooltip: {
        //https://www.chartjs.org/docs/latest/configuration/tooltip.html
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            // handle labels that are booleans
            if (typeof context.dataset.label === 'boolean') {
              label = context.dataset.label ? 'True' : 'False';
            }
            if (context.parsed !== null) {
              label += `: ${formatValue(`${context.parsed || ''}`, {
                type: 'number',
                dps: props.dps,
                meta: props.displayAsPercentage ? undefined : props.metric.meta,
              })}`;
            }
            label = props.displayAsPercentage ? `${label}%` : label;
            return label;
          },
        },
      },
      legend: {
        display: props.showLegend,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxHeight: 10,
        },
      },
    },
  };
}

function mergeLongTail(data: any[], slice: Dimension, metric: Measure, maxSegments: number) {
  if (!maxSegments || !metric || !slice) return data;

  const newData = [...(data || [])]
    .sort((a, b) => parseInt(b[metric.name]) - parseInt(a[metric.name]))
    .slice(0, maxSegments - 1);

  const sumLongTail = data
    ?.slice(maxSegments - 1)
    .reduce((accumulator, record: Record) => accumulator + parseInt(record[metric.name]), 0);

  newData.push({ [slice.name]: 'Other', [metric.name]: sumLongTail });

  return newData;
}

function chartData(props: PropsWithRequiredTheme, chartColors: string[]) {
  const { maxSegments, results, metric, slice, displayAsPercentage, theme } = props;
  const labelsExceedMaxSegments = maxSegments && maxSegments < (results?.data?.length || 0);
  const newData = labelsExceedMaxSegments
    ? mergeLongTail(results.data || [], slice, metric, maxSegments)
    : results.data;

  // Chart.js pie expects labels like so: ['US', 'UK', 'Germany']
  const labels = newData?.map((d) => d[slice.name]);
  const sum = displayAsPercentage
    ? newData?.reduce((accumulator, obj) => accumulator + parseFloat(obj[metric.name]), 0)
    : null;

  // Chart.js pie expects counts like so: [23, 10, 5]
  const counts = newData?.map((d: Record) => {
    const metricValue = parseFloat(d[metric.name]);
    return displayAsPercentage && sum ? (metricValue * 100) / sum : metricValue;
  });

  return {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: chartColors,
        borderColor: theme.charts.pie.borderColor,
        borderWidth: theme.charts.pie.borderWidth,
        weight: theme.charts.pie.weight,
      },
    ],
  };
}
