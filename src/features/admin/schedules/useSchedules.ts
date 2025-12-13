import { useCallback, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PAGINATION_OPTIONS } from '@/constants/list.constants';
import { schedulesService } from '@features/admin';
import { servicesService } from '@features/admin';
import { ScheduleListResponse } from '@features/admin';
import { ServiceListResponse } from '@features/admin';
import {
  ALL_MONTH_OPTION_VALUE,
  ALL_SERVICE_OPTION_VALUE,
  ServiceOption,
} from './Schedules.constants';

const useSchedules = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentLimit = searchParams?.get('limit') ?? String(PAGINATION_OPTIONS.limitDefault);
  const currentPage = searchParams?.get('page') ?? String(PAGINATION_OPTIONS.pageDefault);
  const currentMonth = searchParams?.get('month') ?? '';
  const currentService = searchParams?.get('serviceId') ?? '';

  const buildUrl = useCallback(
    (updates: Record<string, string | null | undefined>, method: 'push' | 'replace' = 'push') => {
      const params = new URLSearchParams(searchParams?.toString() ?? '');
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          params.delete(key);
          return;
        }
        params.set(key, value);
      });
      const queryString = params.toString();
      const href = queryString ? `${pathname}?${queryString}` : pathname;
      router[method](href);
    },
    [pathname, router, searchParams]
  );

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
      const response = await schedulesService.getSchedules({
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

  const { data: servicesResponse } = useQuery({
    queryKey: ['services', 'options', 'schedules'],
    queryFn: async () => {
      const response = await servicesService.getServices({
        page: 1,
        limit: 100,
      });
      return response.data as ServiceListResponse;
    },
    staleTime: 1000 * 60 * 5,
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

  const serviceOptions = useMemo<ServiceOption[]>(() => {
    if (!servicesResponse?.data?.length) return [];
    return servicesResponse.data.map((service) => ({
      label: service.name,
      value: service._id,
    }));
  }, [servicesResponse]);

  const ensureDefaults = useCallback(() => {
    const hasLimit = searchParams?.has('limit');
    const hasPage = searchParams?.has('page');
    if (hasLimit && hasPage) return;

    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (!hasLimit) params.set('limit', String(PAGINATION_OPTIONS.limitDefault));
    if (!hasPage) params.set('page', String(PAGINATION_OPTIONS.pageDefault));
    const queryString = params.toString();
    const href = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(href);
  }, [pathname, router, searchParams]);

  function handleChangePage(page: number) {
    buildUrl({ page: String(page) });
  }

  function handleChangeLimit(value: string) {
    buildUrl({ limit: value, page: String(PAGINATION_OPTIONS.pageDefault) });
  }

  function handleFilterService(serviceId: string) {
    buildUrl({
      serviceId:
        serviceId && serviceId !== ALL_SERVICE_OPTION_VALUE ? serviceId : null,
      page: String(PAGINATION_OPTIONS.pageDefault),
    });
  }

  function handleFilterMonth(monthValue: string) {
    buildUrl({
      month:
        monthValue && monthValue !== ALL_MONTH_OPTION_VALUE ? monthValue : null,
      page: String(PAGINATION_OPTIONS.pageDefault),
    });
  }

  useEffect(() => {
    ensureDefaults();
  }, [ensureDefaults]);

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
