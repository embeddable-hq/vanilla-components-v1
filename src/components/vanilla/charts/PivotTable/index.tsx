import { DataResponse, Dimension, Measure, isDimension } from '@embeddable.com/core';
import React from 'react';

import { SortDirection } from '../../../../enums/SortDirection';
import Container from '../../Container';
import PivotTable from './PivotTable';
import { MeasureVisualizationFormat } from './enums/MeasureVisualizationFormat';

type DynamicDimensionsData = {
  [key in `resultsDimension${number}`]: DataResponse;
};

type Props = {
  aggregateRowDimensions?: boolean;
  columnSortDirection?: SortDirection;
  columnValues?: Dimension[];
  description?: string;
  dps?: number;
  fontSize?: number;
  isRowGroupDefaultExpanded?: boolean;
  measureVisualizationFormat: MeasureVisualizationFormat;
  metrics: Measure[];
  minColumnWidth?: number;
  minRowDimensionColumnWidth?: number;
  nullValueCharacter?: string;
  rowSortDirection?: SortDirection;
  rowValues?: Dimension[];
  title: string;
} & DynamicDimensionsData;

export default ({ rowValues, columnValues, metrics, ...props }: Props) => {
  const results: DataResponse[] = [];

  if (rowValues?.length && props.aggregateRowDimensions) {
    rowValues?.forEach((rowDimension, index) => {
      if (props[`resultsDimension${index}`]) {
        results.push(props[`resultsDimension${index}`]);
      }
    });
  } else {
    results.push(props.resultsDimension0);
  }

  return (
    <Container
      title={props.title}
      results={results}
      description={props.description}
      className="overflow-auto"
    >
      {results.every((result) => result && !result.isLoading && !result.error) && (
        <PivotTable
          {...props}
          columnDimensions={columnValues}
          data={results.map((result) => result.data!)}
          defaultColumnDimensionSortDirection={props.columnSortDirection}
          defaultRowDimensionSortDirection={props.rowSortDirection}
          dps={props.dps}
          fontSize={props.fontSize ? `${props.fontSize}px` : undefined}
          measures={metrics}
          rowDimensions={rowValues?.filter((metric) => isDimension(metric)) as Dimension[]}
        />
      )}
    </Container>
  );
};
