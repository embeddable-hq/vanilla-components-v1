import { DimensionOrMeasure, OrderBy, OrderDirection, Value, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';
import { SortDirection } from '../../../../enums/SortDirection';
import SortDirectionType from '../../../../types/SortDirection.type.emb';

import Component, { Props } from './index';

export const meta = {
  name: 'Dropdown',
  label: 'Dropdown',
  defaultWidth: 300,
  defaultHeight: 80,
  classNames: ['on-top'],
  category: 'Controls: inputs & dropdowns',
  inputs: [
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset',
      description: 'Dataset',
      category: 'Dropdown values',
    },
    {
      name: 'property',
      type: 'dimension',
      label: 'Property',
      config: {
        dataset: 'ds',
      },
      category: 'Dropdown values',
    },
    {
      name: 'sortBy',
      type: 'dimensionOrMeasure',
      label: 'Optional Sort By Additional Dimension or Measure',
      config: {
        dataset: 'ds',
      },
      category: 'Dropdown values',
    },
    {
      name: 'sortDirection',
      type: SortDirectionType,
      defaultValue: SortDirection.DESCENDING,
      label: 'Sort direction',
      category: 'Chart data',
    },
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      category: 'Settings',
    },
    {
      name: 'defaultValue',
      type: 'string',
      label: 'Default value',
      category: 'Pre-configured variables',
    },
    {
      name: 'placeholder',
      type: 'string',
      label: 'Placeholder',
      category: 'Settings',
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Default number of options',
      defaultValue: 100,
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
          type: 'string',
        },
      ],
    },
  ],
  variables: [
    {
      name: 'dropdown choice',
      type: 'string',
      defaultValue: Value.noFilter(),
      inputs: ['defaultValue'],
      events: [{ name: 'onChange', property: 'value' }],
    },
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent<Props, typeof meta, { search: string }>(Component, meta, {
  props: (inputs: Inputs<typeof meta>, [embState]) => {
    if (!inputs.ds)
      return {
        ...inputs,
        options: [] as never,
      };
    const defaultSortDirection = inputs.sortDirection === 'Ascending' ? 'asc' : 'desc';
    const orderProp: OrderBy[] = [];

    if (inputs.sortBy) {
      orderProp.push({
        property: inputs.sortBy,
        direction: defaultSortDirection,
      });
    }

    const select: DimensionOrMeasure[] = inputs.property ? [inputs.property] : [];
    if (inputs.sortBy) {
      select.push(inputs.sortBy);
    }

    return {
      ...inputs,
      options: loadData({
        from: inputs.ds,
        select,
        limit: inputs.limit || 1000,
        orderBy: orderProp,
        filters:
          embState?.search && inputs.property
            ? [
                {
                  operator: 'contains',
                  property: inputs.property,
                  value: embState?.search,
                },
              ]
            : undefined,
      }),
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
