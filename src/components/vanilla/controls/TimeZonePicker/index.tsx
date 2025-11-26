import { DataResponse } from '@embeddable.com/core';
import { useEmbeddableState } from '@embeddable.com/react';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { twMerge } from 'tailwind-merge';

import Container from '../../Container';
import { ChevronDown } from '../../icons';
import { TimeZone } from '../../../../enums/TimeZone';

export type Props = {
  options: DataResponse;
  onChange: (v: string) => void;
  searchProperty?: string;
  title: string;
  defaultValue: string;
  placeholder: string;
  timezone?: string[];
};

type Record = { [p: string]: string };

let debounce: number | undefined = undefined;

export default (props: Props) => {
  const ref = useRef<HTMLInputElement | null>(null);

  const [focus, setFocus] = useState(false);
  const [isDropdownOrItemFocused, setIsDropdownOrItemFocused] = useState(false);
  const [search, setSearch] = useState('');
  const [triggerBlur, setTriggerBlur] = useState(false);
  const [value, setValue] = useState(props.defaultValue);

  useEffect(() => {
    setValue(props.defaultValue);
  }, [props.defaultValue]);

  // Accessibility - Close the menu if we've tabbed off of any items it contains
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (!isDropdownOrItemFocused) {
      timeoutId = setTimeout(() => {
        setFocus(false);
      }, 200);
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isDropdownOrItemFocused]);

  useLayoutEffect(() => {
    if (!triggerBlur) return;

    const timeout = setTimeout(() => {
      setFocus(false);
      setTriggerBlur(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [triggerBlur]);

  const performSearch = useCallback(
    (newSearch: string) => {
      setSearch(newSearch);

      clearTimeout(debounce);

      debounce = window.setTimeout(() => {
        setSearch(newSearch);
      }, 500);
    },
    [setSearch],
  );

  const set = useCallback(
    (value: string) => {
      performSearch('');

      setValue(value);

      props.onChange(value);

      clearTimeout(debounce);
    },
    [setValue, props, performSearch],
  );

  // Used for handling keydown events on the menu items
  const handleKeyDownCallback = (
    e: React.KeyboardEvent<HTMLElement>,
    callback: any,
    escapable?: boolean,
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback(e);
      setFocus(false);
      setTriggerBlur(true);
    }
    if (escapable && e.key === 'Escape') {
      e.preventDefault();
      setFocus(false);
      setTriggerBlur(true);
    }
  };

  // Generate the list of timezones from the enum
  const timezones = Object.values(TimeZone);
  const list = timezones
    .filter((tz) => {
      if (!search) return true;
      return tz.toLowerCase().includes(search.toLowerCase());
    })
    .map((tz, i) => {
      return (
        <div
          key={i}
          onClick={() => {
            setFocus(false);
            setTriggerBlur(true);
            set(tz);
          }}
          onKeyDown={(e) => handleKeyDownCallback(e, () => set(tz), true)}
          className={`block min-h-[36px] px-3 py-2 hover:bg-black/5 cursor-pointer font-normal  ${
            value === tz ? 'bg-black/5' : ''
          } truncate`}
          tabIndex={0}
          aria-label={tz}
          title={tz}
        >
          {tz}
        </div>
      );
    }) as ReactNode[];

  return (
    <Container title={props.title}>
      <div
        className={twMerge(
          `
            border
            flex
            h-10
            items-center
            min-w-[50px]
            relative
            w-full
            bg-[color:--embeddable-controls-backgrounds-colors-soft]
            border-[color:--embeddable-controls-borders-colors-normal]
            rounded-[--embeddable-controls-borders-radius]
          `,
        )}
      >
        <input
          ref={ref}
          value={search}
          name="dropdown"
          placeholder={props.placeholder}
          onClick={(e) => {
            setFocus(true);
            setTriggerBlur(false);
          }}
          onFocus={() => {
            setFocus(true);
            setTriggerBlur(false);
            setIsDropdownOrItemFocused(true);
          }}
          onBlur={() => {
            setIsDropdownOrItemFocused(false);
          }}
          onChange={(e) => performSearch(e.target.value)}
          className={`
            border-0
            cursor-pointer
            h-9
            leading-9
            outline-none
            px-3
            text-sm ${focus || !value ? '' : 'opacity-0'}
            w-full
            bg-[color:--embeddable-controls-backgrounds-colors-transparent]
            rounded-[--embeddable-controls-borders-radius]
            text-[color:--embeddable-controls-font-colors-normal]
          `}
        />

        {!!value && (
          <span
            className={`
              absolute
              block
              h-8
              leading-8
              left-3
              overflow-hidden
              pointer-events-none
              text-sm ${focus ? 'hidden' : ''}
              top-1
              truncate
              w-[calc(100%-2.5rem)]
              whitespace-nowrap
              rounded-[--embeddable-controls-borders-radius]
              text-[color:--embeddable-controls-font-colors-normal]
            `}
          >
            {typeof value === 'string' ? value.replaceAll('_', ' ') : value}
          </span>
        )}

        {focus && (
          <div
            className={`
              absolute
              border
              flex
              flex-col
              max-h-[400px]
              overflow-x-hidden
              overflow-y-auto
              top-11
              w-full
              bg-[color:--embeddable-controls-backgrounds-colors-soft]
              border-[color:--embeddable-controls-borders-colors-normal]
              rounded-[--embeddable-controls-borders-radius]
              text-[color:--embeddable-controls-font-colors-normal]
              z-[--embeddable-controls-dropdown-focused-zIndex]
            `}
            onMouseDown={(e) => {
              e.preventDefault();
              // re-focus the input (allows repeated clicking in and out)
              ref.current?.focus();
              setTriggerBlur(false);
            }}
            onFocus={() => {
              setIsDropdownOrItemFocused(true);
            }}
            onBlur={() => {
              setIsDropdownOrItemFocused(false);
            }}
            tabIndex={0}
          >
            {list}
            {list?.length === 0 && !!search && (
              <div className="px-3 py-2 text-black/50 italic cursor-pointer">No results</div>
            )}
          </div>
        )}
        <ChevronDown
          className={`
            absolute
            pointer-events-none
            right-2
            top-2.5
            z-[--embeddable-controls-dropdown-chevron-zIndex]
          `}
        />
      </div>
    </Container>
  );
};
