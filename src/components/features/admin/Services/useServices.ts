import { useCallback, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PAGINATION_OPTIONS } from '@/constants/list.constants';
import useDebounce from '@/hooks/useDebounce';
import { servicesService } from '@features/admin/admin.service';
import { ServiceListResponse } from '@features/admin/admin.types';

const useServices = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounce = useDebounce();

  const currentLimit = searchParams?.get('limit') ?? String(PAGINATION_OPTIONS.limitDefault);
  const currentPage = searchParams?.get('page') ?? String(PAGINATION_OPTIONS.pageDefault);
  const currentSearch = searchParams?.get('search') ?? '';

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

  const services = useMemo(() => servicesResponse?.data || [], [servicesResponse]);
  const pagination = useMemo(() => servicesResponse?.pagination, [servicesResponse]);

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

  function handleSearch(value: string) {
    debounce(() => {
      buildUrl({ search: value, page: String(PAGINATION_OPTIONS.pageDefault) });
    }, PAGINATION_OPTIONS.delay);
  }

  function handleClearSearch() {
    buildUrl({ search: null, page: String(PAGINATION_OPTIONS.pageDefault) });
  }

  useEffect(() => {
    ensureDefaults();
  }, [ensureDefaults]);

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
