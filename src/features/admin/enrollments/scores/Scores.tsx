'use client';

import { useMemo } from 'react';
import { type Variants, motion } from 'framer-motion';
import { PenSquare } from 'lucide-react';
import { LimitFilter } from '@/components/ui/Button/Filter/LimitFilter';
import { RefreshButton } from '@/components/ui/Button/RefreshButton';
import GenericEnrollmentTable from '@/components/ui/Table/Enrollments/GenericEnrollmentTable';
import {
  EnrollmentItem,
  EnrollmentStatus,
} from '@/features/admin/enrollments/enrollment.types';
import { getScoreColumns } from './ScoreConstant';
import ScoreInputModal from './ScoreInputModal';
import { useScores } from './useScores';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function Scores() {
  const {
    // List & Search Data
    dataEnrollments,
    isLoadingEnrollments,
    isRefetchingEnrollments,
    currentLimit,
    currentPage,
    handleChangeLimit,
    handleChangePage,
    searchInput,
    setSearchInput,
    handleClearSearch,

    // Actions
    selectedParticipant,
    scoreModalOpen,
    isSubmittingScore,
    blockchainStatus,
    statusMessage,
    handleOpenScoreModal,
    handleSubmitScore,
    handleRefresh,
    handleCloseModal,
    handleRetryBlockchain,
  } = useScores();

  const participants = useMemo(() => {
    const items = (dataEnrollments?.data as EnrollmentItem[]) || [];
    return items.map((item, idx) => ({
      ...item,
      __rowKey: item.enrollId || item.participantId || `score-${idx}`,
    }));
  }, [dataEnrollments]);

  const totalPages = dataEnrollments?.pagination?.totalPages || 1;

  const columns = getScoreColumns(handleOpenScoreModal);

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
        onRetry={handleRetryBlockchain}
      />
    </motion.section>
  );
}
