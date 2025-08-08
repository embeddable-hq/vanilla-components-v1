import { DimensionOrMeasure, OrderBy, OrderDirection, Value, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component, { Props } from './index';

export const meta = {
  name: 'MultiSelectDropdown',
  label: 'Multi-Select dropdown',
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
      name: 'sortByDirection',
      type: 'string',
      label: 'Sort By Direction (asc/desc)',
      defaultValue: 'asc',
      category: 'Dropdown values',
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
      array: true,
      label: 'Default value',
      category: 'Pre-configured variables',
    },
    {
      name: 'placeholder',
      type: 'string',
      label: 'Placeholder',
      defaultValue: 'Select...',
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
          array: true,
        },
      ],
    },
  ],
  variables: [
    {
      name: 'dropdown choices',
      type: 'string',
      defaultValue: Value.noFilter(),
      array: true,
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

    const orderProp: OrderBy[] = [];
    let sortByDirection = 'asc' as OrderDirection;
    if (inputs.sortByDirection === 'desc' || inputs.sortByDirection === 'asc') {
      sortByDirection = inputs.sortByDirection as OrderDirection;
    }
    const sortDirection = sortByDirection;

    if (inputs.sortBy) {
      orderProp.push({
        property: inputs.sortBy,
        direction: sortDirection,
      });
    }

    const select: DimensionOrMeasure[] = inputs.property ? [inputs.property] : [];
    if (inputs.sortBy && inputs.sortBy !== inputs.property) {
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
        value: value.length ? value : Value.noFilter(),
      };
    },
  },
});
