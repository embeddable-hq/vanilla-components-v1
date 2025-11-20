import { DataResponse, Dimension, Granularity, Measure } from '@embeddable.com/core';
import {
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  Filler,
  Legend,
  PointElement,
  LineElement,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'react-chartjs-2';

import formatValue from '../../../../util/format';
import getBarChartOptions from '../../../../util/getBarChartOptions';
import { setChartJSDefaults } from '../../../../util/chartjs/common';
import { Theme } from '../../../../../themes/theme';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels,
);

type Props = {
  description?: string;
  displayHorizontally?: boolean;
  dps?: number;
  enableDownloadAsCSV?: boolean;
  lineMetrics?: Measure[];
  metrics: Measure[];
  results?: DataResponse;
  reverseXAxis?: boolean;
  secondAxisTitle?: string;
  showLabels?: boolean;
  showLegend?: boolean;
  showSecondYAxis?: boolean;
  sortBy?: Dimension | Measure;
  spanChartGaps?: boolean;
  stackMetrics?: boolean;
  theme: Theme;
  timezone?: string;
  title?: string;
  xAxis: Dimension;
  xAxisTitle?: string;
  yAxisTitle?: string;
};

export default function BarChart({ ...props }: Props): React.JSX.Element {
  return (
    <Chart
      aria-label={props.title ? `Bar Chart: ${props.title}` : 'Bar Chart'}
      aria-roledescription="bar chart"
      type="bar"
      height="100%"
      options={getBarChartOptions({ ...props, stacked: false })}
      data={chartData(props)}
    />
  );
}

function chartData(props: Props): ChartData<'bar' | 'line'> {
  const { results, xAxis, metrics, lineMetrics, showSecondYAxis, theme } = props;
  const granularity = xAxis?.inputs?.granularity;
  const {
    charts: { colors },
    dateFormats,
  } = theme;
  setChartJSDefaults(theme);

  // Check for bar chart color overrides in theme
  let chartColors = colors;
  if (theme.charts.bar.colors) {
    chartColors = theme.charts.bar.colors;
  }
  const isTimeDimension = xAxis?.nativeType === 'time';

  let dateFormat: string | undefined;
  if (granularity && granularity in dateFormats) {
    dateFormat = dateFormats[granularity];
  }

  // If spanChartGaps is false, filter out any values missing metric data
  let dataToUse = results?.data || [];
  if (!props.spanChartGaps) {
    dataToUse = dataToUse.filter((d) =>
      metrics.some((m) => d[m.name] !== null && d[m.name] !== undefined),
    );
  }

  const labels = [
    ...new Set(
      dataToUse.map((d: { [p: string]: string }) => {
        const value = d[xAxis?.name];
        return formatValue(value ?? '', {
          meta: xAxis?.meta,
          ...(isTimeDimension ? { dateFormat } : {}),
          timezone: props.timezone,
        });
      }),
    ),
  ] as string[];

  const metricsDatasets =
    metrics?.map((metric, i) => ({
      backgroundColor: chartColors[i % chartColors.length],
      barPercentage: 0.8,
      barThickness: 'flex',
      borderRadius: theme.charts.bar.borderRadius,
      borderSkipped: theme.charts.bar.borderSkipped,
      borderWidth: theme.charts.bar.borderWidth,
      data: dataToUse.map((d) => parseFloat(d[metric.name] || 0)) || [],
      label: metric.title,
      maxBarThickness: 50,
      minBarLength: 0,
      order: 1,
    })) || [];

  // optional metrics to display as a line on the barchart
  const lineMetricsDatasets =
    lineMetrics?.map((metric, i) => ({
      backgroundColor: chartColors[metrics.length + (i % chartColors.length)],
      borderColor: chartColors[metrics.length + (i % chartColors.length)],
      cubicInterpolationMode: theme.charts.bar.cubicInterpolationMode,
      data: dataToUse.map((d) => parseFloat(d[metric.name] || 0)) || [],
      label: metric.title,
      order: 0,
      pointHoverRadius: 3,
      pointRadius: 2,
      tension: theme.charts.bar.lineTension,
      type: 'line' as const,
      yAxisID: showSecondYAxis ? 'y1' : 'y',
    })) || [];

  return {
    labels,
    datasets: [...metricsDatasets, ...lineMetricsDatasets],
  };
}
