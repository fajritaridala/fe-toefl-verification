import { useCallback, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import { PAGINATION_OPTIONS } from '@/constants/list.constants';
import schedulesService from '@/services/schedules.service';
import servicesService from '@/services/services.service';
import { ScheduleListResponse } from '@/utils/interfaces/Schedule';
import { ServiceListResponse } from '@/utils/interfaces/Service';
import {
  ALL_MONTH_OPTION_VALUE,
  ALL_SERVICE_OPTION_VALUE,
  ServiceOption,
} from './Schedules.constants';

const getQueryValue = (param: string | string[] | undefined, fallback = '') => {
  if (Array.isArray(param)) return param[0] ?? fallback;
  return param ?? fallback;
};

const useSchedules = () => {
  const router = useRouter();
  const { isReady, pathname, query, push, replace } = router;
  const currentLimit = getQueryValue(
    query.limit,
    String(PAGINATION_OPTIONS.limitDefault)
  );
  const currentPage = getQueryValue(
    query.page,
    String(PAGINATION_OPTIONS.pageDefault)
  );
  const currentMonth = getQueryValue(query.month, '');
  const currentService = getQueryValue(query.serviceId, '');

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
            ? Number(currentMonth)
            : undefined,
        serviceId: currentService || undefined,
      });
      return response.data as ScheduleListResponse;
    },
    enabled: isReady && !!currentPage && !!currentLimit,
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

  const schedules = useMemo(
    () => schedulesResponse?.data || [],
    [schedulesResponse]
  );

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

  const initializeQueryParams = useCallback(() => {
    if (!isReady) return;
    const initialQuery: ParsedUrlQueryInput = {
      limit: currentLimit || PAGINATION_OPTIONS.limitDefault,
      page: currentPage || PAGINATION_OPTIONS.pageDefault,
    };
    if (currentMonth && currentMonth !== ALL_MONTH_OPTION_VALUE) {
      initialQuery.month = currentMonth;
    }
    if (currentService) {
      initialQuery.serviceId = currentService;
    }

    replace({ pathname, query: initialQuery }, undefined, { shallow: true });
  }, [
    isReady,
    pathname,
    replace,
    currentLimit,
    currentPage,
    currentMonth,
    currentService,
  ]);

  function handleChangePage(page: number) {
    push(
      {
        pathname,
        query: {
          ...query,
          page,
        },
      },
      undefined,
      { shallow: true }
    );
  }

  function handleChangeLimit(value: string) {
    push(
      {
        pathname,
        query: {
          ...query,
          limit: value,
          page: PAGINATION_OPTIONS.pageDefault,
        },
      },
      undefined,
      { shallow: true }
    );
  }

  function handleFilterService(serviceId: string) {
    const nextQuery: ParsedUrlQueryInput = { ...query };
    if (serviceId && serviceId !== ALL_SERVICE_OPTION_VALUE) {
      nextQuery.serviceId = serviceId;
    } else {
      delete nextQuery.serviceId;
    }
    nextQuery.page = PAGINATION_OPTIONS.pageDefault;

    push(
      {
        pathname,
        query: nextQuery,
      },
      undefined,
      { shallow: true }
    );
  }

  function handleFilterMonth(monthValue: string) {
    const nextQuery: ParsedUrlQueryInput = { ...query };
    if (monthValue && monthValue !== ALL_MONTH_OPTION_VALUE) {
      nextQuery.month = monthValue;
    } else {
      delete nextQuery.month;
    }
    nextQuery.page = PAGINATION_OPTIONS.pageDefault;

    push(
      {
        pathname,
        query: nextQuery,
      },
      undefined,
      { shallow: true }
    );
  }

  useEffect(() => {
    if (!isReady) return;
    if (query.limit && query.page) {
      return;
    }
    initializeQueryParams();
  }, [
    isReady,
    query.limit,
    query.page,
    query.month,
    query.serviceId,
    initializeQueryParams,
  ]);

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
