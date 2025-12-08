"use client";

import { CiSearch } from 'react-icons/ci';
import { LuFilter } from 'react-icons/lu';
import {
  Input,
  Select,
  SelectItem,
} from '@heroui/react';
import { LIMIT_LISTS } from '@/constants/list.constants';
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
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-3">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Cari berdasarkan nama..."
          startContent={<CiSearch />}
          value={currentSearch}
          onClear={onClearSearch}
          onValueChange={onSearch}
        />
        <div className="flex gap-3">
          {showStatusFilter && (
            <Select
              disallowEmptySelection
              label="Status"
              placeholder="Pilih status"
              startContent={<LuFilter />}
              className="w-[200px]"
              selectedKeys={new Set([statusFilter])}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                onChangeStatus(value);
              }}
            >
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </Select>
          )}
          <Select
            disallowEmptySelection
            label="Per halaman"
            className="w-[120px]"
            selectedKeys={new Set([currentLimitValue])}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              onChangeLimit(value);
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
    </div>
  );
}
