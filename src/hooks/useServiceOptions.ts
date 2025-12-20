import { useMemo } from 'react';
import { ServiceListResponse } from '@features/admin/services/service.types';
import { useQuery } from '@tanstack/react-query';
import { servicesService } from '@/domain/service.services';
import type {
  ServiceOption,
  UseServiceOptionsReturn,
} from './useServiceOptions.types';

/**
 * Shared hook for fetching service dropdown options.
 * Used by schedules, participants, and filter components.
 * Caches results for 5 minutes to reduce API calls.
 */
function useServiceOptions(): UseServiceOptionsReturn {
  const { data: servicesResponse, isLoading } = useQuery({
    queryKey: ['services', 'options'],
    queryFn: async () => {
      const response = await servicesService.getServices({
        page: 1,
        limit: 100,
      });
      return response.data as ServiceListResponse;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const serviceOptions = useMemo<ServiceOption[]>(() => {
    if (!servicesResponse?.data?.length) return [];
    return servicesResponse.data.map((service) => ({
      label: service.name,
      value: service._id,
    }));
  }, [servicesResponse]);

  return {
    serviceOptions,
    isLoading,
  };
}

export default useServiceOptions;
