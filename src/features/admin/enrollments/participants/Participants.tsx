import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { LimitFilter } from '@/components/ui/Button/Filter/LimitFilter';
import { ServiceFilter } from '@/components/ui/Button/Filter/ServiceFilter';
import { StatusFilter } from '@/components/ui/Button/Filter/StatusFilter';
import { RefreshButton } from '@/components/ui/Button/RefreshButton';
import EnrollmentDetailModal from '@/components/ui/Modal/EnrollmentDetailModal';
import GenericEnrollmentTable from '@/components/ui/Table/Enrollments/GenericEnrollmentTable';
import { EnrollmentItem } from '../enrollment.types';
import { fadeInUp, getParticipantColumns } from './ParticipantConstant';
import { useParticipants } from './useParticipants';

export default function Participants() {
  const {
    // --- Data & Filter State ---
    tableItems,
    statusFilter,
    statusOptions,
    currentServiceId,
    serviceOptions,
    currentLimitValue,

    // --- Pagination & Search ---
    currentPageNumber,
    totalPages,
    searchInput,
    setSearchInput,

    // --- Loading & Modal State ---
    isLoadingEnrollments,
    isRefetchingEnrollments,
    detailModalOpen,
    selectedParticipant,

    // --- Handlers ---
    handleClearSearch,
    handleStatusChange,
    handleChangeLimit,
    handleChangePage,
    handleOpenDetail,
    handleCloseDetail,
    handleChangeService,
  } = useParticipants();

  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['enrollments'] });
  };

  // Membuat konfigurasi kolom dengan useMemo agar efisien
  // Kolom hanya dibuat ulang jika fungsi handleOpenDetail berubah
  const columns = useMemo(
    () => getParticipantColumns({ onOpenDetail: handleOpenDetail }),
    [handleOpenDetail]
  );

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="space-y-4"
    >
      <GenericEnrollmentTable
        data={tableItems as EnrollmentItem[]}
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
            <ServiceFilter
              value={currentServiceId}
              onChange={handleChangeService}
              options={serviceOptions}
            />
            <StatusFilter
              value={statusFilter}
              onChange={handleStatusChange}
              options={statusOptions}
            />
            <LimitFilter
              value={currentLimitValue}
              onChange={handleChangeLimit}
            />
            <RefreshButton
              isRefetching={isRefetchingEnrollments}
              onRefresh={handleRefresh}
            />
          </>
        }
        pagination={{
          page: currentPageNumber,
          total: totalPages,
          onChange: handleChangePage,
        }}
      />

      {/* Detail Modal */}
      {selectedParticipant && (
        <EnrollmentDetailModal
          isOpen={detailModalOpen}
          onClose={handleCloseDetail}
          participant={selectedParticipant}
        />
      )}
    </motion.section>
  );
}
