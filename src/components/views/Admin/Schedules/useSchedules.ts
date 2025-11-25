import { useCallback, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import { PAGINATION_OPTIONS } from '@/constants/list.constants';
import useDebounce from '@/hooks/useDebounce';
import schedulesService from '@/services/schedules.service';
import servicesService from '@/services/services.service';
import { ScheduleListResponse } from '@/utils/interfaces/Schedule';
import { ServiceListResponse } from '@/utils/interfaces/Service';
import { ALL_SERVICE_OPTION_VALUE, ServiceOption } from './Schedules.constants';

const getQueryValue = (param: string | string[] | undefined, fallback = '') => {
  if (Array.isArray(param)) return param[0] ?? fallback;
  return param ?? fallback;
};

const useSchedules = () => {
  const router = useRouter();
  const { isReady, pathname, query, push, replace } = router;
  const debounce = useDebounce();
  const currentLimit = getQueryValue(
    query.limit,
    String(PAGINATION_OPTIONS.limitDefault)
  );
  const currentPage = getQueryValue(
    query.page,
    String(PAGINATION_OPTIONS.pageDefault)
  );
  const currentSearch = getQueryValue(query.search, '');
  const currentService = getQueryValue(query.service_id, '');

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
      currentSearch,
      currentService,
    ],
    queryFn: async () => {
      const response = await schedulesService.getSchedules({
        page: Number(currentPage),
        limit: Number(currentLimit),
        search: currentSearch || undefined,
        service_id: currentService || undefined,
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
      search: currentSearch || '',
    };
    if (currentService) {
      initialQuery.service_id = currentService;
    }

    replace({ pathname, query: initialQuery }, undefined, { shallow: true });
  }, [
    isReady,
    pathname,
    replace,
    currentLimit,
    currentPage,
    currentSearch,
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

  function handleSearch(value: string) {
    debounce(() => {
      push(
        {
          pathname,
          query: {
            ...query,
            search: value,
            page: PAGINATION_OPTIONS.pageDefault,
          },
        },
        undefined,
        { shallow: true }
      );
    }, PAGINATION_OPTIONS.delay);
  }

  function handleFilterService(serviceId: string) {
    const nextQuery: ParsedUrlQueryInput = { ...query };
    if (serviceId && serviceId !== ALL_SERVICE_OPTION_VALUE) {
      nextQuery.service_id = serviceId;
    } else {
      delete nextQuery.service_id;
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

  function handleClearFilters() {
    const nextQuery: ParsedUrlQueryInput = {
      ...query,
      search: '',
      page: PAGINATION_OPTIONS.pageDefault,
    };
    delete nextQuery.service_id;

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
    if (query.limit && query.page && query.search !== undefined) {
      return;
    }
    initializeQueryParams();
  }, [
    isReady,
    query.limit,
    query.page,
    query.search,
    query.service_id,
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
    currentSearch,
    currentService,
    handleChangePage,
    handleChangeLimit,
    handleSearch,
    handleFilterService,
    handleClearFilters,
  };
};

export default useSchedules;
