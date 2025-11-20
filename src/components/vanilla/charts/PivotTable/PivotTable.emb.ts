import {
  Dimension,
  EmbeddableType,
  Measure,
  NativeType,
  OrderBy,
  OrderDirection,
  isDimension,
  isMeasure,
  loadData,
} from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import { SortDirection } from '../../../../enums/SortDirection';
import SortDirectionType from '../../../../types/SortDirection.type.emb';
import { MeasureVisualizationFormat } from './enums/MeasureVisualizationFormat';
import Component from './index';
import TimeZones from '../../../../types/TimeZones.type.emb';

export const meta = {
  name: 'PivotTable',
  label: 'Pivot table',
  classNames: ['inside-card'],
  category: 'Charts: essentials',
  inputs: [
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset to display',
      category: 'Chart data',
    },
    {
      name: 'metrics',
      type: 'measure',
      label: 'Metrics',
      array: true,
      config: {
        dataset: 'ds',
      },
      category: 'Chart data',
    },
    {
      name: 'rowValues',
      type: 'dimension',
      label: 'Row Values',
      array: true,
      config: {
        dataset: 'ds',
        hideGranularity: true,
      },
      category: 'Chart data',
    },
    {
      name: 'columnValues',
      type: 'dimension',
      label: 'Column Values',
      array: true,
      config: {
        dataset: 'ds',
        hideGranularity: true,
      },
      category: 'Chart data',
    },
    // Variables to configure
    {
      name: 'granularity',
      type: 'granularity',
      label: 'Granularity (for dates)',
      defaultValue: 'week',
      category: 'Variables to configure',
    },
    // Table settings
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
    // {
    //     name: 'measureVisualizationFormat',
    //     type: MeasureVisualizationFormatType,
    //     label: 'Metrics visualization format',
    //     defaultValue: { value: MeasureVisualizationFormat.NUMERIC_VALUES_ONLY },
    //     category: 'Chart settings'
    // },
    {
      name: 'nullValueCharacter',
      type: 'string',
      label: 'Null value character',
      description: 'Character that should be displayed if value does not exist',
      defaultValue: '∅',
      category: 'Chart settings',
    },
    {
      name: 'isRowGroupDefaultExpanded',
      type: 'boolean',
      label: 'Row group expanded by default',
      defaultValue: false,
      category: 'Chart settings',
    },
    {
      name: 'columnSortingEnabled',
      type: 'boolean',
      label: 'Enable column sorting',
      defaultValue: true,
      category: 'Chart settings',
    },
    {
      name: 'rowSortDirection',
      type: SortDirectionType,
      defaultValue: SortDirection.NONE,
      label: 'Default Row Sort Direction',
      category: 'Chart settings',
    },
    {
      name: 'columnSortDirection',
      type: SortDirectionType,
      defaultValue: SortDirection.NONE,
      label: 'Default Column Sort Direction',
      category: 'Chart settings',
    },
    {
      name: 'dps',
      type: 'number',
      label: 'Number decimal places',
      description: 'Number of decimal places to show for numeric values',
      category: 'Chart settings',
    },

    // Table styling
    {
      name: 'minColumnWidth',
      type: 'number',
      label: 'Minimum metric column width in pixels',
      defaultValue: 150,
      category: 'Chart styling',
    },
    {
      name: 'minRowDimensionColumnWidth',
      type: 'number',
      label: 'Minimum row value width in pixels',
      defaultValue: 200,
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

const aggregateRowDimensions = true; // This is unfinished functionality to disable aggregation rows and show row dimension in separate column

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>, [state]) => {
    // This is necessary for backward compatibility with previous version of Pivot Table
    const rowValuesInputData = Array.isArray(inputs.rowValues)
      ? inputs.rowValues
      : [inputs.rowValues];
    const columnValuesInputData = Array.isArray(inputs.columnValues)
      ? inputs.columnValues
      : [inputs.columnValues];

    const rowDimensions = (rowValuesInputData || []).filter((input) =>
      isDimension(input),
    ) as Dimension[];
    const columnDimensions = (columnValuesInputData || []).filter((input) =>
      isDimension(input),
    ) as Dimension[];
    const measures = inputs.metrics?.filter((metric) => isMeasure(metric)) as Measure[];

    const filteredRowDimensions: Dimension[] = rowDimensions.filter(
      (dimension) => dimension && isDimension(dimension),
    );

    const sort: OrderBy[] = filteredRowDimensions.map((rowDimension) => ({
      property: rowDimension,
      // @ts-expect-error - value is set by defineComponent, may need to adjust typing in that module
      direction: (inputs.rowSortDirection?.value === SortDirection.ASCENDING
        ? 'asc'
        : 'desc') as OrderDirection,
    }));

    // Fetch data for each row dimension level
    const dataResults =
      rowDimensions?.length && aggregateRowDimensions
        ? rowDimensions.reduce((resultSet, dimension, index, dimensions) => {
            const dimensionsToFetch = [
              ...filteredRowDimensions.slice(0, index + 1),
              ...columnDimensions,
            ];

            return {
              ...resultSet,
              [`resultsDimension${index}`]: loadData({
                from: inputs.ds,
                select: [
                  ...dimensionsToFetch.filter((dimension) => dimension.nativeType !== 'time'),
                  ...dimensionsToFetch
                    .filter((dimension) => dimension.nativeType === 'time')
                    .map((timeDimension) => ({
                      dimension: timeDimension.name,
                      granularity: inputs.granularity,
                    })),
                  ...measures,
                ],
                orderBy:
                  inputs.rowSortDirection === SortDirection.NONE
                    ? undefined
                    : sort.slice(0, index + 1),
                limit: 10_000,
                timezone: inputs.timezone,
              }),
            };
          }, {})
        : {
            resultsDimension0: loadData({
              from: inputs.ds,
              select: [
                {
                  ...[...(filteredRowDimensions || []), ...columnDimensions]
                    .filter((dimension) => dimension.nativeType === 'time')
                    .map((timeDimension) => ({
                      dimension: timeDimension.name,
                      granularity: inputs.granularity,
                    })),
                },
                ...measures,
              ],
              limit: 10_000,
              timezone: inputs.timezone,
            }),
          };

    return {
      ...inputs,
      rowValues: rowValuesInputData,
      columnValues: columnDimensions,
      rowSortDirection: inputs.rowSortDirection as SortDirection,
      columnSortDirection: inputs.columnSortDirection as SortDirection,
      // measureVisualizationFormat: inputs.measureVisualizationFormat?.value, // Enable this after Bars mode will be fixed
      measureVisualizationFormat: MeasureVisualizationFormat.NUMERIC_VALUES_ONLY,
      aggregateRowDimensions,
      fontSize: inputs.fontSize,
      ...dataResults,
    };
  },
});
