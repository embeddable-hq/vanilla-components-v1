import { Dimension, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'HeatGrid',
  label: 'Heat Grid',
  defaultWidth: 300,
  defaultHeight: 200,
  classNames: ['inside-card'],
  category: 'Charts: essentials',
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
      name: 'timeProperty',
      type: 'dimension',
      label: 'Time Property',
      description: 'Used by time filters',
      config: {
        dataset: 'ds',
        hideGranularity: true,
        supportedTypes: ['time'],
      },
      category: 'Chart data',
    },
    {
      name: 'metric',
      type: 'measure',
      label: 'Metric',
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
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
      name: 'baseColor',
      type: 'string',
      label: 'Base Color (HEX, defaults to brand primary)',
      description: 'The base color for the heat grid cells',
      category: 'Chart settings',
    },
    {
      name: 'displayLegend',
      type: 'boolean',
      label: 'Display Legend',
      description: 'Whether to display the legend for the heat grid',
      defaultValue: true,
      category: 'Chart settings',
    },
    {
      name: 'displayStats',
      type: 'boolean',
      label: 'Display Statistics',
      description: 'Whether to display statistics like highest, lowest, and average values',
      defaultValue: true,
      category: 'Chart settings',
    },
    {
      name: 'includeZeroValues',
      type: 'boolean',
      label: 'Include Zero Values in Average',
      description: 'Whether to include zero values in the statistics calculations',
      defaultValue: false,
      category: 'Chart settings',
    },
    {
      name: 'statsPrefix',
      type: 'string',
      label: 'Statistics Prefix',
      description: 'Prefix for the statistical values',
      defaultValue: '',
      category: 'Chart settings',
    },
    {
      name: 'statsSuffix',
      type: 'string',
      label: 'Statistics Suffix',
      description: 'Suffix for the statistical values',
      defaultValue: '',
      category: 'Chart settings',
    },
    {
      name: 'enableDownloadAsCSV',
      type: 'boolean',
      label: 'Show download as CSV',
      category: 'Export options',
      defaultValue: false,
    },
    {
      name: 'enableDownloadAsPNG',
      type: 'boolean',
      label: 'Show download as PNG',
      category: 'Export options',
      defaultValue: false,
    },
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
      results: loadData({
        from: inputs.ds,
        select: [
          {
            dimension: inputs.timeProperty?.name as string,
            granularity: 'day',
          },
          inputs.metric,
        ],
        limit: 10_000,
      }),
    };
  },
});
