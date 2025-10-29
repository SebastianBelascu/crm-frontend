'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Loader2, ChevronLeft } from 'lucide-react';

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
  filterOptions?: { label: string; value: string }[];
  selectedFilter?: string;
  onFilterChange?: (filter: string) => void;
  filterLabel?: string;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
  sortOptions?: { label: string; value: string }[];
  currentPage?: number;
  totalPages?: number;
  perPage?: number;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
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
  filterOptions = [],
  selectedFilter = '',
  onFilterChange,
  filterLabel = 'Filter by City',
  sortBy = '',
  onSortChange,
  sortOptions = [],
  currentPage = 1,
  totalPages = 1,
  perPage = 15,
  onPageChange,
  onPerPageChange,
}: DataTableProps<T>) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleReset = () => {
    onSearchChange?.('');
    onFilterChange?.('');
    onSortChange?.('');
  };

  const handleSearchChange = (value: string) => {
    onSearchChange?.(value);
  };

  const handleFilterSelect = (value: string) => {
    onFilterChange?.(value);
    setIsFilterOpen(false);
  };

  const handleSortSelect = (value: string) => {
    onSortChange?.(value);
    setIsSortOpen(false);
  };

  const getSortLabel = () => {
    if (!sortBy) return 'Sort';
    const option = (sortOptions || []).find(opt => opt.value === sortBy);
    return option ? option.label : 'Sort';
  };

  const getCellValue = (item: T, column: Column<T>) => {
    if (column.render) {
      return column.render(item);
    }
    return item[column.key as keyof T]?.toString() || '';
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
        {createButtonText && onCreateClick && (
          <Button 
            onClick={onCreateClick}
            className="w-full sm:w-auto"
          >
            {createButtonText}
          </Button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-3 md:p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
          <div className="relative" ref={filterRef}>
            <Button 
              variant="outline" 
              className="text-gray-700 dark:text-gray-300 w-full sm:w-auto text-sm"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              {selectedFilter ? `${filterLabel}: ${selectedFilter}` : filterLabel}
              <span className="ml-2">▼</span>
            </Button>
            {isFilterOpen && filterOptions.length > 0 && (
              <div className="absolute z-10 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                <div className="py-1">
                  <button
                    onClick={() => handleFilterSelect('')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10 border-b border-gray-200 dark:border-gray-700"
                  >
                    All Cities
                  </button>
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFilterSelect(option.value)}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        selectedFilter === option.value
                          ? 'bg-primary/10 text-primary dark:bg-primary/20'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={sortRef}>
            <Button 
              variant="outline" 
              className="text-gray-700 dark:text-gray-300 w-full sm:w-auto text-sm"
              onClick={() => setIsSortOpen(!isSortOpen)}
            >
              {getSortLabel()}
              <span className="ml-2">▼</span>
            </Button>
            {isSortOpen && (sortOptions || []).length > 0 && (
              <div className="absolute z-10 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                <div className="py-1">
                  <button
                    onClick={() => handleSortSelect('')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10 border-b border-gray-200 dark:border-gray-700"
                  >
                    No Sort
                  </button>
                  {(sortOptions || []).map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortSelect(option.value)}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        sortBy === option.value
                          ? 'bg-primary/10 text-primary dark:bg-primary/20'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 w-full sm:w-auto text-sm"
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

      {/* Pagination */}
      {!loading && !error && data.length > 0 && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sm:px-6 rounded-b-lg">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">Items per page:</span>
            <select
              value={perPage}
              onChange={(e) => onPerPageChange?.(Number(e.target.value))}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}