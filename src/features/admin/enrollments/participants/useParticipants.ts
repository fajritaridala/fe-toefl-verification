import { useCallback, useEffect, useMemo, useState } from 'react';
import { EnrollmentItem } from '@features/admin';
import { FILTER_OPTIONS } from '@/constants/list.constants';
import useEnrollments from '../shared/useEnrollments';

export const useParticipants = () => {
  const {
    dataEnrollments,
    isLoadingEnrollments,
    isRefetchingEnrollments,
    currentLimit,
    currentPage,
    currentSearch,
    currentStatus,
    handleChangeLimit,
    handleChangePage,
    handleSearch,
    handleClearSearch,
    handleChangeStatus,
  } = useEnrollments({});

  const [statusFilter, setStatusFilter] = useState<string>(
    currentStatus ?? 'all'
  );
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] =
    useState<EnrollmentItem | null>(null);

  useEffect(() => {
    setStatusFilter(currentStatus ?? 'all');
  }, [currentStatus]);

  const tableData = useMemo(
    () => (dataEnrollments?.data as EnrollmentItem[]) || [],
    [dataEnrollments]
  );

  const totalPages = dataEnrollments?.pagination?.totalPages || 1;
  const currentPageNumber = Number(currentPage) || 1;
  const currentLimitValue = String(currentLimit);

  const filteredParticipants = useMemo(() => {
    if (statusFilter === 'all') return tableData;
    return tableData.filter(
      (participant) => participant.status === statusFilter
    );
  }, [statusFilter, tableData]);

  const tableItems = useMemo(() => {
    return filteredParticipants.map((participant, idx) => {
      const baseKey =
        participant._id ||
        participant.participantId ||
        `${participant.nim}-${participant.scheduleId}` ||
        `${participant.fullName}-${participant.scheduleId}`;

      return {
        ...participant,
        __rowKey: baseKey || `row-${idx}`,
      };
    });
  }, [filteredParticipants]);

  const statusOptions = useMemo(
    () => [
      { label: 'Semua Status', value: 'all' },
      ...FILTER_OPTIONS.map((option) => ({
        label: option.name,
        value: option.uid,
      })),
    ],
    []
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      setStatusFilter(value);
      handleChangeStatus(value);
    },
    [handleChangeStatus]
  );

  const handleOpenDetail = useCallback((participant: EnrollmentItem) => {
    setSelectedParticipant(participant);
    setDetailModalOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setDetailModalOpen(false);
    setSelectedParticipant(null);
  }, []);

  return {
    // State
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

    // Handlers
    handleSearch,
    handleClearSearch,
    handleStatusChange,
    handleChangeLimit,
    handleChangePage,
    handleOpenDetail,
    handleCloseDetail,
  };
};
