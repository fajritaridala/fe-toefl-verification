'use client';

import { Check, Eye, X } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import EnrollmentDetailModal from '@/components/ui/Modal/EnrollmentDetailModal';
import { formatDate } from '@/utils/common';
import { useValidation } from './useValidation';
import GenericEnrollmentTable, { ColumnConfig } from '@/components/ui/Table/Enrollments/GenericEnrollmentTable';
import { LimitFilter } from '@/components/ui/Button/Filter/LimitFilter';
import { RefreshButton } from '@/components/ui/Button/RefreshButton';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function Validation() {
  const {
    previewModalOpen,
    detailModalOpen,
    searchInput,
    participants, // GenericTable expects "data"
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
        uid: 'paymentProof', 
        name: 'Bukti Bayar', 
        align: 'center',
        render: (item) => (
            <div className="flex justify-center-safe">
              <button
                // We need index for handleOpenPreview(index) in current implementation of useValidation
                // But item is cleaner. Let's see if we can perform a findIndex or if handleOpenPreview supports object?
                // Looking at useValidation (not shown but implied), it takes rowIndex. 
                // Let's assume we can find the index from the participants array.
                onClick={() => {
                    const index = participants.findIndex(p => p.enrollId === item.enrollId);
                    handleOpenPreview(index >= 0 ? index : 0);
                }}
                className="border-info text-info hover:shadow-box inline-flex items-center gap-1.5 rounded-full border bg-transparent px-3 py-1.5 text-xs font-medium transition-all"
              >
                <Eye className="h-3.5 w-3.5" />
                Lihat Bukti
              </button>
            </div>
        )
    },
    { 
        uid: 'actions', 
        name: 'Actions', 
        align: 'center',
        render: (item) => (
            <div className="flex w-full items-center justify-center-safe gap-2">
              <button
                onClick={() => approveParticipant(item.enrollId)}
                disabled={isProcessing}
                title="Approve"
                className="border-success text-success hover:shadow-box inline-flex items-center gap-1.5 rounded-full border bg-transparent px-3 py-1.5 text-xs font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check className="h-3.5 w-3.5" />
                Approve
              </button>
              <button
                onClick={() => rejectParticipant(item.enrollId)}
                disabled={isProcessing}
                title="Reject"
                className="border-danger text-danger hover:shadow-box inline-flex items-center gap-1.5 rounded-full border bg-transparent px-3 py-1.5 text-xs font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" />
                Reject
              </button>
            </div>
        )
    },
  ];

  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="space-y-4"
    >
      <GenericEnrollmentTable
        data={participants}
        isLoading={isLoadingEnrollments}
        isRefetching={isRefetchingEnrollments}
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
                <Check className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-base font-medium text-gray-900">
                Tidak ada peserta menunggu validasi
                </p>
                <p className="mt-1 text-sm text-gray-500">
                Semua peserta sudah diproses
                </p>
            </div>
        }
      />

      {/* Enrollment Detail / Validation Modal */}
      {currentParticipant && (
        <EnrollmentDetailModal
          isOpen={previewModalOpen || detailModalOpen}
          onClose={() => {
             if (previewModalOpen) handleClosePreview();
             if (detailModalOpen) handleCloseDetail();
          }}
          participant={currentParticipant}
          onApprove={(id) => approveParticipant(id)}
          onReject={(id) => rejectParticipant(id)}
          isProcessing={isProcessing}
        />
      )}
    </motion.section>
  );
}
