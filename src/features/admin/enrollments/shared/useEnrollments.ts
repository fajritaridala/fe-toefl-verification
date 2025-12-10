"use client";

import { useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PAGINATION_OPTIONS } from '@/constants/list.constants';
import useDebounceCallback from '@/hooks/useDebounce';
import { enrollmentsService } from '@features/admin';
import { EnrollmentItem, EnrollmentListResponse } from '@features/admin';

type UseEnrollmentsOptions = {
  fixedStatus?: EnrollmentItem['status'];
};

function useEnrollments(options?: UseEnrollmentsOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounce = useDebounceCallback();
  const fixedStatus = options?.fixedStatus;

  const currentLimit = searchParams?.get('limit') ?? String(PAGINATION_OPTIONS.limitDefault);
  const currentPage = searchParams?.get('page') ?? String(PAGINATION_OPTIONS.pageDefault);
  const currentSearch = searchParams?.get('search') ?? '';
  const currentStatus = fixedStatus ?? searchParams?.get('status') ?? 'all';
  const normalizedStatus =
    fixedStatus ?? (currentStatus !== 'all' ? (currentStatus as EnrollmentItem['status']) : undefined);

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
    data: dataEnrollments,
    isLoading: isLoadingEnrollments,
    isRefetching: isRefetchingEnrollments,
  } = useQuery({
    queryKey: ['enrollments', currentPage, currentLimit, currentSearch, normalizedStatus],
    queryFn: async () => {
      const response = await enrollmentsService.getEnrollments({
        page: Number(currentPage),
        limit: Number(currentLimit),
        search: currentSearch || undefined,
        status: normalizedStatus,
      });
      return response.data as EnrollmentListResponse;
    },
    enabled: !!currentPage && !!currentLimit,
  });

  useEffect(() => {
    const hasLimit = searchParams?.has('limit');
    const hasPage = searchParams?.has('page');
    if (hasLimit && hasPage) return;

    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (!hasLimit) params.set('limit', String(PAGINATION_OPTIONS.limitDefault));
    if (!hasPage) params.set('page', String(PAGINATION_OPTIONS.pageDefault));
    if (fixedStatus) params.set('status', fixedStatus);
    const queryString = params.toString();
    const href = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(href);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // Only run once on mount

  const handleChangePage = useCallback((page: number) => {
    buildUrl({ page: String(page) });
  }, [buildUrl]);

  const handleChangeLimit = useCallback((selectedLimit: string) => {
    buildUrl({ limit: selectedLimit, page: String(PAGINATION_OPTIONS.pageDefault) });
  }, [buildUrl]);

  const handleSearch = useCallback((value: string) => {
    debounce(() => {
      buildUrl({ search: value, page: String(PAGINATION_OPTIONS.pageDefault) });
    }, PAGINATION_OPTIONS.delay);
  }, [buildUrl, debounce]);

  const handleChangeStatus = useCallback((status: string) => {
    if (fixedStatus) return;
    buildUrl({
      status: !status || status === 'all' ? null : status,
      page: String(PAGINATION_OPTIONS.pageDefault),
    });
  }, [buildUrl, fixedStatus]);

  const handleClearSearch = useCallback(() => {
    buildUrl({ search: null, page: String(PAGINATION_OPTIONS.pageDefault) });
  }, [buildUrl]);

  return {
    dataEnrollments,
    isLoadingEnrollments,
    isRefetchingEnrollments,
    currentLimit,
    currentPage,
    currentSearch,
    currentStatus,
    handleChangePage,
    handleChangeLimit,
    handleSearch,
    handleClearSearch,
    handleChangeStatus,
    fixedStatus,
  };
}

export default useEnrollments;
