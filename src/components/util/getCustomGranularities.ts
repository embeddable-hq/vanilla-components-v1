type NativeTypesShape = {
  granularity?: {
    options?: string[];
  };
};

type Embeddable = {
  nativeTypes?: NativeTypesShape;
  // Have to use any here because TS is very confused by the idea that nativeTypes could be top-level OR nested under a bundle hash
  [key: string]: any;
};

type WindowSimplified = {
  __EMBEDDABLE__?: Embeddable;
  __EMBEDDABLE_BUNDLE_HASH__?: string;
};

const extendedWindow = window as WindowSimplified;

export const getBundleHash = () => {
  return extendedWindow.__EMBEDDABLE_BUNDLE_HASH__;
};

const getFromWindow = (): NativeTypesShape | undefined => {
  const bundleHash = getBundleHash();
  const embeddable = extendedWindow.__EMBEDDABLE__;

  if (bundleHash && embeddable && embeddable[bundleHash]) {
    const bundleProp = embeddable[bundleHash];
    return bundleProp.nativeTypes as NativeTypesShape | undefined;
  } else if (embeddable && embeddable.nativeTypes) {
    return embeddable.nativeTypes;
  }
  return undefined;
};

export const getCustomGranularities = (): string[] => {
  if (typeof window !== 'undefined') {
    const nativeTypes = getFromWindow();
    return nativeTypes?.granularity?.options || [];
  } else {
    return [];
  }
};
