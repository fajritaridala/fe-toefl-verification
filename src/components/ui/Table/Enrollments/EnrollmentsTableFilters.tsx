"use client";

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import {
  Input,
  Select,
  SelectItem,
} from '@heroui/react';
import { LIMIT_LISTS } from '@/constants/list.constants';
import { useDebounce } from '@/hooks/useDebounce';
import type { StatusOption } from './EnrollmentsTable.types';

type EnrollmentsTableFiltersProps = {
  currentSearch: string;
  statusFilter: string;
  statusOptions: StatusOption[];
  showStatusFilter: boolean;
  currentLimitValue: string;
  onSearch: (value: string) => void;
  onClearSearch: () => void;
  onChangeStatus: (value: string) => void;
  onChangeLimit: (value: string) => void;
};

export default function EnrollmentsTableFilters({
  currentSearch,
  statusFilter,
  statusOptions,
  showStatusFilter,
  currentLimitValue,
  onSearch,
  onClearSearch,
  onChangeStatus,
  onChangeLimit,
}: EnrollmentsTableFiltersProps) {
  const [searchInput, setSearchInput] = useState(currentSearch);
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  const handleClearSearch = () => {
    setSearchInput('');
    onClearSearch();
  };
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Search Input - Clean & Simple */}
      <Input
        isClearable
        type="search"
        placeholder="Cari peserta..."
        startContent={<Search className="w-4 h-4 text-gray-400" />}
        value={searchInput}
        onClear={handleClearSearch}
        onValueChange={setSearchInput}
        classNames={{
          base: 'w-full sm:max-w-md',
          inputWrapper: 'h-10 bg-white border border-gray-200 hover:border-gray-300',
          input: 'text-sm',
        }}
      />

      {/* Filter Controls - Clean & Compact */}
      <div className="flex items-center gap-2">
        {/* Status Filter */}
        {showStatusFilter && (
          <Select
            disallowEmptySelection
            aria-label="Filter status"
            placeholder="Status"
            selectedKeys={new Set([statusFilter])}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              onChangeStatus(value);
            }}
            classNames={{
              base: 'w-36',
              trigger: 'h-10 bg-white border border-gray-200 hover:border-gray-300',
              value: 'text-sm',
            }}
          >
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </Select>
        )}

        {/* Limit Per Page */}
        <Select
          disallowEmptySelection
          aria-label="Items per page"
          selectedKeys={new Set([currentLimitValue])}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            onChangeLimit(value);
          }}
          classNames={{
            base: 'w-24',
            trigger: 'h-10 bg-white border border-gray-200 hover:border-gray-300',
            value: 'text-sm',
          }}
        >
          {LIMIT_LISTS.map((limit) => (
            <SelectItem key={limit.value}>
              {limit.label}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
}
