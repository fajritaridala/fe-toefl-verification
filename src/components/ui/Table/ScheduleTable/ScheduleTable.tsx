import { Key, ReactNode } from 'react';
import {
  RefreshCw,
  Plus,
  Calendar,
  Filter,
  PenLine,
  Trash2,
  Users,
} from 'lucide-react';
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  Progress,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import type { Selection } from '@heroui/react';
import moment from 'moment';
import {
  ALL_MONTH_OPTION_VALUE,
  ALL_SERVICE_OPTION_VALUE,
  MonthOption,
  ScheduleTableColumn,
  ServiceOption,
} from '@features/admin/schedules/Schedules.constants';
import { LIMIT_LISTS } from '@/constants/list.constants';
import { ScheduleItem } from '@features/admin';

type Props = {
  columns: ScheduleTableColumn[];
  schedules: ScheduleItem[];
  serviceOptions: ServiceOption[];
  monthOptions: MonthOption[];
  selectedMonth: string;
  selectedService: string;
  isLoading: boolean;
  isRefetching: boolean;
  currentLimit: number;
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
  onChangeLimit: (value: number) => void;
  onSelectMonth: (value: string) => void;
  onSelectService: (value: string) => void;
  onRefresh: () => void;
  onAdd: () => void;
  onEdit: (schedule: ScheduleItem) => void;
  onDelete: (schedule: ScheduleItem) => void;
  onViewParticipants: (schedule: ScheduleItem) => void;
};

const ScheduleTable = (props: Props) => {
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
    onViewParticipants,
  } = props;

  const combineOptions = [
    { value: ALL_SERVICE_OPTION_VALUE, label: 'Semua Layanan' },
    ...serviceOptions,
  ];
  const monthSelectionValue = selectedMonth || ALL_MONTH_OPTION_VALUE;

  const formatDateTimeRange = (date?: string | Date, start?: string, end?: string) => {
    const dayLabel = date ? moment(date).format('DD MMM YYYY') : '-';
    const timeLabel = start && end ? `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}` : '';
    return { dayLabel, timeLabel };
  };

  const renderCell = (
    schedule: ScheduleItem,
    columnKey: Key
  ): ReactNode => {
    const registrants =
      typeof schedule.registrants === 'number' ? schedule.registrants : 0;
    const quota =
      typeof schedule.quota === 'number' ? Number(schedule.quota) : undefined;
    const isFull = quota ? registrants >= quota : false;
    const statusLabel =
      schedule.status === 'aktif'
        ? isFull
          ? 'Penuh'
          : 'Aktif'
        : 'Tidak aktif';
    const serviceName = schedule.serviceName || 'Tidak diketahui';

    switch (columnKey) {
      case 'scheduleDate': {
        const { dayLabel, timeLabel } = formatDateTimeRange(
          schedule.scheduleDate,
          schedule.startTime,
          schedule.endTime
        );
        return (
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-gray-900">{dayLabel}</p>
            {timeLabel && (
              <p className="text-xs text-gray-500">{timeLabel}</p>
            )}
          </div>
        );
      }
      case 'service':
        return (
          <div className="flex justify-center">
            <Chip
              size="sm"
              startContent={<Calendar className="h-3 w-3" />}
              className="bg-primary/10 text-primary border-primary/30 border px-2"
              classNames={{
                content: 'text-xs font-medium',
              }}
            >
              {serviceName}
            </Chip>
          </div>
        );
      case 'quota': {
        const ratioLabel = quota ? `${registrants}/${quota}` : `${registrants}`;
        const progressValue = quota
          ? Math.min((registrants / quota) * 100, 100)
          : registrants > 0
            ? 100
            : 0;

        return (
          <div className="mx-auto flex w-32 items-center gap-3">
            <Progress
              aria-label="Disponibilitas kuota"
              size="sm"
              value={progressValue}
              classNames={{
                base: 'flex-1',
                track: 'h-2 rounded-full',
                indicator: `rounded-full ${isFull ? 'bg-danger' : 'bg-primary'}`,
              }}
            />
            <span className="text-xs text-gray-600 font-semibold">
              {ratioLabel}
            </span>
          </div>
        );
      }
      case 'status':
        return (
          <div className="flex justify-center">
            <Chip
              size="sm"
              variant="flat"
              color={
                schedule.status === 'tidak aktif'
                  ? 'warning'
                  : isFull
                    ? 'danger'
                    : 'success'
              }
              classNames={{
                content: 'text-xs font-medium',
                base: 'px-2 border',
              }}
            >
              {statusLabel}
            </Chip>
          </div>
        );
      case 'actions':
        return (
          <div className="flex justify-center">
            <Dropdown>
              <DropdownTrigger>
                <Button 
                  isIconOnly 
                  size="sm"
                  variant="light"
                  className="hover:text-primary text-gray-600"
                >
                  <PenLine size={16} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Aksi jadwal">
                <DropdownItem
                  key="view-participants"
                  startContent={<Users size={16} />}
                  onPress={() => onViewParticipants(schedule)}
                >
                  Daftar Peserta
                </DropdownItem>
                <DropdownItem
                  key="edit-schedule"
                  startContent={<PenLine size={16} />}
                  onPress={() => onEdit(schedule)}
                >
                  Ubah
                </DropdownItem>
                <DropdownItem
                  key="delete-schedule"
                  className="text-danger"
                  startContent={<Trash2 size={16} />}
                  onPress={() => onDelete(schedule)}
                >
                  Hapus
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return null;
    }
  };

  const serviceSelectionValue = selectedService || ALL_SERVICE_OPTION_VALUE;

  const handleMonthSelection = (keys: Selection) => {
    if (keys === 'all') {
      onSelectMonth(ALL_MONTH_OPTION_VALUE);
      return;
    }
    const firstKey =
      keys.size > 0 ? Array.from(keys)[0]?.toString() : undefined;
    const nextValue = firstKey ?? ALL_MONTH_OPTION_VALUE;
    onSelectMonth(nextValue === ALL_MONTH_OPTION_VALUE ? '' : nextValue);
  };

  const handleServiceSelection = (keys: Selection) => {
    if (keys === 'all') {
      onSelectService('');
      return;
    }
    const firstKey =
      keys.size > 0 ? Array.from(keys)[0]?.toString() : undefined;
    const nextValue = firstKey ?? ALL_SERVICE_OPTION_VALUE;
    onSelectService(nextValue === ALL_SERVICE_OPTION_VALUE ? '' : nextValue);
  };

  const handleLimitSelection = (keys: Selection) => {
    if (keys === 'all') return;
    const firstKey =
      keys.size > 0 ? Array.from(keys)[0]?.toString() : undefined;
    if (!firstKey) return;
    const nextValue = Number(firstKey);
    if (!Number.isNaN(nextValue)) {
      onChangeLimit(nextValue);
    }
  };

  return (
    <section className="space-y-4">
      {/* Refetch Indicator */}
      {isRefetching && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Spinner size="sm" color="primary" />
          <p>Mengambil data terbaru...</p>
        </div>
      )}

      {/* Table Card */}
      <div className="bg-white rounded-xl drop-shadow">
        {/* Filters Section */}
        <div className="bg-transparent px-6 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Filter Controls */}
            <div className="flex flex-col gap-3 sm:flex-row flex-1">
              <Select
                selectedKeys={new Set([monthSelectionValue])}
                onSelectionChange={handleMonthSelection}
                variant="bordered"
                labelPlacement="outside"
                placeholder="Filter bulan"
                disallowEmptySelection
                items={monthOptions}
                startContent={<Filter className="h-4 w-4 text-gray-400" />}
                className="w-full sm:w-44"
                classNames={{
                  trigger: 'bg-white border-gray-200 hover:border-gray-300',
                  value: 'text-sm font-semibold text-gray-700',
                }}
              >
                {(option) => (
                  <SelectItem key={option.value}>{option.label}</SelectItem>
                )}
              </Select>
              <Select
                selectedKeys={new Set([serviceSelectionValue])}
                onSelectionChange={handleServiceSelection}
                variant="bordered"
                labelPlacement="outside"
                placeholder="Filter layanan"
                disallowEmptySelection
                items={combineOptions}
                startContent={<Filter className="h-4 w-4 text-gray-400" />}
                className="w-full sm:w-52"
                classNames={{
                  trigger: 'bg-white border-gray-200 hover:border-gray-300',
                  value: 'text-sm font-semibold text-gray-700',
                }}
              >
                {(option) => (
                  <SelectItem key={option.value}>{option.label}</SelectItem>
                )}
              </Select>
              <Button
                isIconOnly
                variant="flat"
                className="bg-white border border-gray-200 hover:border-gray-300 w-full sm:w-auto"
                onPress={onRefresh}
                aria-label="Refresh data"
              >
                <RefreshCw className="h-4 w-4 text-gray-600" />
              </Button>
            </div>

            {/* Add Button */}
            <Button
              className="bg-primary text-white shadow-small font-semibold transition-all duration-200 hover:-translate-y-0.5"
              startContent={<Plus size={18} />}
              onPress={onAdd}
            >
              Tambah Jadwal
            </Button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-b-xl">
          <Table
            aria-label="Tabel jadwal"
            selectionMode="none"
            removeWrapper
            classNames={{
              th: 'bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wide px-6 py-4 border-b text-center border-gray-200',
              td: 'px-6 py-4 text-sm text-gray-900 border-b border-gray-100',
              tr: 'hover:bg-gray-50/50 transition-colors',
              base: 'min-w-full',
            }}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key} className={column.className}>
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
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
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
                    Klik tombol 'Tambah Jadwal' untuk membuat jadwal baru
                  </p>
                </div>
              }
            >
              {(item) => (
                <TableRow key={item._id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer - Only show if more than 1 page */}
        {!isLoading && totalPages > 1 && (
          <div className="rounded-b-xl bg-gray-50 px-6 py-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Limit Selector */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Tampilkan</span>
                <Select
                  selectedKeys={new Set([String(currentLimit)])}
                  onSelectionChange={handleLimitSelection}
                  className="w-20"
                  disallowEmptySelection
                  size="sm"
                  classNames={{
                    trigger: 'h-8 min-h-8 bg-white border border-gray-200',
                    value: 'text-sm',
                  }}
                >
                  {LIMIT_LISTS.map((option) => (
                    <SelectItem key={String(option.value)}>{option.label}</SelectItem>
                  ))}
                </Select>
                <span>baris</span>
              </div>

              {/* Pagination */}
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
