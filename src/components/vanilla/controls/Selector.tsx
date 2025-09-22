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
import Container from '../Container';
import { ChevronDown, ClearIcon } from '../icons';
import { SelectorOption } from './Selector.types';
import { selectorOptionIncludesSearch } from './Selector.utils';

export type Props = {
  className?: string;
  minDropdownWidth?: number;
  placeholder?: string;
  defaultValue?: string;
  options: SelectorOption[];
  title?: string;
  unclearable?: boolean;
  onChange: (v: string) => void;
};

export default (props: Props) => {
  const ref = useRef<HTMLInputElement | null>(null);

  const [focus, setFocus] = useState(false);
  const [isDropdownOrItemFocused, setIsDropdownOrItemFocused] = useState(false);
  const [search, setSearch] = useState('');
  const [triggerBlur, setTriggerBlur] = useState(false);
  const [value, setValue] = useState(props.defaultValue);

  const valueLabel: string | undefined = props.options.find(
    (option) => option.value === value,
  )?.label;

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

  const setDropdownValue = useCallback(
    (value: string) => {
      performSearch('');
      setValue(value);
      props.onChange(value);
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

  const list = useMemo(() => {
    return props.options
      .filter((option) => selectorOptionIncludesSearch(search, option))
      .map((option) => (
        <div
          key={option.value}
          role="button"
          onClick={() => {
            setFocus(false);
            setTriggerBlur(true);
            setDropdownValue(option.value);
          }}
          onKeyDown={(e) => {
            handleKeyDownCallback(
              e,
              () => {
                setDropdownValue(option.value);
              },
              true,
            );
          }}
          className={`
            cursor-pointer
            flex
            font-normal
            hover:bg-black/5
            items-center
            min-h-[36px]
            overflow-hidden
            px-3
            py-2
            text-ellipsis
            whitespace-nowrap
            text-[color:--embeddable-controls-font-colors-normal]
            ${value === option.value ? 'bg-black/5' : ''}
          `}
          tabIndex={0}
        >
          {option.label}
        </div>
      ));
  }, [props.options, value, setDropdownValue, search]) as ReactNode[];

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
            text-[color:--embeddable-controls-font-colors-normal]
            ${focus || !value ? '' : 'opacity-0'}
          `}
        />

        {valueLabel && (
          <span
            className={`
              absolute
              block
              h-8
              leading-8
              left-3
              overflow-hidden
              pointer-events-none
              rounded-xl
              text-sm
              top-1
              truncate
              w-[calc(100%-2.5rem)]
              whitespace-nowrap
              text-[color:--embeddable-controls-font-colors-normal]
              ${focus ? 'hidden' : ''}
            `}
          >
            {valueLabel}
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
              setDropdownValue('');
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
