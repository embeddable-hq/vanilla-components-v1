type NativeTypes = {
  granularity?: {
    options?: string[];
  };
  [key: string]: any;
};

type WindowSimplified = {
  __EMBEDDABLE_BUNDLE_HASH__?: string;
  __EMBEDDABLE__?: {
    [key: string]: NativeTypes; // keyed by bundle hash if it exists, otherwise just nativeTypes
  };
};

const extendedWindow = window as WindowSimplified;

export const getBundleHash = () => {
  return extendedWindow.__EMBEDDABLE_BUNDLE_HASH__;
};

const getFromWindow = <T>(property: string, fallback: T = {} as T): T => {
  const bundleHash = getBundleHash();
  const embeddable = extendedWindow.__EMBEDDABLE__;

  if (bundleHash && embeddable?.[bundleHash as keyof typeof embeddable]?.nativeTypes) {
    return ((embeddable[bundleHash as keyof typeof embeddable].nativeTypes as NativeTypes)[
      property
    ] || fallback) as T;
  }

  return (embeddable?.[property] || fallback) as T;
};

export const getCustomGranularities = (): string[] => {
  if (!window) return [];
  const nativeTypes = getFromWindow<NativeTypes>('nativeTypes', {});
  return nativeTypes?.granularity?.options || [];
};
