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
    fontWeights: {
      description: 400,
      kpiNumber: 700,
      pagination: 400,
      title: 700,
    },
    textJustify: 'start',
    /* Custom overrides for certain charts */
    bar: {
      borderRadius: 4,
      borderSkipped: 'bottom',
      borderWidth: 0,
      cubicInterpolationMode: 'default',
      font: {
        size: 12,
      },
      labels: {
        total: {
          backgroundColor: '#ffffff',
          borderRadius: 8,
          color: '#888888',
          font: {
            size: 12,
            weight: 'normal',
          },
        },
        value: {
          backgroundColor: 'transparent',
          borderRadius: 8,
          color: '#888888',
          font: {
            size: 12,
            weight: 'normal',
          },
        },
      },
      lineTension: 0.1,
    },
    bubble: {
      font: {
        size: 12,
      },
      labels: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        color: '#888888',
        font: {
          size: 12,
          weight: 'normal',
        },
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
      cubicInterpolationMode: 'default',
      font: {
        size: 12,
      },
      labels: {
        backgroundColor: 'transparent',
        borderRadius: 8,
        color: '#888888',
        font: {
          size: 12,
          weight: 'normal',
        },
      },
      lineTension: 0.1,
    },
    pie: {
      borderColor: '#FFFFFF',
      borderWidth: 2,
      font: {
        size: 12,
      },
      labels: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        color: '#888888',
        font: {
          size: 12,
          weight: 'normal',
        },
      },
      weight: 5,
    },
    scatter: {
      font: {
        size: 12,
      },
      labels: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        color: '#888888',
        font: {
          size: 12,
          weight: 'normal',
        },
      },
    },
    stackedArea: {
      cubicInterpolationMode: 'default',
      font: {
        size: 12,
      },
      labels: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        color: '#888888',
        font: {
          size: 12,
          weight: 'normal',
        },
      },
      lineTension: 0.1,
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
      multiSelect: {
        active: {
          background: '#6778DE',
          border: '1px solid #5062c9',
          fontColor: '#FFFFFF',
        },
        inactive: {
          background: '#F3F4F6',
          border: '1px solid #ffffff',
          fontColor: '#333942',
        },
        margin: '0px 4px 4px 4px',
        maxWidth: '150px',
        padding: '4px 8px',
        radius: '9999px',
      },
      paddingY: '16px',
      paddingX: '32px',
      radius: '9999px',
    },
    borders: {
      colors: {
        normal: '#DADCE1',
        heavy: 'D1D5DB',
      },
      padding: 1,
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
        button: '4px',
        buttonEnd: '0px 4px 4px 0px',
        buttonStart: '4px 0px 0px 4px',
        weekNumber: '4px',
      },
    },
    font: {
      colors: {
        normal: '#888888',
        soft: '#e3e3e3',
        strong: '#101010',
      },
      size: '14px',
    },
    inputs: {
      colors: {
        hover: '#F3F4F6',
        selected: '#F3F4F6',
      },
    },
    skeletonBox: {
      animation: `shimmer 2s infinite`,
      backgroundImage: `linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0,
        rgba(255, 255, 255, 0.2) 20%,
        rgba(255, 255, 255, 0.5) 60%,
        rgba(255, 255, 255, 0)
      );`,
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
  downloadMenu: {
    backgroundColor: '#FFFFFF',
    border: '0px solid #EEEEEE',
    borderRadius: '4px',
    boxShadow: '0 4px 6px -1px rgb(0,0,0,0.1), 0 2px 4px -2px rgb(0,0,0,0.1)',
    font: {
      color: '#BBBBBB',
      family:
        '-apple-system, "system-ui", "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      size: '14px',
      weight: 300,
    },
    hover: {
      backgroundColor: '#FFFFFF',
      fontColor: '#888888',
      svgColor: '#888888',
    },
    paddingOuter: 0,
    paddingInner: '.5rem',
    svg: {
      width: '24px',
      height: '24px',
    },
  },
  font: {
    color: '#888888',
    colorNormal: '#333942',
    colorSoft: '#e3e3e3',
    description: {
      color: '#888888',
      size: '14px',
      family:
        '-apple-system, "system-ui", "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    },
    family:
      '-apple-system, "system-ui", "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    size: `14px`,
    weight: 400,
    title: {
      color: '#333942',
      size: '16px',
      family:
        '-apple-system, "system-ui", "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    },
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
