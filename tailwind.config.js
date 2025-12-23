/** @type {import('tailwindcss').Config} */
import defaultTheme from './src/themes/defaulttheme';

module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    transparent: 'transparent',
    current: 'currentColor',
    extend: {
      // Arbitrary value tokens (with or without matching CSS variables)
      aspect: {
        187: '1.87',
      },
      borderColor: {
        'controls-multiselector': 'var(--embeddable-controls-multiSelector-borderColor)',
      },
      borderRadius: {
        'controls-borders-radius': 'var(--embeddable-controls-borders-radius)',
        'controls-buttons-radius': 'var(--embeddable-controls-buttons-radius)',
        'controls-tooltips-radius': 'var(--embeddable-controls.tooltips.radius)',
        'download-menu-border-radius': 'var(--embeddable-downloadMenu-borderRadius)',
      },
      colors: {
        'font-color-normal': 'var(--embeddable-font-colorNormal)',
        'controls-backgrounds-soft': 'var(--embeddable-controls-backgrounds-colors-soft)',
        'controls-backgrounds-transparent':
          'var(--embeddable-controls-backgrounds-colors-transparent)',
        'controls-backgrounds-heavy': 'var(--embeddable-controls-backgrounds-colors-heavy)',
        'controls-backgrounds-normal': 'var(--embeddable-controls-backgrounds-colors-normal)',
        'controls-inputs-hover': 'var(--embeddable-controls-inputs-colors-hover)',
        'controls-inputs-selected': 'var(--embeddable-controls-inputs-colors-selected)',
        'controls-buttons-active-background':
          'var(--embeddable-controls-buttons-active-background)',
        'controls-buttons-hovered-background':
          'var(--embeddable-controls-buttons-hovered-background)',
        'controls-buttons-pressed': 'var(--embeddable-controls-buttons-colors-pressed)',
        'controls-borders-normal': 'var(--embeddable-controls-borders-colors-normal)',
        'controls-borders-heavy': 'var(--embeddable-controls-borders-colors-heavy)',
        'controls-borders-primary': 'var(--embeddable-controls-boders-colors-primary)',
        'controls-font-normal': 'var(--embeddable-controls-font-colors-normal)',
        'controls-buttons-active-font-color': 'var(--embeddable-controls-buttons-active-fontColor)',
        'controls-buttons-hovered-font-color':
          'var(--embeddable-controls-buttons-hovered-fontColor)',
        'controls-buttons-pressed-font-color':
          'var(--embeddable-controls-buttons-pressed-fontColor)',
        'controls-buttons-active-border': 'var(--embeddable-controls-buttons-active-border)',
        'controls-buttons-hovered-border': 'var(--embeddable-controls-buttons-hovered-border)',
        'controls-buttons-pressed-border': 'var(--embeddable-controls-buttons-pressed-border)',
        'controls-multiselector-border': 'var(--embeddable-controls-multiSelector-borderColor)',
        'download-menu-background-color': 'var(--embeddable-downloadMenu-backgroundColor)',
        'download-menu-hover-background-color':
          'var(--embeddable-downloadMenu-hover-backgroundColor)',
        'download-menu-hover-color': 'var(--embeddable-downloadMenu-hover-fontColor)',
        'download-menu-color': 'var(--embeddable-downloadMenu-font-color)',
      },
      fontFamily: {
        embeddable: defaultTheme.font.family,
      },
      fontSize: {
        embeddable: 'var(--embeddable-font-size)',
      },
      fontWeight: {
        'charts-kpi': 'var(--embeddable-charts-fontWeights-kpiNumber)',
        'charts-pagination': 'var(--embeddable-charts-fontWeights-pagination)',
        'charts-title': 'var(--embeddable-charts-fontWeights-title)',
      },
      gap: {
        8: '8px',
      },
      height: {
        '16px': '16px',
        '20px': '20px',
        '32px': '32px',
        '60px': '60px',
        'controls-buttons-height': 'var(--embeddable-controls-buttons-height)',
      },
      maxHeight: {
        '400px': '400px',
        'controls-multiselector': 'var(--embeddable-controls-multiSelector-maxHeight)',
      },
      maxWidth: {
        '115px': '115px',
        '120px': '120px',
        '140px': '140px',
        '150px': '150px',
      },
      minHeight: {
        '36px': '36px',
      },
      minWidth: {
        '9px': '9px',
        '50px': '50px',
        '60px': '60px',
        '80px': '80px',
      },
      opacity: {
        60: '0.6',
      },
      padding: {
        'controls-buttons-padding-x': 'var(--embeddable-controls-buttons-paddingX)',
        'controls-buttons-padding-y': 'var(--embeddable-controls-buttons-paddingY)',
        'download-menu-outer': 'var(--embeddable-downloadMenu-paddingOuter)',
        'download-menu-inner': 'var(--embeddable-downloadMenu-paddingInner)',
      },
      width: {
        '9px': '9px',
        '16px': '16px',
        'padded-100': 'calc(100%-2.5rem)',
      },
      zIndex: {
        'controls-datepicker': 'var(--embeddable-controls-datepicker-zIndex)',
        'controls-dropdown-focused': 'var(--embeddable-controls-dropdown-focused-zIndex)',
        'controls-dropdown-spinner': 'var(--embeddable-controls-dropdown-spinner-zIndex)',
        'controls-dropdown-chevron': 'var(--embeddable-controls-dropdown-chevron-zIndex)',
        'controls-dropdown-clear': 'var(--embeddable-controls-dropdown-clear-zIndex)',
        'controls-multiselector': 'var(--embeddable-controls-multiSelector-zIndex)',
        'controls-multiselector-chevron': 'var(--embeddable-controls-multiSelector-chevron-zIndex)',
        'controls-multiselector-clear': 'var(--embeddable-controls-multiSelector-clear-zIndex)',
        'controls-skeleton-box': 'var(--embeddable-controls-skeletonBox-zIndex)',
        'charts-table-header': 'var(--embeddable-charts-table-header-zIndex)',
        'charts-table-cell': 'var(--embeddable-charts-table-cell-zIndex)',
        'charts-table-pivot': 'var(--embeddable-charts-table-pivot-zIndex)',
        spinner: 'var(--embeddable-spinner-zIndex)',
        'download-menu': 'var(--embeddable-downloadMenu-zIndex)',
      },
    },
  },
  safelist: [
    {
      pattern:
        /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ['hover', 'ui-selected'],
    },
    {
      pattern:
        /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ['hover', 'ui-selected'],
    },
    {
      pattern:
        /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ['hover', 'ui-selected'],
    },
    {
      pattern:
        /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      // pattern for all rounded classes
      pattern: /^rounded.*$/,
    },
  ],
  plugins: [require('@headlessui/tailwindcss')],
};
