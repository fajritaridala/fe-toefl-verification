import { useCallback, useEffect, useMemo, useState } from 'react';
import { EnrollmentItem } from '@features/admin/enrollments/enrollment.types';
import { useQuery } from '@tanstack/react-query';
import { FILTER_OPTIONS } from '@/constants/list.constants';
import { schedulesService } from '@/domain/schedule.services';
import { servicesService } from '@/domain/service.services';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDate } from '@/utils/common';
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
    currentServiceId,
    handleChangeService,
    currentScheduleId,
    handleChangeSchedule,
  } = useEnrollments({});

  const [statusFilter, setStatusFilter] = useState<string>(
    currentStatus ?? 'all'
  );
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] =
    useState<EnrollmentItem | null>(null);

  // --- Search Logic ---
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    handleSearch(debouncedSearch);
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClearLocalSearch = useCallback(() => {
    setSearchInput('');
    handleClearSearch();
  }, [handleClearSearch]);

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
    return filteredParticipants.map((participant) => {
      return {
        ...participant,
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
    // Delay clearing the data to allow exit animation to play
    setTimeout(() => {
      setSelectedParticipant(null);
    }, 400);
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                SERVICES DATA                               */
  /* -------------------------------------------------------------------------- */
  // Fetch services for dropdown filter (fetch all/active)
  // We use a separate query key to avoid conflict with admin services table cache if needed
  const { data: servicesData } = useQuery({
    queryKey: ['services', 'options'],
    queryFn: async () => {
      // Fetch with large limit to get all services
      // Adjust params as needed based on backend capability to return all
      const response = await servicesService.getServices({ limit: 100 });
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const serviceOptions = useMemo(() => {
    const items = servicesData?.data || [];
    return items.map((svc: { name: string; _id: string }) => ({
      label: svc.name,
      value: svc._id,
    }));
  }, [servicesData]);

  const { data: schedulesData } = useQuery({
    queryKey: ['schedules', 'options', currentServiceId],
    queryFn: async () => {
      const query =
        currentServiceId && currentServiceId !== 'all'
          ? { serviceId: currentServiceId, limit: 100 }
          : { limit: 100 };
      const response = await schedulesService.getAdminSchedules(query);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const scheduleOptions = useMemo(() => {
    const items = schedulesData?.data || [];
    return items.map((sch: { date: string; _id: string; quota: number }) => ({
      label: `${formatDate(sch.date)} (Kuota: ${sch.quota})`,
      value: sch._id,
    }));
  }, [schedulesData]);

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
    currentServiceId,
    serviceOptions,

    // Handlers
    // Handlers
    handleSearch,
    handleClearSearch: handleClearLocalSearch,
    handleStatusChange,
    handleChangeLimit,
    handleChangePage,
    handleOpenDetail,
    handleCloseDetail,
    handleChangeService,
    currentScheduleId,
    handleChangeSchedule,
    scheduleOptions,
    // Search State
    searchInput,
    setSearchInput,
  };
};
