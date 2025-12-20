'use client';

import { Button } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { type Variants, motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { LimitFilter } from '@/components/ui/Button/Filter/LimitFilter';
import { ServiceFilter } from '@/components/ui/Button/Filter/ServiceFilter';
import { StatusFilter } from '@/components/ui/Button/Filter/StatusFilter';
import { RefreshButton } from '@/components/ui/Button/RefreshButton';
import { EnrollmentStatusChip } from '@/components/ui/Chip/EnrollmentStatusChip';
import EnrollmentDetailModal from '@/components/ui/Modal/EnrollmentDetailModal';
import GenericEnrollmentTable, {
  ColumnConfig,
} from '@/components/ui/Table/Enrollments/GenericEnrollmentTable';
import { EnrollmentItem } from '@/features/admin/types/admin.types';
import { formatDate } from '@/utils/common';
import { useParticipants } from './useParticipants';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function Participants() {
  const {
    tableItems,
    statusFilter,
    statusOptions, // Use options from hook consistent with constants
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
    currentServiceId,
    serviceOptions,
    handleChangeService,
  } = useParticipants();

  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['enrollments'] });
  };

  /* Removed renderStatusChip - Replaced by EnrollmentStatusChip component */

  const columns: ColumnConfig[] = [
    { uid: 'fullName', name: 'Nama Lengkap', align: 'start' },
    { uid: 'nim', name: 'NIM', align: 'center' },
    { uid: 'serviceName', name: 'Layanan', align: 'center' },
    {
      uid: 'scheduleDate',
      name: 'Jadwal',
      align: 'center',
      render: (item) => (
        <p className="text-center text-sm text-gray-700">
          {formatDate(item.scheduleDate)}
        </p>
      ),
    },
    {
      uid: 'status',
      name: 'Status',
      align: 'center',
      render: (item) => <EnrollmentStatusChip status={item.status} />,
    },
    {
      uid: 'actions',
      name: 'Aksi',
      align: 'center',
      render: (item) => (
        <div className="text-center">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            radius="full"
            aria-label="Lihat detail"
            className="hover:text-primary text-gray-600"
            onPress={() => handleOpenDetail(item)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  console.log(tableItems);

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
          value: currentSearch,
          onChange: handleSearch,
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
