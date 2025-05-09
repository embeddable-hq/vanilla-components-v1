import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../themes/theme';

const Checkbox: React.FC = () => {
  // Get theme for use in component
  const theme: Theme = useTheme() as Theme;
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 2.66667C0 1.19391 1.19391 0 2.66667 0H13.3333C14.8061 0 16 1.19391 16 2.66667V13.3333C16 14.8061 14.8061 16 13.3333 16H2.66667C1.19391 16 0 14.8061 0 13.3333V2.66667Z"
        fill={theme.svg.fillNormal}
      />
      <g clipPath="url(#clip0_1437_1615)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.624 4.1216C11.9987 4.35577 12.1126 4.84933 11.8784 5.224L7.8784 11.624C7.74919 11.8307 7.53276 11.9673 7.29053 11.9949C7.0483 12.0224 6.8067 11.9381 6.63431 11.7657L4.23431 9.36569C3.9219 9.05327 3.9219 8.54673 4.23431 8.23431C4.54673 7.9219 5.05327 7.9219 5.36569 8.23431L7.05459 9.92322L10.5216 4.376C10.7558 4.00133 11.2493 3.88743 11.624 4.1216Z"
          fill={theme.svg.fillBkg}
        />
      </g>
      <defs>
        <clipPath id="clip0_1437_1615">
          <rect width="16" height="16" fill={theme.svg.fillBkg} />
        </clipPath>
      </defs>
    </svg>
  );
};
export default Checkbox;
