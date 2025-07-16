import React, { useState } from 'react';

import Container from '../../Container';
import { Theme } from '../../../../themes/theme';
import { useTheme } from '@embeddable.com/react';

type Props = {
  title: string;
  values: Array<string>;
  onChange: (v: Array<string>) => void;
  defaultValue?: Array<string>;
};

export default (props: Props) => {
  const { title, values, onChange, defaultValue } = props;
  const [selected, setSelected] = useState(defaultValue || []);

  const theme: Theme = useTheme() as Theme;

  const handleClick = (value: string) => {
    const updated = selected.includes(value)
      ? selected.filter((el) => el !== value)
      : [...selected, value];
    setSelected(updated);
    onChange(updated);
  };

  return (
    <Container title={title}>
      <div className="multiSelectContainer font-embeddable text-[font-size:--embeddable-font-size]">
        {values?.map((value, i) => {
          const background = selected.includes(value)
            ? theme.controls.buttons.multiSelect.active.background
            : theme.controls.buttons.multiSelect.inactive.background;
          const color = selected.includes(value)
            ? theme.controls.buttons.multiSelect.active.fontColor
            : theme.controls.buttons.multiSelect.inactive.fontColor;
          const border = selected.includes(value)
            ? theme.controls.buttons.multiSelect.active.border
            : theme.controls.buttons.multiSelect.inactive.border;
          return (
            <div
              key={i}
              className={`multiselectItem text-[color:--embeddable-font-colorNormal]`}
              style={{ background, border }}
              onClick={() => handleClick(value)}
            >
              <div className="multiSelectInner" style={{ color }}>
                {value}
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
};
