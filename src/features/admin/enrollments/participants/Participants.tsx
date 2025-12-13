'use client';

import { Key, ReactNode } from 'react';
import {
  Button,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Eye } from 'lucide-react';
import { ParticipantDetailModal } from '@/components/ui/Modal';
import EnrollmentsTableFilters from '@/components/ui/Table/Enrollments/EnrollmentsTableFilters';
import { formatDate } from '@/lib/utils';
import ColumnListEnrollments from '../shared/columns';
import { useParticipants } from './useParticipants';

export default function Participants() {
  const {
    tableItems,
    statusFilter,
    statusOptions,
    currentSearch,
    currentLimitValue,
    currentPageNumber,
    totalPages,
    isLoadingEnrollments,
    isRefetchingEnrollments,
    detailModalOpen,
    selectedParticipant,
    handleSearch,
    handleClearSearch,
    handleStatusChange,
    handleChangeLimit,
    handleChangePage,
    handleOpenDetail,
    handleCloseDetail,
  } = useParticipants();

  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['enrollments'] });
  };

  const renderStatusChip = (
    status: 'menunggu' | 'disetujui' | 'ditolak' | 'selesai'
  ) => {
    const config: Record<
      'menunggu' | 'disetujui' | 'ditolak' | 'selesai',
      {
        bgColor: string;
        borderColor: string;
        textColor: string;
        dotColor: string;
        label: string;
      }
    > = {
      disetujui: {
        bgColor: 'bg-transparent',
        borderColor: 'border-green-600',
        textColor: 'text-green-700',
        dotColor: 'bg-green-600',
        label: 'Disetujui',
      },
      ditolak: {
        bgColor: 'bg-transparent',
        borderColor: 'border-red-600',
        textColor: 'text-red-700',
        dotColor: 'bg-red-600',
        label: 'Ditolak',
      },
      menunggu: {
        bgColor: 'bg-transparent',
        borderColor: 'border-yellow-600',
        textColor: 'text-yellow-700',
        dotColor: 'bg-yellow-600',
        label: 'Menunggu',
      },
      selesai: {
        bgColor: 'bg-transparent',
        borderColor: 'border-green-600',
        textColor: 'text-green-700',
        dotColor: 'bg-green-600',
        label: 'Selesai',
      },
    };

    const { bgColor, borderColor, textColor, dotColor, label } = config[status];

    return (
      <div className="text-center">
        <span
          className={`inline-flex items-center gap-2 rounded-full border-[1.5px] px-3 py-1.5 ${bgColor} ${borderColor} ${textColor} text-sm font-medium`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`}></span>
          {label}
        </span>
      </div>
    );
  };

  const renderCell = (
    participant: (typeof tableItems)[0],
    columnKey: Key
  ): ReactNode => {
    switch (columnKey) {
      case 'fullName':
        return (
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-gray-900">
              {participant.fullName}
            </p>
            <p className="text-xs text-gray-500">{participant.email}</p>
          </div>
        );
      case 'nim':
        return (
          <p className="text-center font-medium text-gray-700">
            {participant.nim}
          </p>
        );
      case 'serviceName':
        return (
          <p className="text-center font-medium text-gray-700">
            {participant.serviceName || '-'}
          </p>
        );
      case 'scheduleDate':
        return (
          <p className="text-center text-sm text-gray-700">
            {formatDate(participant.scheduleDate)}
          </p>
        );
      case 'status':
        return renderStatusChip(participant.status);
      case 'actions':
        return (
          <div className="text-center">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              radius="full"
              aria-label="Lihat detail"
              className="hover:text-primary text-gray-600"
              onPress={() => handleOpenDetail(participant)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const columns = ColumnListEnrollments.map((c) => ({
    key: c.key || c.uid,
    name: c.name,
  }));

  return (
    <section className="space-y-4">
      {/* Table Card */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100">
        {/* Filters Section */}
        <div className="bg-transparent px-6 py-4">
          <EnrollmentsTableFilters
            currentSearch={currentSearch}
            statusFilter={statusFilter}
            statusOptions={statusOptions}
            showStatusFilter={true}
            currentLimitValue={currentLimitValue}
            isRefetching={isRefetchingEnrollments}
            onSearch={handleSearch}
            onClearSearch={handleClearSearch}
            onChangeStatus={handleStatusChange}
            onChangeLimit={handleChangeLimit}
            onRefresh={handleRefresh}
          />
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-b-xl">
          <Table
            aria-label="Tabel peserta"
            selectionMode="none"
            removeWrapper
            classNames={{
              th: 'bg-gray-50 text-gray-600 font-semibold text-xs uppercase  px-6 py-4 border-b border-gray-200',
              td: 'px-6 py-4 text-sm text-gray-900 border-b border-gray-100',
              tr: 'hover:bg-gray-50 transition-colors',
              base: 'min-w-full',
            }}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.key}
                  className={
                    column.key === 'fullName' ? 'text-left' : 'text-center'
                  }
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={tableItems}
              isLoading={isLoadingEnrollments}
              loadingContent={
                <div className="flex flex-col items-center justify-center py-12">
                  <Spinner size="lg" color="primary" />
                  <p className="mt-3 text-sm text-gray-500">
                    Memuat data peserta...
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
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-base font-medium text-gray-900">
                    Tidak ada data peserta
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Coba ubah filter atau lakukan pencarian lain
                  </p>
                </div>
              }
            >
              {(item) => (
                <TableRow key={item.__rowKey}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer - Only show if more than 1 page */}
        {!isLoadingEnrollments && totalPages > 1 && (
          <div className="rounded-b-xl bg-gray-50 px-6 py-3 border-t border-gray-100">
            <div className="flex items-center justify-end-safe">
              <Pagination
                showShadow
                showControls
                page={currentPageNumber}
                total={totalPages}
                onChange={handleChangePage}
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

      {/* Detail Modal */}
      {selectedParticipant && (
        <ParticipantDetailModal
          isOpen={detailModalOpen}
          onClose={handleCloseDetail}
          participant={selectedParticipant}
        />
      )}
    </section>
  );
}
