import React from 'react';
import { Theme } from '../../themes/theme';
import { useTheme } from '@embeddable.com/react';

type Props = {
  description?: string;
  style?: React.CSSProperties;
};

export default function Description({ description, style }: Props) {
  const theme: Theme = useTheme() as Theme;

  return (
    !!description && (
      <p
        className={`
          flex
          font-family-embeddable
          justify-start
          mb-2
          text-[color:--embeddable-font-description-color]
          text-[size:--embeddable-font-description-size]
        `}
        style={style || {}}
      >
        {description}
      </p>
    )
  );
}
