import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { DataResponse } from '@embeddable.com/core';
import { useTheme } from '@embeddable.com/react';

import IconDownloadCSV from '../icons/DownloadCSV';
import IconDownloadPNG from '../icons/DownloadPNG';
import IconVerticalEllipsis from '../icons/VerticalEllipsis';
import downloadAsCSV from '../util/downloadAsCSV';
import downloadAsPNG from '../util/downloadAsPNG';
import { ContainerProps } from './Container';
import { Theme } from '../../themes/theme';

const FOCUS_TIMEOUT_MS = 200;
const PNG_TIMEOUT_MS = 200;

interface CSVProps extends ContainerProps {
  results?: DataResponse | DataResponse[];
  prevResults?: DataResponse;
}

type Props = {
  csvOpts?: {
    chartName: string;
    props: CSVProps;
  };
  downloadAllFunction?: () => void;
  enableDownloadAsCSV?: boolean;
  enableDownloadAsPNG?: boolean;
  pngOpts?: {
    chartName: string;
    element: HTMLDivElement | null;
  };
  preppingDownload: boolean;
  setPreppingDownload: Dispatch<SetStateAction<boolean>>;
};

const DownloadMenu: React.FC<Props> = (props) => {
  const {
    csvOpts,
    downloadAllFunction,
    enableDownloadAsCSV,
    enableDownloadAsPNG,
    pngOpts,
    preppingDownload,
    setPreppingDownload,
  } = props;
  const theme: Theme = useTheme() as Theme;

  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [isDownloadStarted, setIsDownloadStarted] = useState<boolean>(false);
  const [focusedMenuItem, setFocusedMenuItem] = useState<string>('');
  const refFocus = useRef<HTMLAnchorElement>(null);

  // Need a useEffect here because we want a render cycle to complete so the menu closes pre-html2canvas
  useEffect(() => {
    if (isDownloadStarted && preppingDownload) {
      if (!pngOpts) {
        console.error('No PNG options supplied');
        return;
      }
      const { chartName, element } = pngOpts;
      if (element) {
        // Strip out any characters that aren't alphanumeric or spaces
        const cleanedChartName = chartName.replace(/([^a-zA-Z0-9 ]+)/gi, '-');
        const timestamp = new Date().toISOString();
        // Without the timeout, the spinner doesn't show up due to html2canvas stopping everything
        // We can't clear this timeout because the download will be cancelled due to useEffect cleanup
        setTimeout(() => {
          downloadAsPNG(
            element,
            `${cleanedChartName}-${timestamp}.png`,
            setPreppingDownload,
            theme,
          );
        }, PNG_TIMEOUT_MS);
      }
      setIsDownloadStarted(false);
    }
  }, [isDownloadStarted, pngOpts, preppingDownload, setPreppingDownload, theme]);

  useEffect(() => {
    if (showMenu) {
      refFocus.current?.focus();
    }
  }, [showMenu]);

  // Accessibility - Close the menu if we've tabbed off of any items it contains
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (focusedMenuItem === '') {
      timeoutId = setTimeout(() => {
        setShowMenu(false);
      }, FOCUS_TIMEOUT_MS);
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
  }, [focusedMenuItem]);

  // Handle CSV downloads using supplied options
  const handleCSVClick = (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
    e.preventDefault();
    if (!csvOpts) {
      console.error('No CSV options supplied');
      return;
    }
    const { chartName, props: csvProps } = csvOpts;
    let { results } = csvProps;
    if (!results) {
      return;
    }
    results = null;
    console.log('here');
    // concatenate results data if results is an array (from pivot table)
    let data: DataResponse['data'] = [];
    if (Array.isArray(csvProps.results)) {
      data = results.reduce((acc: DataResponse['data'] = [], result) => {
        if (result?.data) {
          acc.push(...result.data);
        }
        return acc;
      }, []);
    } else {
      data = results?.data;
    }
    downloadAsCSV(csvProps, data, csvProps.prevResults?.data, chartName, setPreppingDownload);
  };

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
      setShowMenu(false);
    }
  };

  // Handle the Click on the PNG icon - triggers the useEffect above
  const handlePNGClick = (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
    e.preventDefault();
    setShowMenu(false);
    setPreppingDownload(true);
    setIsDownloadStarted(true);
  };

  // Toggle the download menu
  const handleSetShow = () => {
    setShowMenu(!showMenu);
  };

  // If neither CSV nor PNG downloads are enabled, show nothing
  if (!enableDownloadAsCSV && !enableDownloadAsPNG) {
    return null;
  }

  // If only CSV is enabled, skip the menu and show just the CSV download Icon
  // If there's a downloadAllFunction, we need to show the menu
  if (enableDownloadAsCSV && !enableDownloadAsPNG && !downloadAllFunction) {
    return (
      <div
        className={`
        absolute
        flex
        items-center
        justify-end
        right-0
        space-x-2
        top-0
        z-[--embeddable-downloadMenu-zIndex]
      `}
      >
        <div
          onClick={handleCSVClick}
          className="cursor-pointer"
          tabIndex={0}
          onKeyDown={(e) => handleKeyDownCallback(e, handleCSVClick, false)}
        >
          {!preppingDownload && (
            <IconDownloadCSV className="cursor-pointer hover:opacity-100 opacity-50" />
          )}
        </div>
      </div>
    );
  }

  // If only PNG is enabled, skip the menu and show just the PNG download Icon
  if (!enableDownloadAsCSV && enableDownloadAsPNG) {
    return (
      <div
        className={`
        absolute
        flex
        items-center
        justify-end
        right-0
        space-x-2
        top-0
        z-[--embeddable-downloadMenu-zIndex]
      `}
      >
        <div
          onClick={handlePNGClick}
          className="cursor-pointer"
          tabIndex={0}
          onKeyDown={(e) => handleKeyDownCallback(e, handlePNGClick, false)}
        >
          {!preppingDownload && (
            <IconDownloadPNG className="cursor-pointer hover:opacity-100 opacity-50" />
          )}
        </div>
      </div>
    );
  }

  // Main Component
  return (
    <>
      <div
        className={`
        absolute
        flex
        items-center
        justify-end
        right-0
        space-x-2
        top-0
        z-[--embeddable-downloadMenu-zIndex]
      `}
      >
        <div
          onClick={handleSetShow}
          className="cursor-pointer relative w-3 flex justify-center"
          onKeyDown={(e) => handleKeyDownCallback(e, handleSetShow, true)}
          tabIndex={0}
        >
          {!preppingDownload && (
            <IconVerticalEllipsis className="cursor-pointer hover:opacity-100 opacity-50" />
          )}
          {showMenu && (
            <>
              <div
                className={`
                absolute
                flex
                items-center
                max-w-100
                right-0
                top-6
                whitespace-nowrap
                bg-[color:--embeddable-downloadMenu-backgroundColor]
                p-[--embeddable-downloadMenu-paddingOuter]
                rounded-[--embeddable-downloadMenu-borderRadius]
              `}
                style={{
                  border: theme.downloadMenu.border,
                  boxShadow: theme.downloadMenu.boxShadow,
                }}
              >
                <ul>
                  <li>
                    <a
                      href="#"
                      onClick={handleCSVClick}
                      onKeyDown={(e) => handleKeyDownCallback(e, handleCSVClick, false)}
                      className={`
                        flex
                        items-center
                        hover:bg-[color:--embeddable-downloadMenu-hover-backgroundColor]
                        hover:text-[color:--embeddable-downloadMenu-hover-fontColor]
                        p-[--embeddable-downloadMenu-paddingInner]
                        text-[color:--embeddable-downloadMenu-font-color]
                      `}
                      tabIndex={0}
                      ref={refFocus}
                      onFocus={() => setFocusedMenuItem('csv')}
                      onBlur={() => setFocusedMenuItem('')}
                    >
                      <IconDownloadCSV className="cursor-pointer inline-block mr-2" /> Download CSV
                    </a>
                  </li>
                  {downloadAllFunction && (
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          downloadAllFunction();
                        }}
                        onKeyDown={(e) => handleKeyDownCallback(e, downloadAllFunction, false)}
                        className={`
                        flex
                        items-center
                        hover:bg-[color:--embeddable-downloadMenu-hover-backgroundColor]
                        hover:text-[color:--embeddable-downloadMenu-hover-fontColor]
                        p-[--embeddable-downloadMenu-paddingInner]
                        text-[color:--embeddable-downloadMenu-font-color]
                      `}
                        tabIndex={0}
                        onFocus={() => setFocusedMenuItem('downloadAll')}
                        onBlur={() => setFocusedMenuItem('')}
                      >
                        <IconDownloadCSV className="cursor-pointer inline-block mr-2" /> Download
                        All as CSV
                      </a>
                    </li>
                  )}
                  <li>
                    <a
                      href="#"
                      onClick={handlePNGClick}
                      onKeyDown={(e) => handleKeyDownCallback(e, handlePNGClick, false)}
                      className={`
                        flex
                        items-center
                        hover:bg-[color:--embeddable-downloadMenu-hover-backgroundColor]
                        hover:text-[color:--embeddable-downloadMenu-hover-fontColor]
                        p-[--embeddable-downloadMenu-paddingInner]
                        text-[color:--embeddable-downloadMenu-font-color]
                      `}
                      tabIndex={0}
                      onFocus={() => setFocusedMenuItem('png')}
                      onBlur={() => setFocusedMenuItem('')}
                    >
                      <IconDownloadPNG className="cursor-pointer inline-block mr-2" /> Download PNG
                    </a>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DownloadMenu;
