import dayjs from 'dayjs';
import { DataResponse, DimensionOrMeasure } from '@embeddable.com/core';
import { useTheme } from '@embeddable.com/react';

import Container from '../../Container';
import { Theme } from '../../../../themes/theme';

export type Props = {
  columns: DimensionOrMeasure[];
  results: DataResponse;
  title: string;
};

function formatColumn(text: string | number, column: DimensionOrMeasure) {
  if (column.inputs?.format) {
    return dayjs(text).format(column.inputs.format);
  }
  return `${text} ${column.inputs?.suffix || ''}`.trim();
}

const TableHead = ({ columns }: { columns: DimensionOrMeasure[] }) => {
  return (
    <thead className={`border-y border-[color:--embeddable-controls-borders-colors-primary]`}>
      <tr>
        {columns.map((column) => {
          return (
            <th
              key={column.name}
              className={`
                cursor-pointer
                p-3
                select-none
                bg-[color:--embeddable-controls-backgrounds-colors-soft]
              `}
            >
              <div className="flex items-center gap-1 hover:text-black">
                <span className="embeddable-table-header mr-1 truncate">
                  {column.inputs?.label ? column.inputs?.label : column.title}
                </span>
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default (props: Props) => {
  const { columns, results } = props;

  const theme: Theme = useTheme() as Theme;

  return (
    <Container {...props} childContainerClassName="overflow-x-auto" className="overflow-y-auto">
      <div>
        {!(props.results?.isLoading && !props.results?.data?.length) && (
          <table className="overflow-visible w-full" style={{ fontSize: theme.font.size }}>
            <TableHead columns={columns} />

            <tbody>
              {results?.data?.map((row, index) => (
                <tr key={index} className="hover:bg-gray-400/5">
                  {columns.map((column, index) => (
                    <td
                      key={index}
                      className="text-dark p-3 truncate"
                      style={{
                        fontSize: theme.font.size,
                        maxWidth: 'auto',
                      }}
                    >
                      <span title={formatColumn(row[column.name], column) ?? ''}>
                        {formatColumn(row[column.name], column)}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Container>
  );
};
