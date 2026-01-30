import { Granularity, TimeRange } from '@embeddable.com/core';
import React from 'react';

import Container from '../../Container';
import DateRangeWithGranularity from './components/DateRangeWithGranularity';

export type Props = {
  defaultGranularity?: Granularity;
  defaultPeriod?: TimeRange;
  onChange: (v: TimeRange | null) => void;
  onChangeComparison: (v: TimeRange | null) => void;
  onChangeGranularity: (v: Granularity | null) => void;
  onChangePeriod: (v: TimeRange | null) => void;
  showGranularity?: boolean;
  timezone?: string;
  title?: string;
  value: TimeRange;
};

export default (props: Props) => {
  return (
    <Container {...props}>
      <DateRangeWithGranularity
        defaultPeriod={props.value}
        defaultGranularity={props.defaultGranularity}
        showGranularity={props.showGranularity}
        onChangePeriod={props.onChange}
        onChangeGranularity={props.onChangeGranularity}
        onChangeComparison={props.onChangeComparison}
        timezone={props.timezone || 'UTC'}
      />
    </Container>
  );
};
