import { OrderBy, loadData } from '@embeddable.com/core';
import {
  EmbeddedComponentMeta,
  Inputs,
  defineComponent,
  definePreview,
} from '@embeddable.com/react';

import Component from './index';
import { previewData } from '../../../preview.data.constants';

export const meta = {
  name: 'CompareLineChart',
  label: 'Line comparison (time-series)',
  classNames: ['inside-card'],
  category: 'Charts: time-series comparison',
  inputs: [
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset',
      description: 'Dataset',
      defaultValue: false,
      category: 'Chart data',
    },
    {
      name: 'xAxis',
      type: 'dimension',
      label: 'X-Axis',
      config: {
        dataset: 'ds',
        supportedTypes: ['time'],
        hideGranularity: true,
      },
      category: 'Chart data',
    },
    {
      name: 'comparisonXAxis',
      type: 'dimension',
      label: 'Comparison X-Axis (optional)',
      config: {
        dataset: 'ds',
        supportedTypes: ['time'],
        hideGranularity: true,
      },
      category: 'Chart data',
    },
    {
      name: 'metrics',
      type: 'measure',
      array: true,
      label: 'Metrics',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'granularity',
      type: 'granularity',
      label: 'Granularity',
      defaultValue: 'day',
      category: 'Variables to configure',
    },
    {
      name: 'timeFilter',
      type: 'timeRange',
      label: 'Primary date range',
      description: 'Date range',
      category: 'Variables to configure',
    },
    {
      name: 'prevTimeFilter',
      type: 'timeRange',
      label: 'Comparison date range',
      description: 'Date range',
      category: 'Variables to configure',
    },
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'The title for the chart',
      category: 'Chart settings',
    },
    {
      name: 'description',
      type: 'string',
      label: 'Description',
      description: 'The description for the chart',
      category: 'Chart settings',
    },
    {
      name: 'xAxisTitle',
      type: 'string',
      label: 'X-Axis Title',
      category: 'Chart settings',
    },
    {
      name: 'comparisonXAxisTitle',
      type: 'string',
      label: 'Comparison X-Axis Title (optional)',
      description: 'Title for the comparison X-Axis',
      category: 'Chart settings',
      defaultValue: '',
    },
    {
      name: 'yAxisTitle',
      type: 'string',
      label: 'Y-Axis Title',
      category: 'Chart settings',
    },
    {
      name: 'showLabels',
      type: 'boolean',
      label: 'Show Labels',
      category: 'Chart settings',
      defaultValue: false,
    },
    {
      name: 'applyFill',
      type: 'boolean',
      label: 'Color fill space under line',
      category: 'Chart settings',
      defaultValue: false,
    },
    {
      name: 'yAxisMin',
      type: 'number',
      label: 'Y-Axis minimum value',
      category: 'Chart settings',
    },
    {
      name: 'showLegend',
      type: 'boolean',
      label: 'Show Legend',
      category: 'Chart settings',
      defaultValue: true,
    },
    {
      name: 'enableDownloadAsCSV',
      type: 'boolean',
      label: 'Show download as CSV',
      category: 'Export options',
      defaultValue: true,
    },
    {
      name: 'enableDownloadAsPNG',
      type: 'boolean',
      label: 'Show download as PNG',
      category: 'Export options',
      defaultValue: true,
    },
    {
      name: 'dps',
      type: 'number',
      label: 'Decimal Places',
      category: 'Formatting',
    },
  ],
} as const satisfies EmbeddedComponentMeta;

export const preview = definePreview(Component, {
  applyFill: false,
  ds: previewData.dataset,
  enableDownloadAsCSV: false,
  enableDownloadAsPNG: false,
  granularity: 'day',
  metrics: [previewData.measure],
  prevTimeFilter: {
    from: new Date('2025-12-01T00:00:00.000'),
    to: new Date('2025-12-31T23:59:59.999'),
    relativeTimeString: 'Previous Month',
  },
  results: previewData.results1Measure1TimeDimension1Group,
  showLabels: false,
  timeFilter: {
    from: new Date('2026-01-01T00:00:00.000'),
    to: new Date('2026-01-31T23:59:59.999'),
    relativeTimeString: 'This Month',
  },
  title: '',
  xAxis: previewData.timeDimension,
  prevResults: previewData.results1Measure1TimeDimension1GroupPrevious,
});

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>, _, clientContext) => {
    const orderProp: OrderBy[] = [];

    orderProp.push({
      property: inputs.xAxis,
      direction: 'desc',
    });

    return {
      ...inputs,
      results: loadData({
        from: inputs.ds,
        limit: 500,
        orderBy: orderProp,
        select: [
          {
            dimension: inputs.xAxis?.name,
            granularity: inputs.granularity,
          },
          inputs.metrics,
        ],
        filters:
          inputs.timeFilter && inputs.xAxis
            ? [
                {
                  property: inputs.xAxis,
                  operator: 'inDateRange',
                  value: inputs.timeFilter,
                },
              ]
            : undefined,
        timezone: clientContext.timezone || 'UTC',
      }),
      prevResults: loadData({
        from: inputs.ds,
        select: [
          {
            dimension: inputs.xAxis?.name,
            granularity: inputs.granularity,
          },
          inputs.metrics,
        ],
        limit: !inputs.prevTimeFilter ? 1 : 500,
        orderBy: orderProp,
        filters:
          inputs.prevTimeFilter && inputs.xAxis
            ? [
                {
                  property: inputs.xAxis,
                  operator: 'inDateRange',
                  value: inputs.prevTimeFilter,
                },
              ]
            : undefined,
        timezone: clientContext.timezone || 'UTC',
      }),
    };
  },
});
