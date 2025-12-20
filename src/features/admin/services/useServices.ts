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
  const {
    currentPage,
    currentLimit,
    currentSearch,
    handleChangePage,
    handleChangeLimit,
    handleSearch,
    handleClearSearch,
  } = usePagination();

  const {
    data: servicesResponse,
    isLoading: isLoadingServices,
    isRefetching: isRefetchingServices,
  } = useQuery({
    queryKey: ['services', 'admin', currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const response = await servicesService.getServices({
        page: Number(currentPage),
        limit: Number(currentLimit),
        search: currentSearch,
      });
      return response.data as ServiceListResponse;
    },
    enabled: !!currentPage && !!currentLimit,
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
    currentLimit,
    currentPage,
    currentSearch,
    handleChangePage,
    handleChangeLimit,
    handleSearch,
    handleClearSearch,
  };
};

export default useServices;
