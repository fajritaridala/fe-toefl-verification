'use client';

import { useCallback } from 'react';
import { type EnrollmentItem } from '@features/admin';
import {
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
} from '@heroui/react';
import { Check, Eye, RefreshCw, Search, X } from 'lucide-react';
import {
  ParticipantDetailModal,
  QuickPreviewModal,
} from '@/components/ui/Modal';
import { LIMIT_LISTS } from '@/constants/list.constants';
import { formatDate } from '@/lib/utils';
import { useValidation } from './useValidation';

export default function Validation() {
  const {
    previewModalOpen,
    detailModalOpen,
    searchInput,
    participants,
    currentParticipant,
    totalPages,
    currentLimit,
    currentPage,
    isLoadingEnrollments,
    isRefetchingEnrollments,
    isProcessing,
    setSearchInput,
    handleOpenPreview,
    handleRefresh,
    handleClosePreview,
    handleCloseDetail,
    handleChangeLimit,
    handleChangePage,
    handleClearSearch,
    approveParticipant,
    rejectParticipant,
  } = useValidation();
  
  console.log(participants)

  const columns = [
    { key: 'fullName', name: 'Nama Lengkap', uid: 'fullName' },
    { key: 'nim', name: 'NIM', uid: 'nim' },
    { key: 'serviceName', name: 'Layanan', uid: 'serviceName' },
    { key: 'scheduleDate', name: 'Jadwal', uid: 'scheduleDate' },
    { key: 'paymentProof', name: 'Bukti Bayar', uid: 'paymentProof' },
    { key: 'actions', name: 'Actions', uid: 'actions' },
  ];

  const renderCell = useCallback(
    (participant: EnrollmentItem, columnKey: string, rowIndex: number) => {
      switch (columnKey) {
        case 'fullName':
          return (
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-gray-900">
                {participant.fullName}
              </p>
              <p className="text-xs text-gray-500">
                {participant.email || '-'}
              </p>
            </div>
          );

        case 'nim':
          return (
            <p className="text-center text-sm font-medium text-gray-700">
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

        case 'paymentProof':
          return (
            <div className="flex justify-center-safe">
              <button
                onClick={() => handleOpenPreview(rowIndex)}
                className="border-info text-info inline-flex items-center gap-1.5 rounded-full border bg-transparent px-3 py-1.5 text-xs font-medium transition-all hover:shadow"
              >
                <Eye className="h-3.5 w-3.5" />
                Lihat Bukti
              </button>
            </div>
          );

        case 'actions':
          return (
            <div className="flex w-full items-center justify-center-safe gap-2">
              <button
                onClick={() => approveParticipant(participant._id)}
                disabled={isProcessing}
                title="Approve"
                className="border-success text-success inline-flex items-center gap-1.5 rounded-full border bg-transparent px-3 py-1.5 text-xs font-medium transition-all hover:shadow disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check className="h-3.5 w-3.5" />
                Approve
              </button>
              <button
                onClick={() => rejectParticipant(participant._id)}
                disabled={isProcessing}
                title="Reject"
                className="border-danger text-danger inline-flex items-center gap-1.5 rounded-full border bg-transparent px-3 py-1.5 text-xs font-medium transition-all hover:shadow disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" />
                Reject
              </button>
            </div>
          );

        default:
          return null;
      }
    },
    [isProcessing, handleOpenPreview, approveParticipant, rejectParticipant]
  );

  return (
    <section className="space-y-4">
      {/* Table Card */}
      <div className="bg-white rounded-xl drop-shadow">
        {/* Filters */}
        <div className="bg-transparent px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <Input
              isClearable
              type="search"
              placeholder="Cari nama atau NIM peserta..."
              startContent={<Search className="h-4 w-4 text-gray-400" />}
              value={searchInput}
              onClear={() => {
                setSearchInput('');
                handleClearSearch();
              }}
              onValueChange={setSearchInput}
              classNames={{
                base: 'w-full max-w-md',
                inputWrapper: 'h-8 bg-bg drop-shadow',
                input: 'text-sm',
              }}
            />

            <div className="flex w-full justify-end-safe gap-3">
              <div className="flex items-center gap-2">
                <Select
                  startContent={
                    <p className="text-small text-text-muted">Tampilkan</p>
                  }
                  disallowEmptySelection
                  aria-label="Items per page"
                  selectedKeys={new Set([String(currentLimit)])}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0];
                    handleChangeLimit(value as string);
                  }}
                  classNames={{
                    base: 'w-36 ',
                    trigger: 'h-8 bg-white drop-shadow',
                    value: 'text-small text-center',
                    listbox: 'w-34',
                    popoverContent: 'w-36',
                  }}
                >
                  {LIMIT_LISTS.map((limit) => (
                    <SelectItem key={limit.value}>{limit.label}</SelectItem>
                  ))}
                </Select>
              </div>

              <button
                onClick={handleRefresh}
                disabled={isRefetchingEnrollments}
                className="bg-primary hover:bg-primary/10 group text-small inline-flex h-10 w-26 items-center justify-center gap-2 rounded-xl px-2 font-semibold text-white drop-shadow transition-all delay-75 duration-300 disabled:cursor-not-allowed disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw
                  className={`group-hover:text-primary h-4 w-4 text-white ${isRefetchingEnrollments ? 'animate-spin' : ''}`}
                />
                <p className="group-hover:text-primary">Refresh</p>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-b-xl">
          <Table
            aria-label="Validation table"
            removeWrapper
            classNames={{
              th: 'bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wide px-6 py-4 border-b text-center border-gray-200',
              td: 'px-6 py-4 text-sm text-gray-900 border-b border-gray-100',
              tr: 'hover:bg-gray-50/50 transition-colors',
              base: 'min-w-full',
            }}
          >
            <TableHeader columns={columns}>
              {(col) => <TableColumn key={col.uid}>{col.name}</TableColumn>}
            </TableHeader>
            <TableBody
              items={participants || []}
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
                    Tidak ada peserta menunggu validasi
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Semua peserta sudah diproses
                  </p>
                </div>
              }
            >
              {(item) => (
                <TableRow key={item.__rowKey || item._id}>
                  {columns.map((col) => (
                    <TableCell key={col.uid}>
                      {renderCell(item, col.key, participants.indexOf(item))}
                    </TableCell>
                  ))}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer - Only show if more than 1 page */}
        {!isLoadingEnrollments && totalPages > 1 && (
          <div className="rounded-b-xl bg-gray-50 px-6 py-3">
            <div className="flex items-center justify-end-safe">
              <Pagination
                showShadow
                showControls
                page={Number(currentPage)}
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

      {/* Quick Preview Modal */}
      <QuickPreviewModal
        isOpen={previewModalOpen}
        onClose={handleClosePreview}
        participant={currentParticipant}
        onApprove={(id) => approveParticipant(id)}
        onReject={(id) => rejectParticipant(id)}
        isProcessing={isProcessing}
      />

      {/* Detail Modal */}
      <ParticipantDetailModal
        isOpen={detailModalOpen}
        onClose={handleCloseDetail}
        participant={currentParticipant}
      />
    </section>
  );
}
