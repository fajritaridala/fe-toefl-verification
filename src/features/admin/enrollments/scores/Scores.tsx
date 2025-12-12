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
import { PenSquare, RefreshCw, Search } from 'lucide-react';
import { ScoreInputModal } from '@/components/ui/Modal';
import { LIMIT_LISTS } from '@/constants/list.constants';
import { formatDate } from '@/lib/utils';
import { useScores } from './useScores';

export default function Scores() {
  const {
    selectedParticipant,
    scoreModalOpen,
    searchInput,
    participants,
    totalPages,
    currentLimit,
    currentPage,
    isLoadingEnrollments,
    isRefetchingEnrollments,
    isSubmittingScore,
    blockchainStatus,
    statusMessage,
    setSearchInput,
    handleOpenScoreModal,
    handleSubmitScore,
    handleRefresh,
    handleCloseModal,
    handleChangeLimit,
    handleChangePage,
    handleClearSearch,
  } = useScores();

  const columns = [
    { key: 'fullName', name: 'Nama Lengkap', uid: 'fullName' },
    { key: 'nim', name: 'NIM', uid: 'nim' },
    { key: 'serviceName', name: 'Layanan', uid: 'serviceName' },
    { key: 'scheduleDate', name: 'Jadwal', uid: 'scheduleDate' },
    { key: 'status', name: 'Status', uid: 'status' },
    { key: 'actions', name: 'Actions', uid: 'actions' },
  ];

  const renderCell = useCallback(
    (participant: EnrollmentItem, columnKey: string) => {
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

        case 'status':
          console.log(participant.status);
          // Check if participant has score based on status or score fields
          const hasScore =
            participant.status === 'selesai' ||
            (participant.listening !== undefined &&
              participant.structure !== undefined &&
              participant.reading !== undefined);

          return (
            <div className="text-center">
              {hasScore ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                  {participant.status}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-600"></span>
                  {participant.status}
                </span>
              )}
            </div>
          );

        case 'actions':
          return (
            <div className="text-center">
              <button
                onClick={() => handleOpenScoreModal(participant)}
                className="hover:shadow-box inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-all hover:bg-blue-100"
              >
                <PenSquare className="h-3.5 w-3.5" />
                Input Nilai
              </button>
            </div>
          );

        default:
          return null;
      }
    },
    [handleOpenScoreModal]
  );

  return (
    <section className="space-y-4">
      {/* Table Card */}
      <div className="bg-white shadow-box rounded-2xl border border-gray-200">
        {/* Filters */}
        <div className="bg-transparent px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <Input
              isClearable
              type="search"
              radius="full"
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
                inputWrapper: 'h-8 bg-gray-50 drop-shadow',
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
                  radius="full"
                  aria-label="Items per page"
                  selectedKeys={new Set([String(currentLimit)])}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0];
                    handleChangeLimit(value as string);
                  }}
                  classNames={{
                    base: 'w-36',
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
                className="bg-primary hover:bg-primary/10 group text-small inline-flex h-10 w-26 items-center justify-center gap-2 rounded-full px-2 font-semibold text-white drop-shadow transition-all delay-75 duration-300 disabled:cursor-not-allowed disabled:opacity-50"
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
        <div className="overflow-x-auto rounded-b-2xl">
          <Table
            aria-label="Scores table"
            removeWrapper
            classNames={{
              th: 'bg-bg-light text-gray-600 font-semibold text-xs uppercase px-6 py-4 border-b border-gray-200',
              td: 'px-6 py-4 text-sm text-gray-900 border-b border-gray-100',
              tr: 'hover:bg-gray-50 transition-colors',
              base: 'min-w-full',
            }}
          >
            <TableHeader columns={columns}>
              {(col) => (
                <TableColumn
                  key={col.uid}
                  className={
                    col.key === 'fullName' ? 'text-left' : 'text-center'
                  }
                >
                  {col.name}
                </TableColumn>
              )}
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
                    Tidak ada peserta yang disetujui
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Belum ada peserta untuk input nilai
                  </p>
                </div>
              }
            >
              {(item) => (
                <TableRow key={item.__rowKey || item.enrollId}>
                  {columns.map((col) => (
                    <TableCell key={col.uid}>
                      {renderCell(item, col.key)}
                    </TableCell>
                  ))}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer - Only show if more than 1 page */}
        {!isLoadingEnrollments && totalPages > 1 && (
          <div className="rounded-b-2xl bg-gray-50 px-6 py-3">
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

      {/* Score Input Modal */}
      <ScoreInputModal
        isOpen={scoreModalOpen}
        onClose={handleCloseModal}
        participant={selectedParticipant}
        onSubmit={handleSubmitScore}
        isSubmitting={isSubmittingScore}
        blockchainStatus={blockchainStatus}
        statusMessage={statusMessage}
      />
    </section>
  );
}
