'use client';

import { PenSquare } from 'lucide-react';
import { ScoreInputModal } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';
import { useScores } from './useScores';
import GenericEnrollmentTable, { ColumnConfig } from '@/components/ui/Table/Enrollments/GenericEnrollmentTable';
import { LimitFilter } from '@/components/ui/Button/Filter/LimitFilter';
import { RefreshButton } from '@/components/ui/Button/RefreshButton';

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

  const columns: ColumnConfig[] = [
    { uid: 'fullName', name: 'Nama Lengkap', align: 'start' },
    { uid: 'nim', name: 'NIM', align: 'center' },
    { uid: 'serviceName', name: 'Layanan', align: 'center' },
    { 
        uid: 'scheduleDate', 
        name: 'Jadwal', 
        align: 'center',
        render: (item) => <p className="text-center text-sm text-gray-700">{formatDate(item.scheduleDate)}</p>
    },
    { 
        uid: 'status', 
        name: 'Status', 
        align: 'center',
        render: (item) => {
             // Check if participant has score based on status or score fields
             // Reusing logic from original file
             // TODO: Enum 'selesai'
             const hasScore =
             item.status === 'selesai' ||
             (item.listening !== undefined &&
                item.structure !== undefined &&
                item.reading !== undefined);
 
           return (
             <div className="text-center">
               {hasScore ? (
                 <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
                   <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                   {item.status}
                 </span>
               ) : (
                 <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700">
                   <span className="h-1.5 w-1.5 rounded-full bg-gray-600"></span>
                   {item.status}
                 </span>
               )}
             </div>
           );
        }
    },
    { 
        uid: 'actions', 
        name: 'Actions', 
        align: 'center',
        render: (item) => (
            <div className="text-center">
              <button
                onClick={() => handleOpenScoreModal(item)}
                className="hover:shadow-box inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-all hover:bg-blue-100"
              >
                <PenSquare className="h-3.5 w-3.5" />
                Input Nilai
              </button>
            </div>
        )
    },
  ];

  return (
    <section className="space-y-4">
      <GenericEnrollmentTable
        data={participants}
        isLoading={isLoadingEnrollments}
        columns={columns}
        search={{
            value: searchInput,
            onChange: setSearchInput,
            onClear: handleClearSearch
        }}
        filterContent={
            <>
                <LimitFilter value={String(currentLimit)} onChange={handleChangeLimit} />
                <RefreshButton isRefetching={isRefetchingEnrollments} onRefresh={handleRefresh} />
            </>
        }
        pagination={{
            page: Number(currentPage),
            total: totalPages,
            onChange: handleChangePage
        }}
        emptyContent={
            <div className="flex flex-col items-center justify-center py-12">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <PenSquare className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-base font-medium text-gray-900">
                    Tidak ada peserta yang disetujui
                </p>
                <p className="mt-1 text-sm text-gray-500">
                    Belum ada peserta untuk input nilai
                </p>
            </div>
        }
      />

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
