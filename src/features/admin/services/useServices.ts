'use client';

import { useMemo } from 'react';
import { ServiceListResponse } from '@features/admin/services/service.types';
import { useQuery } from '@tanstack/react-query';
import { servicesService } from '@/domain/service.services';
import usePagination from '@/hooks/usePagination';

/**
 * Hook for managing services list with pagination, search, and filtering.
 * Refactored to use shared usePagination hook for DRY compliance.
 */
const useServices = () => {
  const { currentPage, handleChangePage } = usePagination();

  const {
    data: servicesResponse,
    isLoading: isLoadingServices,
    isRefetching: isRefetchingServices,
  } = useQuery({
    queryKey: ['services', 'admin', currentPage],
    queryFn: async () => {
      const response = await servicesService.getServices({
        page: Number(currentPage),

        limit: 10,
      });
      return response.data as ServiceListResponse;
    },
    enabled: !!currentPage,
  });

  const services = useMemo(() => {
    const items = servicesResponse?.data || [];
    return items.map((item, idx) => ({
      ...item,
      __rowKey: item._id || `service-${idx}`,
    }));
  }, [servicesResponse]);

  const pagination = useMemo(
    () => servicesResponse?.pagination,
    [servicesResponse]
  );

  return {
    services,
    pagination,
    isLoadingServices,
    isRefetchingServices,
    currentPage,
    handleChangePage,
  };
};

export default useServices;
