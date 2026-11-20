import React, { useCallback, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { Card } from './Card.jsx';

const TableRow = React.memo(function TableRow({
  row,
  columns,
  isSelected,
  onRowClick,
}) {
  const handleClick = onRowClick ? () => onRowClick(row) : undefined;

  return (
    <tr
      onClick={handleClick}
      className={`transition-colors duration-150 ${isSelected ? 'bg-[#E6F2FB]' : 'bg-[#FFFFFF] hover:bg-[#E6F2FB]/50'
        } ${onRowClick ? 'cursor-pointer' : ''}`}
    >
      {columns.map((col) => (
        <td
          key={col.key}
          className={`px-4 py-3 text-[13px] text-[#1F2937] align-middle ${col.align === 'right' ? 'text-right tabular-nums' : 'text-left'
            }`}
        >
          {col.render(row)}
        </td>
      ))}
    </tr>
  );
});

function getColumnsSignature(columns) {
  return columns.map((c) => `${c.key}:${c.sortable ? 1 : 0}`).join('|');
}

function DataTableComponent({
  columns,
  data,
  rowKey,
  selectedId,
  onRowClick,
  emptyTitle = 'No matching records',
  emptyDescription = 'Try changing your search or filter.',
  emptyAction,
}) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const columnsSignature = getColumnsSignature(columns);

  const handleSort = useCallback((col) => {
    if (!col.sortable) return;
    setSortKey((prevKey) => {
      if (prevKey === col.key) {
        setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        return prevKey;
      }
      setSortDir('asc');
      return col.key;
    });
  }, []);

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col || !col.sortValue) return data;

    const decorated = data.map((row) => ({
      row,
      value: col.sortValue(row),
    }));

    decorated.sort((a, b) => {
      const aVal = a.value;
      const bVal = b.value;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const aStr = String(aVal);
      const bStr = String(bVal);
      return sortDir === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });

    return decorated.map((d) => d.row);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, columnsSignature, sortKey, sortDir]);

  if (data.length === 0) {
    return (
      <Card padding="lg" className="text-center">
        <p className="text-[15px] font-semibold text-[#1F2937]">{emptyTitle}</p>
        <p className="mt-1 text-[13px] text-[#5B6B7C]">{emptyDescription}</p>
        {emptyAction && (
          <div className="mt-4 flex justify-center">{emptyAction}</div>
        )}
      </Card>
    );
  }

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[#D6E6F2] bg-[#F2F8FD]/70">
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={`px-4 py-3 text-[13px] font-semibold text-[#5B6B7C] whitespace-nowrap ${col.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col)}
                        className={`inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#5B6B7C] hover:text-[#145E96] cursor-pointer ${col.align === 'right' ? 'flex-row-reverse' : ''
                          }`}
                      >
                        <span>{col.header}</span>
                        {isSorted ? (
                          sortDir === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-[#1C7AC0]" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-[#1C7AC0]" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D6E6F2]">
            {sortedData.map((row) => {
              const id = rowKey(row);
              return (
                <TableRow
                  key={id}
                  row={row}
                  columns={columns}
                  isSelected={selectedId === id}
                  onRowClick={onRowClick}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export const DataTable = React.memo(DataTableComponent);
DataTable.displayName = 'DataTable';