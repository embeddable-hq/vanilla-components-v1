import { defaultTheme } from './src/themes/defaulttheme';
import { RUIVars } from './src/themes/rui-vars';
import { Theme } from './src/themes/theme';

export default {
  onThemeUpdated: (updatedTheme: Theme) => {
    // If for some reason the theme is not provided, use the default theme
    const theme = updatedTheme ? updatedTheme : defaultTheme;

    // Generate the variables and add them to the header if they're not already there
    const cssVariables = generateCssVariables(theme);
    const style = document.createElement('style');
    style.textContent = `:root {\n${cssVariables}}`;
    style.id = 'theme-config';

    // If a custom font url is provided, we need to add it to the CSS
    const hasCustomFonts = theme.font.urls.length > 0;
    if (hasCustomFonts) {
      style.textContent += `\n@font-face {\n  font-family: '${theme.font.family}';\n  src: ${theme.font.urls.map((url) => `url('${url}')`).join(', ')};\n font-display: swap;\n}`;
    }

    // There may be an existing theme config from a previous embeddable
    const existingStyle = document.head.querySelector('#theme-config');
    if (existingStyle) {
      existingStyle.remove();
    }
    document.head.appendChild(style);

    // If we had custom fonts, we're done
    if (hasCustomFonts) {
      return () => {
        style.remove();
        const fontLink = document.head.querySelector('#google-fonts');
        if (fontLink) {
          fontLink.remove();
        }
      };
    }

    // Otherwise, we need to load Google Fonts if the theme specifies a font family
    // Load Google Fonts
    const fontFamily = `${theme.font.family}, ${theme.font.description.family}, ${theme.font.title.family}`;
    const links = loadGoogleFonts(fontFamily);
    if (links) {
      const { fontLink, preconnectLink1, preconnectLink2 } = links;
      const existingLink = document.head.querySelector('#google-fonts');
      const existingPreconnect1 = document.head.querySelector('#google-fonts-preconnect-1');
      const existingPreconnect2 = document.head.querySelector('#google-fonts-preconnect-2');
      if (existingLink) {
        existingLink.remove();
      }
      if (existingPreconnect1) {
        existingPreconnect1.remove();
      }
      if (existingPreconnect2) {
        existingPreconnect2.remove();
      }

      document.head.appendChild(preconnectLink1);
      document.head.appendChild(preconnectLink2);
      document.head.appendChild(fontLink);
    }

    // Also check for custom fonts in chart components
    const chartFontFamily = (theme.charts?.bar as any)?.font?.family;
    if (chartFontFamily) {
      const chartLinks = loadGoogleFonts(chartFontFamily);
      if (chartLinks) {
        const { fontLink: chartFontLink, preconnectLink1, preconnectLink2 } = chartLinks;
        chartFontLink.id = 'google-fonts-chart';
        const existingChartLink = document.head.querySelector('#google-fonts-chart');
        const existingPreconnect1 = document.head.querySelector('#google-fonts-preconnect-1');
        const existingPreconnect2 = document.head.querySelector('#google-fonts-preconnect-2');
        if (existingChartLink) {
          existingChartLink.remove();
        }
        if (existingPreconnect1) {
          existingPreconnect1.remove();
        }
        if (existingPreconnect2) {
          existingPreconnect2.remove();
        }

        document.head.appendChild(chartFontLink);
      }
    }

    // Cleanup: remove the styles/fonts when the component is unmounted / re-rendered
    return () => {
      style.remove();
      const fontLink = document.head.querySelector('#google-fonts');
      if (fontLink) {
        fontLink.remove();
      }

      const chartFontLink = document.head.querySelector('#google-fonts-chart');
      if (chartFontLink) {
        chartFontLink.remove();
      }
    };
  },
};

/*
 * This function generates a CSS variable for every property in the theme.
 * Note: this will generate some invalid CSS variables (eg: --embeddable-isParent: true).
 * This is fine, as we don't use them anywhere, and they won't affect the CSS.
 */
const generateCssVariables = (obj: any, prefix = '--embeddable') => {
  let textContent = '';
  for (const key in obj) {
    if (key === 'remarkableVars') {
      textContent += generateRUIVars(obj[key] as RUIVars);
      continue;
    }
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      textContent += generateCssVariables(obj[key], `${prefix}-${key}`);
    } else {
      textContent += `${prefix}-${key}: ${obj[key]};\n`;
    }
  }
  return textContent;
};

/*
 * This function generates Remarkable UI specific CSS variables
 */
const generateRUIVars = (ruiVars: RUIVars) => {
  let textContent = '';
  for (const key in ruiVars) {
    textContent += `${key}: ${ruiVars[key as keyof RUIVars]};\n`;
  }
  return textContent;
};

/*
 * This function allows us to work with Google Fonts by parsing the font family string
 * and then loading the individual fonts.
 */
const loadGoogleFonts = (fontName: string) => {
  // Skip system fonts that don't need to be loaded
  const systemFonts = [
    '-apple-system',
    'system-ui',
    'Segoe UI',
    'Roboto',
    'Helvetica',
    'Arial',
    'sans-serif',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
  ];
  // Extract actual font names from the font-family string
  const fontNames = fontName
    .split(',')
    .map((font) => font.trim().replace(/"/g, '').replace(/'/g, ''));

  // Filter out system fonts
  const customFonts = fontNames.filter(
    (font) => !systemFonts.some((sysFont) => font.toLowerCase() === sysFont.toLowerCase()),
  );

  if (customFonts.length === 0) return null;

  // Create links for Google Fonts
  const preconnectLink1 = document.createElement('link');
  preconnectLink1.rel = 'preconnect';
  preconnectLink1.href = 'https://fonts.googleapis.com';
  preconnectLink1.id = 'google-fonts-preconnect-1';
  preconnectLink1.crossOrigin = 'anonymous';
  const preconnectLink2 = document.createElement('link');
  preconnectLink2.rel = 'preconnect';
  preconnectLink2.href = 'https://fonts.gstatic.com';
  preconnectLink2.crossOrigin = 'anonymous';
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.id = 'google-fonts';
  fontLink.crossOrigin = 'anonymous';

  // Format the font name for Google Fonts URL. Replace spaces with '+' and join with '&family='
  // But make sure the first & is a ? instead
  const formattedFontNames = customFonts
    .map((font) => font.replace(/\s+/g, '+')) // Replace spaces
    .join('&family=');

  fontLink.href = `https://fonts.googleapis.com/css2?family=${formattedFontNames}&display=swap`;

  return {
    fontLink,
    preconnectLink1,
    preconnectLink2,
  };
};
