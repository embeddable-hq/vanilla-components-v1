import { Theme } from './theme';

export const defaultTheme: Theme = {
  brand: {
    primary: '#6778DE',
    secondary: '#FF997C',
  },
  charts: {
    colors: [
      '#6778DE',
      '#FF997C',
      '#9EA4F4',
      '#B8B8D1',
      '#FF6B6C',
      '#FFC145',
      '#9DC7FF',
      '#FF805B',
      '#CD9FFF',
      '#E6DEDE',
      '#FFA6A6',
      '#FFD98D',
    ],
    options: {
      toolTipEnabled: true,
      usePointStyle: true,
    },
    textJustify: 'start',
    fontWeights: {
      description: 400,
      kpiNumber: 700,
      pagination: 400,
      title: 700,
    },
    /* Custom overrides for certain charts */
    bar: {
      borderRadius: 4,
      borderSkipped: 'bottom',
      borderWidth: 0,
      font: {
        size: 12,
      },
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
      lineTension: 0.1,
    },
    pie: {
      font: {
        size: 12,
      },
    },
    scatter: {
      font: {
        size: 12,
      },
    },
    /* End custom chart overrides */
  },
  container: {
    backgroundColor: 'transparent',
    border: '1px solid #ddd',
    borderRadius: '12px',
    boxShadow: 'none',
    padding: '15px',
  },
  controls: {
    backgrounds: {
      colors: {
        heavy: '#D1D5DB',
        normal: '#F3F4F6',
        soft: '#FFFFFF',
        transparent: 'transparent',
      },
    },
    buttons: {
      active: {
        background: '#FFFFFF',
        border: '#D1D5DB',
        fontColor: '#000',
      },
      hovered: {
        background: '#FFFFFF',
        border: '#A1A5AA',
        fontColor: '#000',
      },
      pressed: {
        background: '#F3F3F4',
        border: '#D1D5DB',
        fontColor: '#000',
      },
      fontSize: '14px',
      height: '50px',
      paddingY: '16px',
      paddingX: '32px',
      radius: 'calc(infinity+1px)',
    },
    borders: {
      colors: {
        normal: '#DADCE1',
        heavy: 'D1D5DB',
      },
      padding: 8,
      radius: '12px',
    },
    datepicker: {
      backgrounds: {
        colors: {
          accent: '#f3f4f6',
          rangeEnd: '#7d899b',
          rangeEndDate: '#7d899b',
          rangeMiddle: '#f3f4f6',
          rangeStart: '#7d899b',
        },
      },
      font: {
        colors: {
          accent: '#7d899b',
          rangeEnd: '#ffffff',
          rangeMiddle: '#7d899b',
          rangeStart: '#ffffff',
          rangeStartDate: '#7d899b',
          today: '#111111',
        },
      },
      outsideOpacity: 0.4,
      radiuses: {
        buttonEnd: '0px 4px 4px 0px',
        buttonStart: '4px 0px 0px 4px',
        weekNumber: '4px',
      },
    },
    inputs: {
      colors: {
        hover: '#F3F4F6',
        selected: '#F3F4F6',
      },
    },
    tooltips: {
      radius: '4px',
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
    color: '#888888',
    colorNormal: '#333942',
    colorSoft: '#e3e3e3',
    family:
      '-apple-system, "system-ui", "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    size: `14px`,
    weight: 400,
    urls: [],
  },
  png: {
    backgroundColor: '#FFFFFF',
  },
  svg: {
    fillBkg: '#FFFFFF',
    fillNormal: '#474752',
    fillStrong: '#1D1E22',
    strokeSoft: '#474752',
    strokeNormal: '#959CA8',
    strokeStrong: '#101010',
  },
};

export default defaultTheme;
