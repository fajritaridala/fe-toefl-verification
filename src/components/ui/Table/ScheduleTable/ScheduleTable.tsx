import {
  ALL_MONTH_OPTION_VALUE,
  ALL_SERVICE_OPTION_VALUE,
} from '@features/admin/schedules/Schedules.constants';
import {
  Button,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  cn,
} from '@heroui/react';
import type { Selection } from '@heroui/react';
import { Filter, Plus, RefreshCw } from 'lucide-react';
import { LimitFilter } from '@/components/ui/Button/Filter/LimitFilter';
import { ScheduleTableProps } from './ScheduleTable.types';
import { createRenderCell, handleSelectionChange } from './ScheduleTable.utils';

const ScheduleTable = (props: ScheduleTableProps) => {
  const {
    columns,
    schedules,
    serviceOptions,
    monthOptions,
    selectedMonth,
    selectedService,
    isLoading,
    isRefetching,
    currentLimit,
    currentPage,
    totalPages,
    onChangePage,
    onChangeLimit,
    onSelectMonth,
    onSelectService,
    onRefresh,
    onAdd,
    onEdit,
    onDelete,
  } = props;

  const combineOptions = [
    { value: ALL_SERVICE_OPTION_VALUE, label: 'Semua Layanan' },
    ...serviceOptions,
  ];
  const monthSelectionValue = selectedMonth || ALL_MONTH_OPTION_VALUE;
  const serviceSelectionValue = selectedService || ALL_SERVICE_OPTION_VALUE;

  const renderCell = createRenderCell({ onEdit, onDelete });

  const handleMonthSelection = (keys: Selection) => {
    handleSelectionChange(keys, ALL_MONTH_OPTION_VALUE, (val) =>
      onSelectMonth(val === ALL_MONTH_OPTION_VALUE ? '' : val)
    );
  };

  const handleServiceSelection = (keys: Selection) => {
    handleSelectionChange(keys, ALL_SERVICE_OPTION_VALUE, (val) =>
      onSelectService(val === ALL_SERVICE_OPTION_VALUE ? '' : val)
    );
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-gray-100 bg-white shadow-md shadow-gray-100/50">
        {/* Filters Section */}
        <div className="bg-transparent px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <Select
                selectedKeys={new Set([monthSelectionValue])}
                onSelectionChange={handleMonthSelection}
                radius="full"
                variant="bordered"
                labelPlacement="outside"
                placeholder="Filter bulan"
                disallowEmptySelection
                items={monthOptions}
                startContent={<Filter className="h-4 w-4 text-gray-400" />}
                className="w-full sm:w-44"
                classNames={{
                  trigger:
                    'bg-white border-gray-200 hover:border-gray-300 transition-colors',
                  value: 'text-sm font-medium text-gray-700',
                }}
              >
                {(option) => (
                  <SelectItem key={option.value}>{option.label}</SelectItem>
                )}
              </Select>
              <Select
                selectedKeys={new Set([serviceSelectionValue])}
                onSelectionChange={handleServiceSelection}
                radius="full"
                variant="bordered"
                labelPlacement="outside"
                placeholder="Filter layanan"
                disallowEmptySelection
                items={combineOptions}
                startContent={<Filter className="h-4 w-4 text-gray-400" />}
                className="w-full sm:w-52"
                classNames={{
                  trigger:
                    'bg-white border-gray-200 hover:border-gray-300 transition-colors',
                  value: 'text-sm font-medium text-gray-700',
                }}
              >
                {(option) => (
                  <SelectItem key={option.value}>{option.label}</SelectItem>
                )}
              </Select>
              <LimitFilter
                value={String(currentLimit)}
                onChange={(val) => onChangeLimit(Number(val))}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                radius="full"
                color="primary"
                className="shadow-primary/20 font-semibold text-white shadow-lg transition-transform hover:scale-[1.02]"
                startContent={<Plus size={18} />}
                onPress={onAdd}
              >
                Tambah Jadwal
              </Button>
              <Button
                isIconOnly
                radius="full"
                variant="flat"
                className="border-secondary hover:border-secondary/70 w-full border bg-white hover:bg-gray-50 sm:w-auto"
                onPress={onRefresh}
                isDisabled={isRefetching}
                aria-label="Refresh data"
              >
                <RefreshCw
                  className={cn(
                    'text-secondary h-4 w-4',
                    isRefetching && 'animate-spin'
                  )}
                />
              </Button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-b-2xl">
          <Table
            aria-label="Tabel jadwal"
            selectionMode="none"
            removeWrapper
            classNames={{
              th: 'bg-gray-50/80 text-gray-500 font-bold text-xs uppercase tracking-wider px-6 py-4 border-b border-gray-100',
              td: 'px-6 py-4 text-sm text-gray-700 border-b border-gray-50',
              tr: 'hover:bg-gray-50/50 transition-colors',
              base: 'min-w-full',
            }}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.key}
                  className={
                    column.key === 'scheduleDate' ? 'text-left' : 'text-center'
                  }
                >
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={schedules}
              isLoading={isLoading}
              loadingContent={
                <div className="flex flex-col items-center justify-center py-12">
                  <Spinner size="lg" color="primary" />
                  <p className="mt-3 text-sm text-gray-500">
                    Memuat data jadwal...
                  </p>
                </div>
              }
              emptyContent={
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                    <svg
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-base font-medium text-gray-900">
                    Tidak ada data jadwal
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Klik tombol Tambah Jadwal untuk membuat jadwal baru
                  </p>
                </div>
              }
            >
              {(item) => (
                <TableRow key={item.__rowKey || item.scheduleId}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        {!isLoading && totalPages > 1 && (
          <div className="rounded-b-xl border-t border-gray-100 bg-gray-50 px-6 py-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Pagination
                showShadow
                showControls
                page={currentPage}
                total={totalPages}
                onChange={onChangePage}
                variant="light"
                classNames={{
                  wrapper: 'gap-1',
                  item: 'w-8 h-8 min-w-8 bg-white',
                  cursor: 'bg-primary text-white font-semibold',
                  prev: 'bg-transparent',
                  next: 'bg-transparent',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ScheduleTable;
