'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Loader2 } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  createButtonText?: string;
  onCreateClick?: () => void;
  onRowClick?: (item: T) => void;
  searchKeys?: (keyof T)[];
  loading?: boolean;
  error?: string | null;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function DataTable<T extends { id: number | string }>({
  title,
  data,
  columns,
  searchPlaceholder = 'Search...',
  createButtonText,
  onCreateClick,
  onRowClick,
  searchKeys = [],
  loading = false,
  error = null,
  searchQuery = '',
  onSearchChange,
}: DataTableProps<T>) {
  const handleReset = () => {
    onSearchChange?.('');
  };

  const handleSearchChange = (value: string) => {
    onSearchChange?.(value);
  };

  const getCellValue = (item: T, column: Column<T>) => {
    if (column.render) {
      return column.render(item);
    }
    return item[column.key as keyof T]?.toString() || '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
        {createButtonText && onCreateClick && (
          <Button 
            onClick={onCreateClick}
          >
            {createButtonText}
          </Button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Button variant="outline" className="text-gray-700 dark:text-gray-300">
              Filter
              <span className="ml-2">▼</span>
            </Button>
          </div>
          
          <div className="flex-1">
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full"
            />
          </div>

          <Button
            variant="ghost"
            onClick={handleReset}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        {error && (
          <div className="px-6 py-12 text-center">
            <p className="text-red-600 dark:text-red-400 font-medium mb-2">Error loading data</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{error}</p>
          </div>
        )}

        {loading && !error && (
          <div className="px-6 py-12">
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        {column.label}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {data.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => onRowClick?.(item)}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                    >
                      {columns.map((column, colIndex) => (
                        <td
                          key={colIndex}
                          className={`px-6 py-4 whitespace-nowrap ${column.className || ''}`}
                        >
                          {getCellValue(item, column)}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <ChevronRight className="inline-block h-5 w-5 text-gray-400" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'No results found.' : 'No data available.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}