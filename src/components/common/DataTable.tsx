import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { EmptyState } from '../feedback/EmptyState';

interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
}

export function DataTable<T extends { id: string | number }>({ columns, data, onRowClick, isLoading }: DataTableProps<T>) {
  if (!isLoading && data.length === 0) {
    return <EmptyState title="No Records Found" description="Try adjusting your search or filters." />;
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-5 py-4 text-xs uppercase font-bold text-[#64748B] whitespace-nowrap">
                  <div className={cn("flex items-center gap-1", col.sortable && "cursor-pointer hover:text-[#0B2E59]")}>
                    {col.header}
                    {col.sortable && <ArrowUpDown className="w-3 h-3 opacity-50" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            {data.map((row) => (
              <tr 
                key={row.id} 
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "border-b border-[#E2E8F0] hover:bg-slate-50 transition-colors group",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-4 whitespace-nowrap">
                    {col.render ? col.render(row) : (row as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}