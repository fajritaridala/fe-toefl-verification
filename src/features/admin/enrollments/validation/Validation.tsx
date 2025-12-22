import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { LimitFilter } from '@/components/ui/Button/Filter/LimitFilter';
import { RefreshButton } from '@/components/ui/Button/RefreshButton';
import EnrollmentDetailModal from '@/components/ui/Modal/EnrollmentDetailModal';
import GenericEnrollmentTable from '@/components/ui/Table/Enrollments/GenericEnrollmentTable';
import { useValidation } from './useValidation';
import { fadeInUp, getValidationColumns } from './ValidationConstant';

export default function Validation() {
  const {
    // --- State Data & UI ---
    previewModalOpen,
    detailModalOpen,
    participants,
    currentParticipant,
    isProcessing,

    // --- Pagination & Pencarian ---
    searchInput,
    totalPages,
    currentLimit,
    currentPage,
    isLoadingEnrollments,
    isRefetchingEnrollments,

    // --- Handler (Fungsi Aksi) ---
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

  // Membuat konfigurasi kolom menggunakan fungsi helper dari constant.
  // Menggunakan useMemo memastikan kolom tidak dibuat ulang (re-created)
  // pada setiap render, kecuali jika dependensinya (participants, isProcessing, dll) berubah.
  const columns = useMemo(
    () =>
      getValidationColumns({
        participants,
        isProcessing,
        onOpenPreview: handleOpenPreview,
        onApprove: approveParticipant,
        onReject: rejectParticipant,
      }),
    [
      participants,
      isProcessing,
      handleOpenPreview,
      approveParticipant,
      rejectParticipant,
    ]
  );

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
          onClear: handleClearSearch,
        }}
        filterContent={
          <>
            <LimitFilter
              value={String(currentLimit)}
              onChange={handleChangeLimit}
            />
            <RefreshButton
              isRefetching={isRefetchingEnrollments}
              onRefresh={handleRefresh}
            />
          </>
        }
        pagination={{
          page: Number(currentPage),
          total: totalPages,
          onChange: handleChangePage,
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

      {/* Modal Detail & Aksi Validasi */}
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
