import { ReactNode } from 'react';
import { BiDotsVerticalRounded, BiPlus } from 'react-icons/bi';
import {
  LuCalendar,
  LuFilter,
  LuPenLine,
  LuTrash2,
  LuUsers,
} from 'react-icons/lu';
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
} from '@/components/views/Admin/Schedules/Schedules.constants';
import { LIMIT_LISTS } from '@/constants/list.constants';
import { ScheduleItem } from '@/utils/interfaces/Schedule';

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
    onAdd,
    onEdit,
    onDelete,
    onViewParticipants,
  } = props;
  const combineOptions = [
    { value: ALL_SERVICE_OPTION_VALUE, label: 'Layanan' },
    ...serviceOptions,
  ];
  const monthSelectionValue = selectedMonth || ALL_MONTH_OPTION_VALUE;
  const formatDate = (date: string) => {
    if (!date) return '-';
    return moment(date).format('DD MMM YYYY');
  };

  const renderCell = (
    schedule: ScheduleItem,
    columnKey: ScheduleTableColumn['key']
  ): ReactNode => {
    const registrants =
      schedule.registrants?.length ?? schedule.register_count ?? 0;
    const quota =
      typeof schedule.quota === 'number' ? Number(schedule.quota) : undefined;
    const isFull =
      schedule.is_full ?? (quota ? registrants >= Number(quota) : false);
    const statusLabel = schedule.status || (isFull ? 'Penuh' : 'Tersedia');
    const serviceName =
      schedule.service_name || schedule.service?.name || 'Tidak diketahui';

    switch (columnKey) {
      case 'schedule_date':
        return (
          <div className="flex flex-col">
            <p className="text-text font-semibold">
              {formatDate(schedule.schedule_date)}
            </p>
            <p className="text-2xsmall text-text-muted leading-3">
              {moment(schedule.schedule_date).format('dddd')}
            </p>
          </div>
        );
      case 'service':
        return (
          <div className="flex justify-center-safe">
            <Chip
              size="sm"
              startContent={<LuCalendar />}
              className="bg-primary/10 text-primary border-primary/30 border px-2"
              classNames={{
                content: '!text-2xsmall',
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
            <span className="text-2xsmall text-text-muted font-semibold">
              {ratioLabel}
            </span>
          </div>
        );
      }
      case 'status':
        return (
          <div className="flex justify-center-safe">
            <Chip
              size="sm"
              variant="flat"
              color={isFull ? 'danger' : 'success'}
              classNames={{
                content: '!text-2xsmall',
                base: 'px-2 border',
              }}
            >
              {statusLabel}
            </Chip>
          </div>
        );
      case 'actions':
        return (
          <div className="flex justify-center-safe">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly variant="light">
                  <BiDotsVerticalRounded size={18} className="text-primary" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Aksi jadwal">
                <DropdownItem
                  key="view-participants"
                  startContent={<LuUsers size={16} />}
                  onPress={() => onViewParticipants(schedule)}
                >
                  Daftar Peserta
                </DropdownItem>
                <DropdownItem
                  key="edit-schedule"
                  startContent={<LuPenLine size={16} />}
                  onPress={() => onEdit(schedule)}
                >
                  Ubah
                </DropdownItem>
                <DropdownItem
                  key="delete-schedule"
                  className="text-danger"
                  startContent={<LuTrash2 size={16} />}
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

  const topContent = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 lg:flex-1 lg:flex-row">
          <Select
            selectedKeys={new Set([monthSelectionValue])}
            onSelectionChange={handleMonthSelection}
            variant="bordered"
            labelPlacement="outside"
            placeholder="Filter bulan"
            disallowEmptySelection
            items={monthOptions}
            startContent={<LuFilter className="text-text-muted" />}
            className="w-full lg:w-40"
            classNames={{
              trigger: 'bg-bg-light',
              value: 'text-small font-semibold',
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
            startContent={<LuFilter className="text-text-muted" />}
            className="w-full lg:w-44"
            classNames={{
              trigger: 'bg-bg-light',
              value: 'text-small font-semibold',
            }}
          >
            {(option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            )}
          </Select>
        </div>
        <div className="flex items-center gap-3">
          {isRefetching && <Spinner size="sm" color="secondary" />}
          <Button
            className="bg-primary text-bg-light font-semibold shadow-sm"
            startContent={<BiPlus size={18} />}
            onPress={onAdd}
          >
            Tambah Jadwal
          </Button>
        </div>
      </div>
    </div>
  );

  const bottomContent = (
    <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="text-xsmall text-text-muted bg-bg-light flex items-center gap-2 rounded-lg px-4 py-2 font-semibold shadow">
        <span>Tampilkan</span>
        <Select
          selectedKeys={new Set([String(currentLimit)])}
          onSelectionChange={handleLimitSelection}
          className="w-14"
          disallowEmptySelection
          classNames={{
            trigger: 'h-5 min-h-5 rounded-md border border-border',
            value: 'text-xsmall',
            popoverContent: 'min-w-22',
          }}
        >
          {LIMIT_LISTS.map((option) => (
            <SelectItem key={String(option.value)}>{option.label}</SelectItem>
          ))}
        </Select>
        <span>baris</span>
      </div>
      <div className="bg-bg-light flex w-full justify-end rounded-lg px-4 py-1 shadow lg:w-auto">
        {totalPages > 1 && (
          <Pagination
            isCompact
            showControls
            variant="light"
            page={currentPage}
            total={totalPages}
            onChange={onChangePage}
            classNames={{
              wrapper: 'min-h-8 h-8',
              prev: 'h-7',
              next: 'h-7',
              cursor:
                'h-7 min-w-7 w-7 bg-bg border border-border text-text rounded-lg',
            }}
          />
        )}
      </div>
    </div>
  );

  return (
    <section>
      <Table
        aria-label="Tabel jadwal"
        classNames={{ base: 'min-w-full', wrapper: 'rounded-lg shadow' }}
        topContent={topContent}
        topContentPlacement="outside"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} className={column.className}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          className="align-top"
          items={schedules}
          emptyContent="Belum ada jadwal"
          isLoading={isLoading}
          loadingContent={<Spinner color="secondary" />}
        >
          {(item) => (
            <TableRow
              key={item._id}
              className="border-border border-b last:border-0"
            >
              {columns.map((column) => (
                <TableCell className="text-xsmall" key={column.key}>
                  {renderCell(item, column.key)}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
};

export default ScheduleTable;
