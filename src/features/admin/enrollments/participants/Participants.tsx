'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Eye } from 'lucide-react';
import { Button } from '@heroui/react';
import EnrollmentDetailModal from '@/components/ui/Modal/EnrollmentDetailModal';
import { EnrollmentStatusChip } from '@/components/ui/Chip/EnrollmentStatusChip';
import { formatDate } from '@/lib/utils';
import { useParticipants } from './useParticipants';
import { EnrollmentStatus, EnrollmentItem } from '@/features/admin/types/admin.types';
import GenericEnrollmentTable, { ColumnConfig } from '@/components/ui/Table/Enrollments/GenericEnrollmentTable';
import { ServiceFilter } from '@/components/ui/Button/Filter/ServiceFilter';
import { StatusFilter } from '@/components/ui/Button/Filter/StatusFilter';
import { LimitFilter } from '@/components/ui/Button/Filter/LimitFilter';
import { RefreshButton } from '@/components/ui/Button/RefreshButton';

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
        render: (item) => <p className="text-center text-sm text-gray-700">{formatDate(item.scheduleDate)}</p>
      },
      { 
        uid: 'status', 
        name: 'Status', 
        align: 'center',
        render: (item) => <EnrollmentStatusChip status={item.status} />
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
        )
      }
  ];

  return (
    <section className="space-y-4">
      <GenericEnrollmentTable
        data={tableItems as EnrollmentItem[]}
        isLoading={isLoadingEnrollments}
        isRefetching={isRefetchingEnrollments}
        columns={columns}
        search={{
            value: currentSearch,
            onChange: handleSearch,
            onClear: handleClearSearch
        }}
        filterContent={
            <>
                <ServiceFilter value={currentServiceId} onChange={handleChangeService} options={serviceOptions} />
                <StatusFilter value={statusFilter} onChange={handleStatusChange} options={statusOptions} />
                <LimitFilter value={currentLimitValue} onChange={handleChangeLimit} />
                <RefreshButton isRefetching={isRefetchingEnrollments} onRefresh={handleRefresh} />
            </>
        }
        pagination={{
            page: currentPageNumber,
            total: totalPages,
            onChange: handleChangePage
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
    </section>
  );
}
