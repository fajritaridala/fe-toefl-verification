import { useCallback, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { PAGINATION_OPTIONS } from '@/constants/list.constants';
import useDebounce from '@/hooks/useDebounce';
import servicesService from '@/services/services.service';
import { ServiceListResponse } from '@/utils/interfaces/Service';

const getQueryValue = (
  param: string | string[] | undefined,
  fallback = ''
) => {
  if (Array.isArray(param)) return param[0] ?? fallback;
  return param ?? fallback;
};

const useServices = () => {
  const router = useRouter();
  const { isReady, pathname, query, push, replace } = router;
  const { limit: queryLimit, page: queryPage, search: querySearch } = query;
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
    enabled: isReady && !!currentPage && !!currentLimit,
  });

  const services = useMemo(() => servicesResponse?.data || [], [servicesResponse]);
  const pagination = useMemo(() => servicesResponse?.pagination, [servicesResponse]);

  const initializeQueryParams = useCallback(() => {
    if (!isReady) return;
    replace(
      {
        pathname,
        query: {
          limit: currentLimit || PAGINATION_OPTIONS.limitDefault,
          page: currentPage || PAGINATION_OPTIONS.pageDefault,
          search: currentSearch || '',
        },
      },
      undefined,
      { shallow: true }
    );
  }, [
    isReady,
    pathname,
    replace,
    currentLimit,
    currentPage,
    currentSearch,
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

  function handleClearSearch() {
    push(
      {
        pathname,
        query: {
          ...query,
          search: '',
          page: PAGINATION_OPTIONS.pageDefault,
        },
      },
      undefined,
      { shallow: true }
    );
  }

  useEffect(() => {
    if (!isReady) return;
    if (queryLimit && queryPage && querySearch !== undefined) {
      return;
    }
    initializeQueryParams();
  }, [isReady, queryLimit, queryPage, querySearch, initializeQueryParams]);

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
