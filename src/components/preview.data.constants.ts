import { mockDataResponse, mockDimension, mockMeasure } from '@embeddable.com/core';

const dimensionName = 'country';
const dimensionGroupName = 'category';
const geoDimensionName = 'location';
const measureName = 'count';
const measureName2 = 'revenue';
const timeDimensionName = 'date';

const dimension = mockDimension(dimensionName, 'string', { title: 'Country' });
const dimensionGroup = mockDimension(dimensionGroupName, 'string', { title: 'Category' });
const geoDimension = mockDimension(geoDimensionName, 'geo', { title: 'Location' });
const measure = mockMeasure(measureName, 'number', { title: 'Count' });
const measure2 = mockMeasure(measureName2, 'number', { title: 'Revenue' });
const timeDimension = mockDimension(timeDimensionName, 'time', { title: 'Date' });

const results1Measure1Dimension = mockDataResponse(
  [dimensionName, measureName],
  [
    ['US', 120],
    ['GER', 100],
    ['UK', 80],
    ['FRA', 70],
    ['SPA', 55],
  ],
);

const results1Measure1DimensionVariant = mockDataResponse(
  [dimensionName, dimensionGroupName, measureName],
  [
    ['US', 100],
    ['GER', 90],
    ['UK', 75],
    ['FRA', 85],
    ['SPA', 60],
  ],
);

const results1Measure2Dimensions = mockDataResponse(
  [dimensionName, dimensionGroupName, measureName],
  [
    ['US', 'Cat 1', 120],
    ['US', 'Cat 2', 130],

    ['GER', 'Cat 1', 100],
    ['GER', 'Cat 2', 110],

    ['UK', 'Cat 1', 80],
    ['UK', 'Cat 2', 95],

    ['FRA', 'Cat 1', 70],
    ['FRA', 'Cat 2', 60],

    ['SPA', 'Cat 1', 55],
    ['SPA', 'Cat 2', 35],
  ],
);

const results1Measure2DimensionsVariant = mockDataResponse(
  [dimensionName, dimensionGroupName, measureName],
  [
    ['US', 'Cat 1', 100],
    ['US', 'Cat 2', 115],

    ['GER', 'Cat 1', 90],
    ['GER', 'Cat 2', 125],

    ['UK', 'Cat 1', 75],
    ['UK', 'Cat 2', 105],

    ['FRA', 'Cat 1', 85],
    ['FRA', 'Cat 2', 55],

    ['SPA', 'Cat 1', 60],
    ['SPA', 'Cat 2', 30],
  ],
);

const results1Measure = mockDataResponse([measureName], [[120]]);
const results1MeasureVariant = mockDataResponse([measureName], [[100]]);

const results1Measure1TimeDimension = mockDataResponse(
  [timeDimensionName, measureName],
  [
    ['2024-01-01T00:00:00.000', 120],
    ['2024-01-08T00:00:00.000', 140],
    ['2024-01-15T00:00:00.000', 95],
    ['2024-01-22T00:00:00.000', 160],
    ['2024-01-29T00:00:00.000', 110],
  ],
);

const results1Measure1TimeDimension1Group = mockDataResponse(
  [timeDimensionName, dimensionGroupName, measureName],
  [
    ['2026-01-01T00:00:00.000', 'Cat 1', 70],
    ['2026-01-01T00:00:00.000', 'Cat 2', 50],

    ['2026-01-08T00:00:00.000', 'Cat 1', 85],
    ['2026-01-08T00:00:00.000', 'Cat 2', 55],

    ['2026-01-15T00:00:00.000', 'Cat 1', 55],
    ['2026-01-15T00:00:00.000', 'Cat 2', 40],

    ['2026-01-22T00:00:00.000', 'Cat 1', 95],
    ['2026-01-22T00:00:00.000', 'Cat 2', 65],

    ['2026-01-29T00:00:00.000', 'Cat 1', 65],
    ['2026-01-29T00:00:00.000', 'Cat 2', 45],
  ],
);

const results1Measure1TimeDimension1GroupPrevious = mockDataResponse(
  [timeDimensionName, dimensionGroupName, measureName],
  [
    ['2025-12-01T00:00:00.000', 'Cat 1', 60],
    ['2025-12-01T00:00:00.000', 'Cat 2', 40],

    ['2025-12-08T00:00:00.000', 'Cat 1', 75],
    ['2025-12-08T00:00:00.000', 'Cat 2', 45],

    ['2025-12-15T00:00:00.000', 'Cat 1', 50],
    ['2025-12-15T00:00:00.000', 'Cat 2', 35],

    ['2025-12-22T00:00:00.000', 'Cat 1', 80],
    ['2025-12-22T00:00:00.000', 'Cat 2', 55],

    ['2025-12-29T00:00:00.000', 'Cat 1', 55],
    ['2025-12-29T00:00:00.000', 'Cat 2', 35],
  ],
);

const results2Measures1Dimension = mockDataResponse(
  [dimensionName, measureName, measureName2],
  [
    ['US', 120, 5500],
    ['GER', 100, 4200],
    ['UK', 80, 3800],
    ['FRA', 70, 3100],
    ['SPA', 55, 2400],
  ],
);

const results1Measure1GeoDimension = mockDataResponse(
  [geoDimensionName, measureName],
  [
    ['40.7128,-74.0060', 120], // New York
    ['34.0522,-118.2437', 95], // Los Angeles
    ['41.8781,-87.6298', 85], // Chicago
    ['29.7604,-95.3698', 75], // Houston
    ['33.4484,-112.0740', 65], // Phoenix
    ['39.7392,-104.9903', 55], // Denver
    ['47.6062,-122.3321', 90], // Seattle
    ['37.7749,-122.4194', 110], // San Francisco
  ],
);

const dataset = {
  embeddableId: '',
  datasetId: '',
  inputName: '',
  variableValues: {},
};

export const previewData = {
  dataset,
  dimension,
  dimensionGroup,
  geoDimension,
  measure,
  measure2,
  results1Measure,
  results1Measure1Dimension,
  results1Measure1DimensionVariant,
  results1Measure1GeoDimension,
  results1Measure1TimeDimension,
  results1Measure1TimeDimension1Group,
  results1Measure1TimeDimension1GroupPrevious,
  results1Measure2Dimensions,
  results1Measure2DimensionsVariant,
  results1MeasureVariant,
  results2Measures1Dimension,
  timeDimension,
} as const;
