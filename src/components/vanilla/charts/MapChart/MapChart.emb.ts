import { loadData } from '@embeddable.com/core';
import {
  EmbeddedComponentMeta,
  Inputs,
  defineComponent,
  definePreview,
} from '@embeddable.com/react';

import Component from './index';
import { previewData } from '../../../preview.data.constants';

export const meta = {
  name: 'MapChart',
  label: 'World map',
  classNames: ['inside-card'],
  defaultHeight: 650,
  defaultWidth: 1130,
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
      name: 'segments',
      type: 'dimension',
      label: 'Countries',
      required: true,
      config: {
        dataset: 'ds',
        supportedTypes: ['string'],
      },
      category: 'Chart data',
    },
    {
      name: 'metric',
      type: 'measure',
      label: 'Metric',
      required: true,
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
  ],
} as const satisfies EmbeddedComponentMeta;

export const preview = definePreview(Component, {
  segments: previewData.dimension,
  metric: previewData.measure,
  results: previewData.results1Measure1Dimension,
  title: '',
  showLabels: false,
  enableDownloadAsCSV: false,
  enableDownloadAsPNG: false,
  isTimeDimension: false,
});

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>, _, clientContext) => {
    return {
      ...inputs,
      results: loadData({
        from: inputs.ds,
        select: [inputs.segments, inputs.metric],
        timezone: clientContext.timezone || 'UTC',
      }),
    };
  },
});
