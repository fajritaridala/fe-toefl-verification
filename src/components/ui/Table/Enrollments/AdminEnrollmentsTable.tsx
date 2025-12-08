"use client";

import { Key, ReactNode } from 'react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { CiSearch } from 'react-icons/ci';
import { LuCheck, LuFilter, LuListChecks, LuX } from 'react-icons/lu';
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
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
  type Selection,
} from '@heroui/react';
import { LIMIT_LISTS } from '@/constants/list.constants';

type StatusOption = { label: string; value: string };

export type EnrollmentRow = {
  __rowKey: string;
  _id: string;
  participantId?: string;
  fullName: string;
  email?: string;
  nim?: string;
  scheduleId?: string;
  scheduleName?: string;
  scheduleDate?: string;
  status: 'menunggu' | 'disetujui' | 'ditolak';
};

type AdminEnrollmentsTableProps = {
  columns: Array<{ key: string; name: string }>;
  items: EnrollmentRow[];
  isLoading: boolean;
  isRefetching: boolean;
  currentSearch: string;
  statusFilter: string;
  statusOptions: StatusOption[];
  showStatusFilter: boolean;
  currentLimitValue: string;
  currentPageNumber: number;
  totalPages: number;
  totalItems: number;
  onSearch: (value: string) => void;
  onClearSearch: () => void;
  onChangeStatus: (value: string) => void;
  onChangeLimit: (value: string) => void;
  onChangePage: (page: number) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onScore: (row: EnrollmentRow) => void;
};

const AdminEnrollmentsTable = (props: AdminEnrollmentsTableProps) => {
  const {
    columns,
    items,
    isLoading,
    isRefetching,
    currentSearch,
    statusFilter,
    statusOptions,
    showStatusFilter,
    currentLimitValue,
    currentPageNumber,
    totalPages,
    totalItems,
    onSearch,
    onClearSearch,
    onChangeStatus,
    onChangeLimit,
    onChangePage,
    onApprove,
    onReject,
    onScore,
  } = props;

  const renderStatusChip = (status: EnrollmentRow['status']) => {
    const color =
      status === 'disetujui'
        ? 'success'
        : status === 'ditolak'
          ? 'danger'
          : 'warning';
    return (
      <Chip size="sm" variant="flat" color={color} className="font-semibold capitalize">
        {status}
      </Chip>
    );
  };

  const renderCell = (participant: EnrollmentRow, columnKey: Key): ReactNode => {
    switch (columnKey) {
      case 'fullName':
        return (
          <div className="flex flex-col">
            <p className="font-semibold">{participant.fullName}</p>
            <p className="text-default-500 text-xs">{participant.email}</p>
          </div>
        );
      case 'nim':
        return <p className="text-sm">{participant.nim}</p>;
      case 'scheduleId':
        return (
          <div className="flex flex-col">
            <p className="text-sm font-semibold">{participant.scheduleName || '-'}</p>
            <p className="text-default-500 text-xs">{participant.scheduleDate || '-'}</p>
          </div>
        );
      case 'status':
        return renderStatusChip(participant.status);
      case 'actions':
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button variant="light" className="text-default-500 data-[hover=true]:text-primary px-2" isIconOnly>
                <BiDotsVerticalRounded size={18} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Aksi peserta">
              <DropdownItem
                key="approve"
                startContent={<LuCheck className="text-success" />}
                onPress={() => onApprove(participant._id)}
              >
                Setujui
              </DropdownItem>
              <DropdownItem
                key="reject"
                startContent={<LuX className="text-danger" />}
                onPress={() => onReject(participant._id)}
              >
                Tolak
              </DropdownItem>
              <DropdownItem
                key="score"
                startContent={<LuListChecks className="text-warning" />}
                onPress={() => onScore(participant)}
              >
                Input Nilai
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return null;
    }
  };

  return (
    <section className="space-y-4">
      <Table
        aria-label="Daftar peserta"
        selectionMode="none"
        topContentPlacement="outside"
        topContent={
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <Input
                  isClearable
                  radius="sm"
                  size="sm"
                  variant="bordered"
                  placeholder="Cari peserta"
                  startContent={<CiSearch />}
                  className="w-full lg:w-80"
                  onChange={(e) => onSearch(e.target.value)}
                  onClear={onClearSearch}
                  value={currentSearch}
                />
                {showStatusFilter && (
                  <Select
                    aria-label="filter-status"
                    size="sm"
                    radius="sm"
                    selectedKeys={[statusFilter] as Selection}
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0] as string;
                      onChangeStatus(value);
                    }}
                    className="min-w-[180px]"
                    selectorIcon={<LuFilter />}
                  >
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              </div>
              <div className="text-default-500 flex items-center gap-2 text-sm">
                <span>Limit</span>
                <Select
                  aria-label="limit"
                  size="sm"
                  selectedKeys={[currentLimitValue] as Selection}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    onChangeLimit(value);
                  }}
                  className="w-24"
                >
                  {LIMIT_LISTS.map((limit) => (
                    <SelectItem key={limit.value} value={limit.value}>
                      {limit.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        }
        bottomContentPlacement="outside"
        bottomContent={
          <div className="flex flex-col gap-2">
            {isRefetching && <p className="text-default-500 text-xs">Menyegarkan data...</p>}
            <div className="flex w-full items-center justify-between">
              <span className="text-default-500 text-xs">
                Menampilkan {items.length} dari {totalItems} peserta
              </span>
              <Pagination
                isCompact
                showControls
                color="primary"
                page={currentPageNumber}
                total={totalPages}
                onChange={onChangePage}
              />
            </div>
          </div>
        }
        classNames={{
          wrapper: 'border border-border/60',
          th: 'bg-bg-dark text-default-700 uppercase text-xs',
        }}
        isStriped
      >
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.name}</TableColumn>}
        </TableHeader>
        <TableBody
          items={items}
          isLoading={isLoading}
          loadingContent={<Spinner label="Memuat peserta" />}
          emptyContent={
            <div className="text-default-500 text-center">
              <p className="font-semibold">Tidak ada data peserta</p>
              <p className="text-xs">Coba ubah filter atau lakukan pencarian.</p>
            </div>
          }
        >
          {(item) => (
            <TableRow key={item.__rowKey}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
};

export default AdminEnrollmentsTable;
