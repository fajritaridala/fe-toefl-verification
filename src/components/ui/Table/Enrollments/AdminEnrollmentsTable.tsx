"use client";

import { Key, ReactNode } from 'react';
import {
  Chip,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import type { AdminEnrollmentsTableProps, EnrollmentRow } from './EnrollmentsTable.types';
import EnrollmentsTableFilters from './EnrollmentsTableFilters';
import EnrollmentRowActions from './EnrollmentRowActions';

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
          <EnrollmentRowActions
            row={participant}
            onApprove={onApprove}
            onReject={onReject}
            onScore={onScore}
          />
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
          <EnrollmentsTableFilters
            currentSearch={currentSearch}
            statusFilter={statusFilter}
            statusOptions={statusOptions}
            showStatusFilter={showStatusFilter}
            currentLimitValue={currentLimitValue}
            onSearch={onSearch}
            onClearSearch={onClearSearch}
            onChangeStatus={onChangeStatus}
            onChangeLimit={onChangeLimit}
          />
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
