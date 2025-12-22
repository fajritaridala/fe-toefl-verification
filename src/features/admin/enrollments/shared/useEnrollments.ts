'use client';

import { useCallback } from 'react';
import {
  EnrollmentItem,
  EnrollmentListResponse,
} from '@features/admin/enrollments/enrollment.types';
import { useQuery } from '@tanstack/react-query';
import { enrollmentsService } from '@/domain/enroll.services';
import usePagination from '@/hooks/usePagination';

export type UseEnrollmentsOptions = {
  fixedStatus?: EnrollmentItem['status'];
};

/**
 * Hook for managing enrollments list with pagination, search, and filtering.
 * Refactored to use shared usePagination hook for DRY compliance.
 */
function useEnrollments(options?: UseEnrollmentsOptions) {
  const {
    currentPage,
    currentLimit,
    currentSearch,
    getParam,
    setParams,
    handleChangePage,
    handleChangeLimit,
    handleSearch,
    handleClearSearch,
  } = usePagination();

  const fixedStatus = options?.fixedStatus;
  const currentStatus = fixedStatus ?? (getParam('status') || 'all');
  const currentServiceId = getParam('serviceId') || 'all';
  const currentScheduleId = getParam('scheduleId') || 'all';

  const normalizedStatus =
    fixedStatus ??
    (currentStatus !== 'all'
      ? (currentStatus as EnrollmentItem['status'])
      : undefined);
  const normalizedServiceId =
    currentServiceId !== 'all' ? currentServiceId : undefined;
  const normalizedScheduleId =
    currentScheduleId !== 'all' ? currentScheduleId : undefined;

  const {
    data: dataEnrollments,
    isLoading: isLoadingEnrollments,
    isRefetching: isRefetchingEnrollments,
  } = useQuery({
    queryKey: [
      'enrollments',
      currentPage,
      currentLimit,
      currentSearch,
      normalizedStatus,
      normalizedServiceId,
      normalizedScheduleId,
    ],
    queryFn: async () => {
      const response = await enrollmentsService.getEnrollments({
        page: Number(currentPage),
        limit: Number(currentLimit),
        search: currentSearch || undefined,
        status: normalizedStatus,
        serviceId: normalizedServiceId,
        scheduleId: normalizedScheduleId,
      });
      return response.data as EnrollmentListResponse;
    },
    enabled: !!currentPage && !!currentLimit,
  });

  const handleChangeStatus = useCallback(
    (status: string) => {
      if (fixedStatus) return;
      setParams({
        status: !status || status === 'all' ? null : status,
        page: '1',
      });
    },
    [setParams, fixedStatus]
  );

  const handleChangeService = useCallback(
    (serviceId: string) => {
      setParams({
        serviceId: !serviceId || serviceId === 'all' ? null : serviceId,
        page: '1',
      });
    },
    [setParams]
  );

  const handleChangeSchedule = useCallback(
    (scheduleId: string) => {
      setParams({
        scheduleId: !scheduleId || scheduleId === 'all' ? null : scheduleId,
        page: '1',
      });
    },
    [setParams]
  );

  return {
    dataEnrollments,
    isLoadingEnrollments,
    isRefetchingEnrollments,
    currentLimit,
    currentPage,
    currentSearch,
    currentStatus,
    currentServiceId,
    currentScheduleId,
    handleChangePage,
    handleChangeLimit,
    handleSearch,
    handleClearSearch,
    handleChangeStatus,
    handleChangeService,
    handleChangeSchedule,
    fixedStatus,
  };
}

export default useEnrollments;
