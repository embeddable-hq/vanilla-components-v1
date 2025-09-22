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
import Checkbox from '../../icons/Checkbox';
import CheckboxEmpty from '../../icons/CheckboxEmpty';
import Container from '../Container';
import { ChevronDown, ClearIcon } from '../icons';
import { SelectorOption } from './Selector.types';
import { selectorOptionIncludesSearch } from './Selector.utils';

export type Props = {
  className?: string;
  minDropdownWidth?: number;
  placeholder?: string;
  defaultValue?: string[];
  options: SelectorOption[];
  title?: string;
  unclearable?: boolean;
  onChange: (v: string[]) => void;
};

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
    },
    [setSearch],
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

  const list = useMemo(() => {
    return props.options
      .filter((option) => selectorOptionIncludesSearch(search, option))
      .map((option) => {
        return (
          <div
            key={option.value}
            role="button"
            onClick={() => {
              setTriggerBlur(false);
              set(option.value);
            }}
            onKeyDown={(e) => handleKeyDownCallback(e, set(option.value), true)}
            onFocus={() => {
              setIsDropdownOrItemFocused(true);
              setFocus(true);
            }}
            onBlur={() => {
              setIsDropdownOrItemFocused(false);
            }}
            className={`
              cursor-pointer
              flex
              font-normal
              hover:bg-black/5
              items-center
              items-left
              min-h-[36px]
              px-3
              py-2
              truncate
              text-[color:--embeddable-controls-font-colors-normal]
              ${value?.includes(option.value) ? 'bg-black/5' : ''}
            `}
            tabIndex={0}
          >
            {value?.includes(option.value) ? <Checkbox /> : <CheckboxEmpty />}
            <span className="font-normal pl-1 truncate" title={option.label}>
              {option.label}
            </span>
          </div>
        );
      });
  }, [props, value, set, search]) as ReactNode[];

  return (
    <Container title={props.title}>
      <div
        className={twMerge(
          'relative rounded-xl w-full min-w-[50px] h-10 border border-[#DADCE1] flex items-center',
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
            bg-transparent
            border-0
            cursor-pointer
            h-9
            leading-9
            outline-none
            px-3
            text-sm
            w-full
            ${focus || !value ? '' : 'opacity-0'}
            text-[color:--embeddable-controls-font-colors-normal]
          `}
        />

        {!!value && (
          <span
            className={`
              absolute
              border
              flex
              flex-col
              max-h-[400px]
              overflow-x-hidden
              overflow-y-auto
              top-11
              w-[140px]
              bg-[color:--embeddable-controls-backgrounds-colors-soft]
              border-[color:--embeddable-controls-borders-colors-normal]
              rounded-[--embeddable-controls-borders-radius]
              text-[color:--embeddable-controls-font-colors-normal]
              z-[--embeddable-controls-dropdown-focused-zIndex]
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
              bg-white
              border
              flex
              flex-col
              overflow-x-hidden
              overflow-y-auto
              rounded-xl
              top-11
              w-full
              border-[--embeddable-controls-multiSelector-borderColor]
              max-h-[--embeddable-controls-multiSelector-maxHeight]
              z-[--embeddable-controls-multiSelector-zIndex]
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
          right-2.5
          top-2.5
          z-[--embeddable-controls-multiSelector-chevron-zIndex]
        `}
        />

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
              z-[--embeddable-controls-multiSelector-clear-zIndex]
            `}
          >
            <ClearIcon />
          </div>
        )}
      </div>
    </Container>
  );
};
