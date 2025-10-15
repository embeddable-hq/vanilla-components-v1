import { Value } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';
import { SortDirection } from '../../../../enums/SortDirection';
import SortDirectionType from '../../../../types/SortDirection.type.emb';

import Component, { Props } from './index';
import TimeZoneType from '../../../../types/TimeZones.type.emb';
import { TimeZone } from '../../../../enums/TimeZone';

export const meta = {
  name: 'TimeZonePicker',
  label: 'Time Zone Picker',
  defaultWidth: 300,
  defaultHeight: 80,
  classNames: ['on-top'],
  category: 'Controls: inputs & dropdowns',
  inputs: [
    {
      name: 'defaultValue',
      type: TimeZoneType,
      label: 'Default value',
      defaultValue: TimeZone.UTC as never,
      category: 'Settings',
    },
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      category: 'Settings',
    },
    {
      name: 'placeholder',
      type: 'string',
      label: 'Placeholder',
      category: 'Settings',
    },
  ],
  events: [
    {
      name: 'onChange',
      label: 'Change',
      properties: [
        {
          name: 'value',
          type: TimeZoneType,
        },
      ],
    },
  ],
  variables: [
    {
      name: 'time zone choice',
      type: TimeZoneType,
      defaultValue: Value.noFilter(),
      inputs: [],
      events: [{ name: 'onChange', property: 'value' }],
    },
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent<Props, typeof meta, { search: string }>(Component, meta, {
  props: (inputs: Inputs<typeof meta>, [embState]) => {
    return {
      ...inputs,
      defaultValue: (inputs.defaultValue as string) || TimeZone.UTC,
      options: {
        isLoading: false,
      },
    };
  },
  events: {
    onChange: (value) => {
      return {
        value: value || Value.noFilter(),
      };
    },
  },
});
