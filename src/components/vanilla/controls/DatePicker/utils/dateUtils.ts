import { Granularity, TimeRange } from '@embeddable.com/core';
import {
  differenceInCalendarDays,
  differenceInSeconds,
  format,
  getYear,
  subDays,
  subMonths,
  subQuarters,
  subYears,
} from 'date-fns';
import { getCustomGranularities } from '../../../../util/getCustomGranularities';

function toSeconds(unit: string, n: number): number {
  const unitsInSeconds: { [key: string]: number } = {
    minute: 60,
    hour: 3600,
    day: 86400,
    week: 604800,
    month: 2629800, // Roughly 30.44 days
    quarter: 7889400, // Roughly 91.31 days
    year: 31557600, // Based on a typical Gregorian year
  };
  return n * unitsInSeconds[unit];
}

export function getComparisonOptions(period: TimeRange) {
  if (!period?.from || !period?.to) {
    return [{ value: 'No comparison' }];
  }

  const days = Math.abs(differenceInCalendarDays(period.from, period.to)) + 1;

  let weekNote = '';
  if (days > 7) {
    // We have to use "from" for both, here, because otherwise it produces more than 7 days
    weekNote = getNote(subDays(period.from, 7), subDays(period.from, 1));
  } else {
    // If the period is less than 7 days, we can give the exact spread from the previous week
    weekNote = getNote(subDays(period.from, 7), subDays(period.to, 7));
  }

  return [
    { value: 'No comparison' },
    {
      value: 'Previous period',
      note: getNote(subDays(period.from, days), subDays(period.to, days)),
    },
    {
      value: 'Previous week',
      note: weekNote,
    },
    {
      value: 'Previous month',
      note: getNote(subMonths(period.from, 1), subMonths(period.to, 1)),
    },
    {
      value: 'Previous quarter',
      note: getNote(subQuarters(period.from, 1), subQuarters(period.to, 1)),
    },
    {
      value: 'Previous year',
      note: getNote(subYears(period.from, 1), subYears(period.to, 1)),
    },
  ];
}

export function getComparisonPeriod(rts: string, period: TimeRange) {
  if (!period?.from || !period?.to) {
    return {
      relativeTimeString: 'No comparison',
      from: new Date(),
      to: new Date(),
    };
  }
  if (rts === 'Previous week') {
    // Same calculation here, in order to keep the range consistent with the options
    const days = Math.abs(differenceInCalendarDays(period.from, period.to)) + 1;
    const from = subDays(period.from, 7);
    const to = days > 7 ? subDays(period.from, 1) : subDays(period.to, 7);
    return {
      relativeTimeString: 'previous week',
      from,
      to,
    };
  }
  if (rts === 'Previous month') {
    return {
      relativeTimeString: 'previous month',
      from: subMonths(period.from, 1),
      to: subMonths(period.to, 1),
    };
  } else if (rts === 'Previous quarter') {
    return {
      relativeTimeString: 'previous quarter',
      from: subQuarters(period.from, 1),
      to: subQuarters(period.to, 1),
    };
  } else if (rts === 'Previous year') {
    return {
      relativeTimeString: 'previous year',
      from: subYears(period.from, 1),
      to: subYears(period.to, 1),
    };
  } else {
    // Previous period
    const days = Math.abs(differenceInCalendarDays(period.from, period.to)) + 1;
    return {
      relativeTimeString: 'previous period',
      from: subDays(period.from, days),
      to: subDays(period.to, days),
    };
  }
}

export function getNote(from: Date, to: Date) {
  const formattedFrom = format(
    from,
    getYear(from) === getYear(new Date()) ? 'd MMM' : 'd MMM yyyy',
  );

  const formattedTo = format(to, getYear(to) === getYear(new Date()) ? 'd MMM' : 'd MMM yyyy');

  if (formattedFrom === formattedTo) {
    return formattedFrom;
  } else {
    return `${formattedFrom} - ${formattedTo}`;
  }
}

type GranularityResponse = {
  isLoading: boolean;
  data: { value: string }[];
  recommended: { value: Granularity };
};

export function getValidGranularities(period?: TimeRange): GranularityResponse {
  const data: { value: Granularity }[] = [];

  //period boundaries for valid granularity options
  const gSettings: { [key: string]: { min: number; max: number } } = {
    second: { min: 2, max: 100 },
    minute: { min: toSeconds('minute', 2), max: toSeconds('minute', 100) },
    hour: { min: toSeconds('hour', 2), max: toSeconds('hour', 100) },
    day: { min: toSeconds('day', 0.5), max: toSeconds('day', 168) },
    week: { min: toSeconds('week', 2), max: toSeconds('week', 365) },
    month: { min: toSeconds('month', 2), max: toSeconds('month', 730) },
    quarter: { min: toSeconds('quarter', 2), max: toSeconds('quarter', 36) },
    year: { min: toSeconds('year', 1.5), max: toSeconds('year', 1000) },
  };

  const granularities = Object.keys(gSettings);
  const diff = differenceInSeconds(period?.to || new Date(), period?.from || new Date());

  granularities.forEach((value) => {
    const { min, max } = gSettings[value];
    if (diff < min || diff > max) return;
    data.push({ value: value as Granularity });
  });

  let recommendedG: { value: Granularity } = { value: 'day' };
  if (data.length >= 2) recommendedG = data[data.length - 2]; //set the recommended granularity option as the penultimate valid option.

  // Get custom granularities from window object if available
  const windowGranularities = getCustomGranularities();
  if (windowGranularities) {
    windowGranularities.forEach((g: string) => {
      if (!data.find((d) => d.value === g)) data.push({ value: g as Granularity });
    });
  }

  return {
    isLoading: false,
    data,
    recommended: recommendedG,
  };
}
