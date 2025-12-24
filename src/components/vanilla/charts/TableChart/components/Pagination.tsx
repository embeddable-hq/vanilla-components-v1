import React from 'react';

import cn from '../../../../util/cn';
import { ChevronLeft, ChevronRight, DoubleChevronLeft, DoubleChevronRight } from '../../../icons';

type Props = {
  currentPage: number;
  hasNextPage?: boolean;
  onPageChange?: (page: number) => void;
  totalPages?: number;
};

const Pagination = ({ currentPage, hasNextPage, onPageChange, totalPages }: Props) => {
  const pageToDisplay = currentPage + 1;
  const totalPagesToDisplay = totalPages ?? null;
  const pageText =
    `Page ${pageToDisplay}` + (totalPagesToDisplay ? ` of ${totalPagesToDisplay}` : '');
  return (
    <div
      className={`
        flex
        items-center
        justify-center
        left-0
        select-none
        sticky
        font-charts-pagination
        text-font-color-normal
        text-embeddable
      `}
    >
      {totalPages && totalPages > 0 && (
        <span onClick={() => onPageChange?.(0)}>
          <DoubleChevronLeft
            className={cn(
              `
            border
            cursor-pointer
            flex
            h-8
            hover:bg-black/10
            items-center
            justify-center
            p-1
            w-8
            mr-1
            border-[color:--embeddable-controls-borders-colors-normal]
            rounded-[--embeddable-controls-borders-radius]
          `,
              {
                'opacity-50 pointer-events-none': currentPage === 0,
              },
            )}
          />
        </span>
      )}
      <ChevronLeft
        className={cn(
          `
            border
            cursor-pointer
            flex
            h-8
            hover:bg-black/10
            items-center
            justify-center
            p-1
            w-8
            border-controls-borders-normal
            rounded-controls-borders-radius
          `,
          {
            'opacity-50 pointer-events-none': currentPage === 0,
          },
        )}
        onClick={() => {
          // check and make sure we are not on the first page
          if (currentPage === 0) return;
          // check and make sure we're not going below page 0
          if (currentPage - 1 < 0) return;
          onPageChange?.(currentPage - 1);
        }}
      />

      <span className="mx-4">{pageText}</span>

      <ChevronRight
        className={cn(
          `
          border
          cursor-pointer
          flex
          h-8
          hover:bg-black/10
          items-center
          justify-center
          p-1
          w-8
          border-controls-borders-normal
          rounded-controls-borders-radius
          
        `,
          {
            'opacity-50 pointer-events-none': !hasNextPage,
          },
        )}
        onClick={() => {
          // check and make sure we have a next page
          if (!hasNextPage) return;
          // check and make sure we are not exceeding total pages
          if (totalPagesToDisplay && currentPage + 1 >= totalPagesToDisplay) return;
          onPageChange?.(currentPage + 1);
        }}
      />
      {totalPages && totalPages > 0 && (
        <span onClick={() => totalPagesToDisplay && onPageChange?.(totalPagesToDisplay - 1)}>
          <DoubleChevronRight
            className={cn(
              `
            border
            cursor-pointer
            flex
            h-8
            hover:bg-black/10
            items-center
            justify-center
            p-1
            w-8
            ml-1
            border-[color:--embeddable-controls-borders-colors-normal]
            rounded-[--embeddable-controls-borders-radius]
          `,
              {
                'opacity-50 pointer-events-none':
                  !totalPagesToDisplay || currentPage + 1 >= totalPagesToDisplay,
              },
            )}
          />
        </span>
      )}
    </div>
  );
};

export default Pagination;
