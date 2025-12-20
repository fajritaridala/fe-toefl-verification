'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import usePagination from '@/hooks/usePagination';
import useServiceOptions from '@/hooks/useServiceOptions';
import { schedulesService, ScheduleListResponse } from '@features/admin';
import { ALL_MONTH_OPTION_VALUE, ALL_SERVICE_OPTION_VALUE } from './Schedules.constants';

/**
 * Hook for managing schedules list with pagination and filtering.
 * Refactored to use shared usePagination and useServiceOptions hooks.
 */
const useSchedules = () => {
  const {
    currentPage,
    currentLimit,
    getParam,
    setParams,
    handleChangePage,
    handleChangeLimit,
  } = usePagination();

  const { serviceOptions } = useServiceOptions();

  const currentMonth = getParam('month');
  const currentService = getParam('serviceId');

  const {
    data: schedulesResponse,
    isLoading: isLoadingSchedules,
    isRefetching: isRefetchingSchedules,
  } = useQuery({
    queryKey: [
      'schedules',
      'admin',
      currentPage,
      currentLimit,
      currentMonth,
      currentService,
    ],
    queryFn: async () => {
      const response = await schedulesService.getAdminSchedules({
        page: Number(currentPage),
        limit: Number(currentLimit),
        month:
          currentMonth && currentMonth !== ALL_MONTH_OPTION_VALUE
            ? currentMonth
            : undefined,
        serviceId: currentService || undefined,
      });
      return response.data as ScheduleListResponse;
    },
    enabled: !!currentPage && !!currentLimit,
  });

  const schedules = useMemo(() => {
    const items = schedulesResponse?.data || [];
    return items.map((item, idx) => ({
      ...item,
      __rowKey: item.scheduleId || `schedule-${idx}`,
    }));
  }, [schedulesResponse]);

  const pagination = useMemo(
    () => schedulesResponse?.pagination,
    [schedulesResponse]
  );

  function handleFilterService(serviceId: string) {
    setParams({
      serviceId:
        serviceId && serviceId !== ALL_SERVICE_OPTION_VALUE ? serviceId : null,
      page: '1',
    });
  }

  function handleFilterMonth(monthValue: string) {
    setParams({
      month:
        monthValue && monthValue !== ALL_MONTH_OPTION_VALUE ? monthValue : null,
      page: '1',
    });
  }

  return {
    schedules,
    pagination,
    serviceOptions,
    isLoadingSchedules,
    isRefetchingSchedules,
    currentLimit,
    currentPage,
    currentMonth,
    currentService,
    handleChangePage,
    handleChangeLimit,
    handleFilterMonth,
    handleFilterService,
  };
};

export default useSchedules;
