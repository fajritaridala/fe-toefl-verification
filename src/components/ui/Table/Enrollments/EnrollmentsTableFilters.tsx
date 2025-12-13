'use client';

import { useEffect, useState } from 'react';
import { Input, Select, SelectItem } from '@heroui/react';
import { RefreshCw, Search } from 'lucide-react';
import { LIMIT_LISTS } from '@/constants/list.constants';
import { useDebounce } from '@/hooks/useDebounce';
import type { StatusOption } from './EnrollmentsTable.types';

type EnrollmentsTableFiltersProps = {
  currentSearch: string;
  statusFilter: string;
  statusOptions: StatusOption[];
  showStatusFilter: boolean;
  currentLimitValue: string;
  isRefetching?: boolean;
  onSearch: (value: string) => void;
  onClearSearch: () => void;
  onChangeStatus: (value: string) => void;
  onChangeLimit: (value: string) => void;
  onRefresh?: () => void;
};

export default function EnrollmentsTableFilters({
  currentSearch,
  statusFilter,
  statusOptions,
  showStatusFilter,
  currentLimitValue,
  isRefetching = false,
  onSearch,
  onClearSearch,
  onChangeStatus,
  onChangeLimit,
  onRefresh,
}: EnrollmentsTableFiltersProps) {
  const [searchInput, setSearchInput] = useState(currentSearch);
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    // Only call onSearch if debouncedSearch is different from currentSearch
    // This prevents infinite loop when currentSearch updates from URL
    if (debouncedSearch !== currentSearch) {
      onSearch(debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  const handleClearSearch = () => {
    setSearchInput('');
    onClearSearch();
  };
  return (
    <div className="flex items-center justify-between gap-4">
      {/* Search Input - Clean & Simple */}
      <Input
        isClearable
        type="search"
        radius="full"
        placeholder="Cari nama atau NIM peserta..."
        startContent={<Search className="h-4 w-4 text-gray-400" />}
        value={searchInput}
        onClear={handleClearSearch}
        onValueChange={setSearchInput}
        classNames={{
          base: 'w-full max-w-md',
          inputWrapper: 'h-8 bg-gray-50 shadow-sm',
          input: 'text-sm',
        }}
      />

      {/* Filter Controls - Clean & Compact */}
      <div className="flex w-full justify-end-safe gap-3">
        {/* Status Filter */}
        {showStatusFilter && (
          <div className="flex items-center gap-2">
            <Select
              disallowEmptySelection
              radius="full"
              aria-label="Filter status"
              placeholder="Status"
              selectedKeys={new Set([statusFilter])}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                onChangeStatus(value);
              }}
              classNames={{
                base: 'w-36',
                trigger: 'h-8 bg-gray-50 shadow-sm',
                value: 'text-small text-center',
                listbox: 'w-34',
                popoverContent: 'w-36',
              }}
            >
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value}>{opt.label}</SelectItem>
              ))}
            </Select>
          </div>
        )}

        {/* Limit Per Page */}
        <div className="flex items-center gap-2">
          <Select
            startContent={
              <p className="text-small text-text-muted">Tampilkan</p>
            }
            disallowEmptySelection
            radius="full"
            aria-label="Items per page"
            selectedKeys={new Set([currentLimitValue])}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              onChangeLimit(value);
            }}
            classNames={{
              base: 'w-36',
              trigger: 'h-8 bg-gray-50 shadow-sm',
              value: 'text-small text-center',
              listbox: 'w-34',
              popoverContent: 'w-36',
            }}
          >
            {LIMIT_LISTS.map((limit) => (
              <SelectItem key={String(limit.value)}>{limit.label}</SelectItem>
            ))}
          </Select>
        </div>

        {/* Refresh Button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefetching}
            className="bg-primary hover:bg-primary/10 group text-small inline-flex h-10 w-26 items-center justify-center gap-2 rounded-full px-2 font-semibold text-white shadow-sm transition-all delay-75 duration-300 disabled:cursor-not-allowed disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw
              className={`group-hover:text-primary h-4 w-4 text-white ${isRefetching ? 'animate-spin' : ''}`}
            />
            <p className="group-hover:text-primary">Refresh</p>
          </button>
        )}
      </div>
    </div>
  );
}
