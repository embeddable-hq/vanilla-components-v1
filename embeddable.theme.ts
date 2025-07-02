import { Theme } from './src/themes/theme';
import defaultTheme from './src/themes/defaulttheme';
import { defineTheme } from '@embeddable.com/core';

const themeProvider = (clientContext: any, parentTheme: Theme): any => {
  if (clientContext?.theme === 'default') {
    const theme = defaultTheme;
    return theme;
  }

  const theme = defineTheme(defaultTheme, {
    brand: {
      primary: '#66d6ff',
      secondary: '#cc66ff',
    },
    charts: {
      colors: [
        '#66d6ff',
        '#cc66ff',
        '#FFFF99',
        '#99FFCC',
        '#FF99FF',
        '#FFCCCC',
        '#f18888',
        '#afff99',
      ],
      options: {
        toolTipEnabled: true,
        usePointStyle: true,
      },
      textJustify: 'start',
      fontWeights: {
        description: 600,
        kpiNumber: 700,
        pagination: 400,
        title: 700,
      },
      /* Custom overrides for certain charts */
      bar: {
        borderRadius: 30,
        borderSkipped: undefined,
        borderWidth: 0,
        colors: ['#99FFCC', '#FF99FF'],
        font: {
          size: 16,
        },
        lineTension: 0.5,
      },
      bubble: {
        font: {
          size: 12,
        },
      },
      kpi: {
        alignment: 'center',
        font: {
          negativeColor: '#FF6B6C',
          size: 32,
        },
      },
      line: {
        font: {
          size: 12,
        },
        lineTension: 0.5,
      },
      pie: {
        borderColor: '#780064',
        borderWidth: 3,
        font: {
          size: 16,
        },
        weight: 5,
      },
      scatter: {
        font: {
          size: 12,
        },
      },
      stackedArea: {
        lineTension: 0.5,
      },
      /* End custom chart overrides */
    },
    container: {
      backgroundColor: '#FFF8F8',
      border: '1px solid #780064',
      borderRadius: '30px',
      boxShadow: 'none',
      padding: '30px',
    },
    controls: {
      backgrounds: {
        colors: {
          heavy: '#fbd8f6',
          normal: '#F3F4F6',
          soft: '#FFF3F3',
          transparent: 'transparent',
        },
      },
      buttons: {
        active: {
          background: '#FFFFFF',
          border: '#780064',
          fontColor: '#780064',
        },
        hovered: {
          background: '#FFFFFF',
          border: '#780064',
          fontColor: '#780064',
        },
        pressed: {
          background: '#F3F3F4',
          border: '#780064',
          fontColor: '#780064',
        },
        fontSize: '14px',
        height: '50px',
        paddingY: '16px',
        paddingX: '32px',
        radius: 'calc(infinity+1px)',
      },
      borders: {
        colors: {
          normal: '#780064',
          heavy: 'D1D5DB',
        },
        padding: 8,
        radius: '12px',
      },
      datepicker: {
        backgrounds: {
          colors: {
            accent: '#f3f4f6',
            rangeEnd: '#780064',
            rangeEndDate: '#7d899b',
            rangeMiddle: '#fbdede',
            rangeStart: '#780064',
          },
        },
        font: {
          colors: {
            accent: '#780064',
            rangeEnd: '#ffffff',
            rangeMiddle: '#780064',
            rangeStart: '#ffffff',
            rangeStartDate: '#780064',
            today: '#111111',
          },
        },
        outsideOpacity: 0.4,
        radiuses: {
          button: '10px',
          buttonEnd: '0px 10px 10px 0px',
          buttonStart: '10px 0px 0px 10px',
          weekNumber: '10px',
        },
      },
      inputs: {
        colors: {
          hover: '#F3F4F6',
          selected: '#F3F4F6',
        },
      },
      tooltips: {
        radius: '10px',
      },
    },
    dateFormats: {
      year: 'yyyy',
      quarter: 'MMM yy',
      month: 'MMM yy',
      day: 'd MMM',
      week: 'd MMM',
      hour: 'eee HH:mm',
      minute: 'eee HH:mm',
      second: 'HH:mm:ss',
    },
    font: {
      color: '#780064',
      colorNormal: '#333942',
      colorSoft: '#e3e3e3',
      family: 'Inter',
      size: `14px`,
      weight: 400,
    },
    png: {
      backgroundColor: '#FFFFFF',
    },
    svg: {
      fillBkg: '#FFFFFF',
      fillNormal: '#780064',
      fillStrong: '#1D1E22',
      strokeSoft: '#474752',
      strokeNormal: '#780064',
      strokeStrong: '#101010',
    },
  }) as Theme;
  return theme;
};

export default themeProvider;
