export type ChartType = 'bar' | 'bubble' | 'kpi' | 'line' | 'pie' | 'scatter' | 'stackedArea';

type ButtonSettings = {
  background: string;
  fontColor: string;
  border: string;
};

type BarChartBorderRadius = {
  topRight: number;
  topLeft: number;
  bottomRight: number;
  bottomLeft: number;
};

type ChartLabels = {
  backgroundColor: string;
  borderRadius: number;
  color: string;
  font: {
    size: number;
    weight: number | 'normal' | 'bold' | 'bolder' | 'lighter' | undefined;
  };
};

export type Theme = {
  brand: {
    primary: string;
    secondary: string;
  };
  charts: {
    colors: string[];
    options: {
      toolTipEnabled: boolean;
      usePointStyle: boolean;
    };
    fontWeights: {
      description: number;
      kpiNumber: number;
      pagination: number;
      title: number;
    };
    textJustify:
      | 'start'
      | 'end'
      | 'center'
      | 'between'
      | 'around'
      | 'evenly'
      | 'stretch'
      | 'baseline'
      | 'normal';
    bar: {
      borderRadius: number | BarChartBorderRadius;
      borderSkipped:
        | 'start'
        | 'end'
        | 'middle'
        | 'bottom'
        | 'left'
        | 'top'
        | 'right'
        | false
        | true;
      borderWidth: number;
      colors?: string[];
      cubicInterpolationMode: 'monotone' | 'default';
      font: {
        size: number;
      };
      labels: {
        total: ChartLabels;
        value: ChartLabels;
      };
      lineTension: number;
    };
    bubble: {
      colors?: string[];
      font: {
        size: number;
      };
      labels: ChartLabels;
    };
    kpi: {
      alignment: string;
      colors?: string[];
      font: {
        negativeColor: string;
        size: number;
      };
    };
    line: {
      colors?: string[];
      cubicInterpolationMode: 'monotone' | 'default';
      font: {
        size: number;
      };
      labels: ChartLabels;
      lineTension: number;
    };
    pie: {
      colors?: string[];
      borderColor: string;
      borderWidth: number;
      font: {
        size: number;
      };
      labels: ChartLabels;
      weight: number;
    };
    scatter: {
      colors?: string[];
      font: {
        size: number;
      };
      labels: ChartLabels;
    };
    stackedArea: {
      cubicInterpolationMode: 'monotone' | 'default';
      font: {
        size: number;
      };
      labels: ChartLabels;
      lineTension: number;
    };
  };
  container: {
    backgroundColor: string;
    border: string;
    borderRadius: string;
    boxShadow: string;
    padding: string;
  };
  controls: {
    backgrounds: {
      colors: {
        heavy: string;
        normal: string;
        soft: string;
        transparent: string;
      };
    };
    buttons: {
      active: ButtonSettings;
      hovered: ButtonSettings;
      pressed: ButtonSettings;
      fontSize: string;
      height: string;
      multiSelect: {
        active: ButtonSettings;
        inactive: ButtonSettings;
        margin: string;
        maxWidth: string;
        padding: string;
        radius: string;
      };
      paddingY: string;
      paddingX: string;
      radius: string;
    };
    borders: {
      colors: {
        normal: string;
        heavy: string;
      };
      padding: number;
      radius: string;
    };
    datepicker: {
      backgrounds: {
        colors: {
          accent: string;
          rangeEnd: string;
          rangeEndDate: string;
          rangeMiddle: string;
          rangeStart: string;
        };
      };
      font: {
        colors: {
          accent: string;
          rangeEnd: string;
          rangeMiddle: string;
          rangeStart: string;
          rangeStartDate: string;
          today: string;
        };
      };
      outsideOpacity: number;
      radiuses: {
        button: string;
        buttonEnd: string;
        buttonStart: string;
        weekNumber: string;
      };
    };
    font: {
      colors: {
        normal: string;
        soft: string;
        strong: string;
      };
      size: string;
    };
    inputs: {
      colors: {
        hover: string;
        selected: string;
      };
    };
    skeletonBox: {
      animation: string;
      backgroundImage: string;
    };
    tooltips: {
      radius: string;
    };
  };
  dateFormats: {
    year: string;
    quarter: string;
    month: string;
    day: string;
    week: string;
    hour: string;
    minute: string;
    second: string;
  };
  downloadMenu: {
    backgroundColor: string;
    border: string;
    borderRadius: string;
    boxShadow: string;
    font: {
      color: string;
      family: string;
      size: string;
      weight: number;
    };
    hover?: {
      backgroundColor: string;
      fontColor: string;
      svgColor: string;
    };
    paddingOuter: number | string;
    paddingInner: number | string;
    svg?: {
      width?: number | string;
      height?: number | string;
    };
  };
  font: {
    color: string;
    colorNormal: string;
    colorSoft: string;
    description: {
      color: string;
      family: string;
      size: string;
    };
    family: string;
    size: string;
    weight: number;
    title: {
      color: string;
      family: string;
      size: string;
    };
    urls: string[];
  };
  png: {
    backgroundColor: string;
  };
  svg: {
    fillBkg: string;
    fillStrong: string;
    fillNormal: string;
    strokeNormal: string;
    strokeStrong: string;
    strokeSoft: string;
  };
};

type ThemeDeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? ThemeDeepPartial<T[P]> : T[P];
};

export type ThemePartial = ThemeDeepPartial<Theme>;
