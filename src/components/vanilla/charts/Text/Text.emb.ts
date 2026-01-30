import {
  EmbeddedComponentMeta,
  Inputs,
  defineComponent,
  definePreview,
} from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'Text',
  label: 'Text component',
  category: 'Text',
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'The title text',
      category: 'Configure chart'
    },
    {
      name: 'body',
      type: 'string',
      label: 'Body',
      description: 'The body text',
      category: 'Configure chart'
    },
    {
      name: 'titleFontSize',
      type: 'number',
      label: 'Title font size in pixels',
      category: 'Formatting'
    },
    {
      name: 'bodyFontSize',
      type: 'number',
      label: 'Body font size in pixels',
      category: 'Formatting'
    },
  ]
} as const satisfies EmbeddedComponentMeta;

export const preview = definePreview(Component, {
  title: 'Sample Title',
  body: 'This is sample body text that demonstrates how the text component renders content.',
});

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs
    };
  }
});
