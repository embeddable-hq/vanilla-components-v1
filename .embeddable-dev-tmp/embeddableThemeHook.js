
import localThemeProvider from '/Users/christopherbuecheler/work/code/vanilla-components-v1/embeddable.theme.ts';

import { defineTheme } from '@embeddable.com/core';

const parentProviders = [
  
];

export default function combinedThemeProvider(clientContext) {
  let parentTheme = {};

  // 1. Sequentially call each library's theme, merging the result
  for (const provider of parentProviders) {
    if (typeof provider === 'function') {
      const partial = provider(clientContext, parentTheme);

      // Merge into parentTheme
      parentTheme = defineTheme(parentTheme, partial);
    }
  }

  if (typeof localThemeProvider === 'function') {
    return localThemeProvider(clientContext, parentTheme);
  }

  return parentTheme;
}