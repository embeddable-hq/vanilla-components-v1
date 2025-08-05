import { Dimension, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'HeatGrid',
  label: 'Heat Grid',
  defaultWidth: 300,
  defaultHeight: 200,
  classNames: ['inside-card'],
  category: 'Charts',
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
      name: 'granularity',
      type: 'granularity',
      label: 'Granularity',
      defaultValue: 'day',
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
        select: [inputs.metric, inputs.timeProperty],
        limit: 10_000,
      }),
    };
  },
});

/*
export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
      results: loadData({
        from: inputs.ds,
        measures: [inputs.metric],
        filters:
          inputs.timeFilter?.from && inputs.timeProperty
            ? [
                {
                  property: inputs.timeProperty,
                  operator: 'inDateRange',
                  value: inputs.timeFilter,
                },
              ]
            : undefined,
      }),
    };
  },
});

*/
