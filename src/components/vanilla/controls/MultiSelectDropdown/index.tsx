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

import Checkbox from '../../../icons/Checkbox';
import CheckboxEmpty from '../../../icons/CheckboxEmpty';
import Container from '../../Container';
import Spinner from '../../Spinner';
import { ChevronDown, ClearIcon } from '../../icons';

export type Props = {
  className?: string;
  options: DataResponse;
  unclearable?: boolean;
  onChange: (v: string[]) => void;
  searchProperty?: string;
  minDropdownWidth?: number;
  property?: { name: string; title: string; nativeType: string; __type__: string };
  title?: string;
  defaultValue?: string[];
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
    (newValue: string) => {
      performSearch('');

      let newValues: string[] = [];

      if (newValue !== '') {
        newValues = value || [];
        if (newValues?.includes(newValue)) {
          newValues = newValues.filter((v) => v !== newValue);
        } else {
          newValues = [...newValues, newValue];
        }
      }

      props.onChange(newValues);
      setValue(newValues);
      setServerSearch((s) => ({ ...s, [props.searchProperty || 'search']: '' }));
      clearTimeout(debounce);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [performSearch, props, value],
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
        memo.push(
          <div
            key={i}
            onClick={() => {
              setFocus(true);
              set(o[props.property?.name || ''] || '');
            }}
            onKeyDown={(e) =>
              handleKeyDownCallback(e, () => set(o[props.property?.name || ''] || ''), true)
            }
            onFocus={() => {
              setIsDropdownOrItemFocused(true);
              setFocus(true);
            }}
            className={`flex items-center min-h-[36px] w-full px-3 py-2 hover:bg-black/5 cursor-pointer font-normal gap-1 ${
              value?.includes(o[props.property?.name || '']) ? 'bg-black/5' : ''
            }`}
            tabIndex={0}
          >
            {value?.includes(o[props.property?.name || '']) ? (
              <div className={`w-[16px] h-[16px] inline-block`}>
                <Checkbox />
              </div>
            ) : (
              <div className={`w-[16px] h-[16px] inline-block`}>
                <CheckboxEmpty />
              </div>
            )}
            <div className={`block w-full truncate`}>
              {o[props.property?.name || '']}
              {o.note && (
                <span className="font-normal ml-auto pl-3 text-xs opacity-70">{o.note}</span>
              )}
            </div>
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
            bg-[color:--embeddable-controls-backgrounds-colors-soft]
            border-[color:--embeddable-controls-borders-colors-normal]
            rounded-[--embeddable-controls-borders-radius]
            `,
          props.className,
        )}
      >
        <input
          ref={ref}
          value={search}
          name="dropdown"
          placeholder={props.placeholder}
          onClick={() => {
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
            rounded-[--embeddable-controls-borders-radius]
            bg-[color:--embeddable-controls-backgrounds-colors-transparent]
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
              text-sm
              top-1
              truncate
              w-[calc(100%-2rem)]
              whitespace-nowrap
              bg-[color:--embeddable-controls-backgrounds-colors-soft]
              border-[color:--embeddable-controls-borders-colors-normal]
              rounded-[--embeddable-controls-borders-radius]
              ${focus ? 'hidden' : ''}
            `}
          >
            Selected {value.length} {value.length === 1 ? 'option' : 'options'}
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
              z-50
              bg-[color:--embeddable-controls-backgrounds-colors-soft]
              rounded-[--embeddable-controls-borders-radius]
            `}
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
          <Spinner show className="absolute right-2 top-2 z-1 pointer-events-none" />
        ) : (
          <ChevronDown className="absolute right-2.5 top-2.5 z-1 pointer-events-none" />
        )}

        {!props.unclearable && !!value && (
          <div
            onClick={() => {
              set('');
            }}
            className="absolute right-10 top-0 h-10 flex items-center z-10 cursor-pointer"
          >
            <ClearIcon />
          </div>
        )}
      </div>
    </Container>
  );
};
