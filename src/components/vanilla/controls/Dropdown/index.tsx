import { DataResponse } from '@embeddable.com/core';
import { useEmbeddableState, useTheme } from '@embeddable.com/react';
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
import Spinner from '../../Spinner';
import { ChevronDown, ClearIcon } from '../../icons';

export type Props = {
  icon?: ReactNode;
  className?: string;
  options: DataResponse;
  unclearable?: boolean;
  inputClassName?: string;
  onChange: (v: string) => void;
  searchProperty?: string;
  minDropdownWidth?: number;
  property?: { name: string; title: string; nativeType: string; __type__: string };
  title?: string;
  defaultValue?: string;
  placeholder?: string;
  ds?: { embeddableId: string; datasetId: string; variableValues: Record };
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

  const [_, setServerSearch] = useEmbeddableState({
    [props.searchProperty || 'search']: '',
  }) as [Record, (f: (m: Record) => Record) => void];

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
        setServerSearch((s) => ({ ...s, [props.searchProperty || 'search']: newSearch }));
      }, 500);
    },
    [setSearch, setServerSearch, props.searchProperty],
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

  const list = useMemo(
    () =>
      props.options?.data?.reduce((memo, o, i: number) => {
        let valueToUse = o[props.property?.name || ''] || '';
        if (typeof valueToUse === 'string') {
          valueToUse = valueToUse.replaceAll('_', ' ');
        }

        memo.push(
          <div
            key={i}
            onClick={() => {
              setFocus(false);
              setTriggerBlur(true);
              set(o[props.property?.name || ''] || '');
            }}
            onKeyDown={(e) =>
              handleKeyDownCallback(e, () => set(o[props.property?.name || ''] || ''), true)
            }
            className={`block min-h-[36px] px-3 py-2 hover:bg-black/5 cursor-pointer font-normal  ${
              value === o[props.property?.name || ''] ? 'bg-black/5' : ''
            } truncate`}
            tabIndex={0}
            aria-label={valueToUse}
            title={valueToUse}
          >
            {valueToUse}
            {o.note && (
              <span className="font-normal ml-auto pl-3 text-xs opacity-70">{o.note}</span>
            )}
          </div>,
        );

        return memo;
      }, []),
    [props, value, set],
  ) as ReactNode[];

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
            bg-controls-backgrounds-soft
            border-controls-borders-normal
            rounded-controls-borders-radius
          `,
          props.className,
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
            bg-controls-backgrounds-transparent
            rounded-controls-borders-radius
            text-controls-font-normal
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
              rounded-controls-borders-radius
              text-controls-font-normal
            `}
          >
            {typeof value === 'string' ? value.replaceAll('_', ' ') : value}
          </span>
        )}

        {focus && (
          <div
            style={{ minWidth: props.minDropdownWidth }}
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
              bg-controls-backgrounds-soft
              border-controls-borders-normal
              rounded-controls-borders-radius
              text-controls-font-normal
              z-controls-dropdown-focused
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

        {props.options.isLoading ? (
          <Spinner
            show
            className={`
            absolute
            pointer-events-none
            right-2
            top-2
            z-controls-dropdown-spinner
          `}
          />
        ) : (
          <ChevronDown
            className={`
            absolute
            cursor-pointer
            right-2
            top-2.5
            z-controls-dropdown-chevron
          `}
            onClick={() => {
              setFocus(!focus);
            }}
          />
        )}

        {!props.unclearable && !!value && (
          <div
            onClick={() => {
              set('');
            }}
            className={`
              absolute
              cursor-pointer
              flex
              h-10
              items-center
              right-10
              top-0
              z-controls-dropdown-clear
            `}
          >
            <ClearIcon />
          </div>
        )}
      </div>
    </Container>
  );
};
