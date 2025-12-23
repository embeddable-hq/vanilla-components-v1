import React, { useEffect, useRef, useState } from 'react';

import Container from '../../Container';
import { ClearIcon } from '../../icons';
import { Theme } from '../../../../themes/theme';
import { useTheme } from '@embeddable.com/react';

type Props = {
  onChange: (v: string) => void;
  title?: string;
  value?: string;
  placeholder: string;
};

let timeout: number | null = null;

export default (props: Props) => {
  const ref = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = window.setTimeout(() => {
      props.onChange(e.target.value);
    }, 1000);
  };

  return (
    <Container title={props.title}>
      <div
        className={`
          border
          h-10
          pr-8
          relative
          w-full
          bg-controls-backgrounds-soft
          border-controls-borders-normal
          rounded-controls-borders-radius
        `}
      >
        <input
          ref={ref}
          placeholder={props.placeholder}
          className={`
            border-0
            h-full
            leading-10
            outline-none
            px-3
            w-full
            bg-controls-backgrounds-transparent
            rounded-controls-borders-radius
            text-controls-font-normal
          `}
          onChange={handleChange}
          defaultValue={value}
        />
        {!!value && (
          <div
            onClick={() => {
              setValue('');
              props.onChange('');
              ref.current!.value = '';
              ref.current?.focus();
            }}
            className={`
              absolute
              cursor-pointer
              flex
              group
              h-full
              hover:opacity-100
              items-center
              justify-center
              opacity-50
              right-0
              top-0
              w-10
              text-controls-font-normal
            `}
          >
            <ClearIcon />
          </div>
        )}
      </div>
    </Container>
  );
};
