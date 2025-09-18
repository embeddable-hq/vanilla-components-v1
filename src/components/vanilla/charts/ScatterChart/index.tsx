import Container from '../../Container';
import useTimeseries from '../../../hooks/useTimeseries';
import { DataResponse, Dimension, Granularity, Measure } from '@embeddable.com/core';
import {
  CategoryScale,
  ChartData,
  ChartOptions,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  TimeScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React from 'react';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { Scatter } from 'react-chartjs-2';
import formatValue from '../../../util/format';
import hexToRgb from '../../../util/hexToRgb';
import { setYAxisStepSize } from '../../../util/chartjs/common';
import { useTheme } from '@embeddable.com/react';
import { setChartJSDefaults } from '../../../util/chartjs/common';
import { Theme } from '../../../../themes/theme';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels,
);

type Props = {
  description?: string;
  dps?: number;
  enableDownloadAsCSV?: boolean;
  granularity?: Granularity;
  isTimeDimension: boolean;
  metrics: Measure[];
  results: DataResponse;
  reverseXAxis?: boolean;
  showLabels?: boolean;
  showLegend?: boolean;
  spanChartGaps?: boolean;
  title?: string;
  xAxis: Dimension;
  xAxisTitle?: string;
  yAxisMin?: number;
  yAxisTitle?: string;
};

type PropsWithRequiredTheme = Props & { theme: Theme };
type Record = { [p: string]: any };

export default (props: Props) => {
  const theme: Theme = useTheme() as Theme;

  // Set ChartJS defaults
  setChartJSDefaults(theme, 'scatter');

  // Add the theme to props
  const updatedProps: PropsWithRequiredTheme = {
    ...props,
    theme,
  };

  //add missing dates to time-series data
  const { fillGaps } = useTimeseries(updatedProps, 'desc');
  const { results } = updatedProps;
  const updatedData = updatedProps.isTimeDimension
    ? results?.data?.reduce(fillGaps, [])
    : results?.data;

  const scatterData = chartData(updatedProps, updatedData);

  return (
    <Container {...updatedProps} className="overflow-y-hidden">
      <Scatter
        aria-label={props.title ? `Scatter Chart: ${props.title}` : 'Scatter Chart'}
        aria-roledescription="scatter chart"
        height="100%"
        options={chartOptions(updatedProps)}
        data={scatterData}
      />
    </Container>
  );
};

function chartOptions(props: PropsWithRequiredTheme): ChartOptions<'scatter'> {
  const { theme } = props;

  return {
    responsive: true,
    maintainAspectRatio: false,
    spanGaps: props.spanChartGaps,
    animation: {
      duration: 400,
      easing: 'linear',
    },
    scales: {
      y: {
        min: props.yAxisMin,
        grid: {
          display: false,
        },
        afterDataLimits: function (axis) {
          //Disable fractions unless they exist in the data.
          setYAxisStepSize(axis, props.results, [...props.metrics], props.dps);
        },
        title: {
          display: !!props.yAxisTitle,
          text: props.yAxisTitle,
        },
      },
      x: {
        reverse: props.reverseXAxis,
        type: props.isTimeDimension ? 'time' : 'category',
        time: {
          round: props.granularity,
          isoWeekday: true,
          displayFormats: theme.dateFormats,
          unit: props.granularity,
        },
        grid: {
          display: false,
        },
        title: {
          display: !!props.xAxisTitle,
          text: props.xAxisTitle,
        },
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: props.showLabels ? 30 : 0,
        bottom: 0,
      },
    },
    plugins: {
      datalabels: {
        display: props.showLabels ? 'auto' : false,
        anchor: 'end',
        align: 'end',
        backgroundColor: theme.charts.scatter.labels.backgroundColor,
        borderRadius: theme.charts.scatter.labels.borderRadius,
        color: theme.charts.scatter.labels.color,
        font: {
          size: theme.charts.scatter.labels.font.size,
          weight: theme.charts.scatter.labels.font.weight,
        },
        formatter: (v, context) => {
          const metricIndex = context.datasetIndex;
          const metric = props.metrics[metricIndex];
          const val = v
            ? formatValue(v.y, {
                type: 'number',
                dps: props.dps,
                meta: metric?.meta,
              })
            : null;
          return val;
        },
      },
      tooltip: {
        //https://www.chartjs.org/docs/latest/configuration/tooltip.html
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            const metricIndex = context.datasetIndex;
            const metric = props.metrics[metricIndex];
            if (context.parsed.y !== null) {
              label += `: ${formatValue(`${context.parsed['y']}`, {
                type: 'number',
                dps: props.dps,
                meta: metric?.meta,
              })}`;
            }
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

function chartData(
  props: PropsWithRequiredTheme,
  updatedData: Record[] | undefined,
): ChartData<'scatter'> {
  const { theme } = props;
  return {
    datasets: props.metrics.map((metric, i) => {
      return {
        label: metric.title,
        data:
          updatedData?.map((row) => {
            const nullString = props.spanChartGaps ? '0' : 'null';
            return {
              x: row[props.xAxis.name],
              y: parseFloat(row[metric.name] || nullString),
            };
          }) || [],
        backgroundColor: hexToRgb(theme.charts.colors[i], 0.8),
      };
    }),
  };
}
