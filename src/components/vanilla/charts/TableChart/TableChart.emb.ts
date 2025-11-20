import {
  Dimension,
  Measure,
  OrderBy,
  isDimension,
  isMeasure,
  loadData,
} from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import SortDirectionType from '../../../../types/SortDirection.type.emb';
import Component, { Props } from './index';
import TimeZones from '../../../../types/TimeZones.type.emb';

export const meta = {
  name: 'TableChart',
  label: 'Table',
  defaultHeight: 300,
  defaultWidth: 900,
  classNames: ['inside-card'],
  category: 'Charts: essentials',
  inputs: [
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset to display',
      description: 'Dataset',
      defaultValue: false,
      category: 'Chart data',
    },
    {
      name: 'columns',
      type: 'dimensionOrMeasure',
      label: 'Columns',
      array: true,
      required: true,
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
      inputs: [
        {
          name: 'customColumnLabel',
          type: 'string',
          label: 'Column Header',
          description: 'Custom label to display instead of the default column header',
        },
      ],
    },
    // Chart settings
    {
      name: 'timezone',
      type: TimeZones as never,
      label: 'Time Zone',
      description: 'The time zone to use for date formatting',
      category: 'Chart settings',
      defaultValue: 'UTC',
    },
    {
      name: 'title',
      type: 'string',
      label: 'Title',
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
      name: 'maxPageRows',
      type: 'number',
      label: 'Max Page Rows',
      category: 'Chart settings',
    },
    {
      name: 'defaultSort',
      type: 'dimensionOrMeasure',
      config: {
        dataset: 'ds',
      },
      label: 'Default Sort',
      category: 'Chart settings',
    },
    {
      name: 'defaultSortDirection',
      type: SortDirectionType as never,
      defaultValue: 'Ascending',
      label: 'Default Sort Direction',
      category: 'Chart settings',
    },
    {
      name: 'dps',
      type: 'number',
      label: 'Number decimal places',
      description: 'Number of decimal places to show for numeric values',
      category: 'Formatting',
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
      name: 'stripMarkdownFromCSV',
      type: 'boolean',
      label: 'Strip Markdown from CSV',
      description: 'Remove any markdown formatting from text when downloading as CSV',
      category: 'Export options',
      defaultValue: true,
    },
    // Table styling
    {
      name: 'minColumnWidth',
      type: 'number',
      label: 'Minimum column width in pixels',
      defaultValue: 150,
      category: 'Chart styling',
    },
    {
      name: 'expandForJSON',
      type: 'boolean',
      label: 'Expand cells for JSON objects',
      description: 'If a cell contains a JSON object, expand the cell to show the full object',
      defaultValue: true,
      category: 'Chart styling',
    },
    {
      name: 'fontSize',
      type: 'number',
      label: 'Font size in pixels',
      category: 'Chart styling',
    },
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent<
  Props,
  typeof meta,
  {
    downloadAll: boolean;
    maxRowsFit: number;
    page: number;
    prevVariableValues: Record<string, any>;
    sort: OrderBy[];
  }
>(Component, meta, {
  props: (inputs: Inputs<typeof meta>, [state]) => {
    const currVariableValues = inputs?.ds?.variableValues || {};
    const prevVariableValues = state?.prevVariableValues || {};

    const limit =
      inputs.maxPageRows || state?.maxRowsFit
        ? Math.min(inputs.maxPageRows || 1000, Math.max(state?.maxRowsFit, 1) || 1000)
        : 0;

    const defaultSortDirection = inputs.defaultSortDirection === 'Ascending' ? 'asc' : 'desc';

    const defaultSort =
      inputs.columns
        ?.filter((c) => c.name !== inputs.defaultSort?.name)
        .map((property) => ({
          property,
          direction: defaultSortDirection,
        })) || [];

    if (inputs.defaultSort) {
      defaultSort.unshift({
        property: inputs.defaultSort,
        direction: defaultSortDirection,
      });
    }

    // Deep compare the variable values to determine if the dataset has changed
    if (state && JSON.stringify(currVariableValues) !== JSON.stringify(prevVariableValues)) {
      state.prevVariableValues = currVariableValues;
      state.page = 0;
    }

    // Results are per page - no need to get the entire dataset to show one page
    const results =
      limit < 1
        ? { isLoading: true }
        : loadData({
            from: inputs.ds,
            select: inputs.columns,
            limit,
            offset: limit * (state?.page || 0),
            orderBy: state?.sort || defaultSort,
            timezone: inputs.timezone,
          });

    // All results get loaded when the download all button is clicked (otherwise they return empty)
    const allResults = loadData({
      from: inputs.ds,
      select: inputs.columns,
      limit: state?.downloadAll ? 10_000 : 0,
      offset: 0,
      orderBy: state?.sort || defaultSort,
      timezone: inputs.timezone,
    });

    return {
      ...inputs,
      limit,
      defaultSort,
      results,
      allResults,
    };
  },
});
