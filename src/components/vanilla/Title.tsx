import { useTheme } from '@embeddable.com/react';
import React from 'react';
import { Theme } from '../../themes/theme';

type Props = {
  title?: string;
  style?: React.CSSProperties;
};

export default function Title({ title, style }: Props) {
  const theme: Theme = useTheme() as Theme;

  return (
    !!title && (
      <h2
        className={`
          flex
          font-family-embeddable-title
          justify-start
          leading-6
          mb-2
          text-base
          font-[--embeddable-charts-fontWeights-title]
          text-[font-size:--embeddable-font-title-size]
          text-[color:--embeddable-font-title-color]
        `}
        style={style || {}}
      >
        {title}
      </h2>
    )
  );
}
