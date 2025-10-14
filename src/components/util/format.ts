import { format as formatDate } from 'date-fns';

import { parseTime } from '../util/timezone';

type Type = 'number' | 'date' | 'string';

type Options = {
  abbreviateLongNumbers?: boolean;
  dateFormat?: string;
  dps?: number;
  meta?: { pretext?: string; posttext?: string };
  truncate?: number;
  type?: Type;
};

function numberFormatter(dps: number | undefined | null) {
  const fallback = dps == null || dps < 0;
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: fallback ? 0 : dps, // Minimum number of digits after the decimal
    maximumFractionDigits: fallback ? 2 : dps, // Maximum number of digits after the decimal
  });
}

const dateFormatter = new Intl.DateTimeFormat();

/**
 * Formats a value according to the specified options
 *
 * Runtime assumptions:
 * - Metrics are always numeric and should be formatted as numbers
 * - Date strings should be in ISO format or end with 'T00:00:00.000'
 * - DateFormat should be pre-calculated based on granularity and theme before calling this function
 * - Meta objects may contain pretext/posttext for value wrapping
 *
 * Note: Granularity-based formatting is handled at the component level where theme is available.
 * This function expects the dateFormat to be pre-calculated and passed in the options.
 *
 * @param str - The string value to format
 * @param opt - Formatting options or type
 * @returns The formatted value as a string
 */
export default function formatValue(str: string = '', opt: Type | Options = 'string') {
  if (str === null) return null;

  const { abbreviateLongNumbers, type, dateFormat, meta, truncate, dps }: Options =
    typeof opt === 'string' ? { type: opt } : opt;

  if (type === 'number' && !abbreviateLongNumbers)
    return wrap(numberFormatter(dps).format(parseFloat(str)));

  if (type === 'number' && abbreviateLongNumbers) {
    const num = parseFloat(str);
    if (isNaN(num)) return wrap(str);
    return wrap(
      num.toLocaleString('en-US', {
        // add suffixes for thousands, millions, and billions
        // the maximum number of decimal places to use
        maximumFractionDigits: dps ?? 2,
        // specify the abbreviations to use for the suffixes
        notation: 'compact',
        compactDisplay: 'short',
      }),
    );
  }

  if (type === 'date' && str.endsWith('T00:00:00.000')) {
    return wrap(dateFormatter.format(new Date(str)));
  }

  if (type === 'date') return wrap(new Date(str).toLocaleString());

  if (truncate) {
    return str?.length > truncate
      ? `${meta?.pretext || ''}${str.substring(0, truncate)}...`
      : wrap(str);
  }

  if (dateFormat && str) return wrap(formatDate(parseTime(str), dateFormat));

  return str;

  function wrap(v: string) {
    return `${meta?.pretext || ''}${v}${meta?.posttext || ''}`;
  }
}

export const detectAndReturnLinks = (text: string) => {
  if (!text) {
    return { linkText: null, linkUrl: null };
  }
  const linkData = /\[(.*)\]\((.*)\)/.exec(text);
  return { linkText: linkData?.[1], linkUrl: encodeURI(linkData?.[2] || '') };
};
