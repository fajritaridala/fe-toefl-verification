import { ChangeEvent, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import { PAGINATION_OPTIONS } from '@/constants/list.constants';
import useDebounce from '@/hooks/useDebounce';
import enrollmentsService from '@/services/enrollments.service';
import { EnrollmentItem, EnrollmentListResponse } from '@/utils/interfaces/Schedule';

const getQueryValue = (param: string | string[] | undefined, fallback = '') => {
  if (Array.isArray(param)) return param[0] ?? fallback;
  return param ?? fallback;
};

type UseParticipantsOptions = {
  fixedStatus?: EnrollmentItem['status'];
};

function useParticipants(options?: UseParticipantsOptions) {
  const router = useRouter();
  const debounce = useDebounce();
  const { query, pathname, push, replace, isReady } = router;
  const fixedStatus = options?.fixedStatus;

  const currentLimit = getQueryValue(
    query.limit,
    String(PAGINATION_OPTIONS.limitDefault)
  );
  const currentPage = getQueryValue(
    query.page,
    String(PAGINATION_OPTIONS.pageDefault)
  );
  const currentSearch = getQueryValue(query.search, '');
  const currentStatus = fixedStatus ?? getQueryValue(query.status, 'all');
  const normalizedStatus =
    fixedStatus ?? (currentStatus !== 'all' ? (currentStatus as EnrollmentItem['status']) : undefined);

  const {
    data: dataParticipants,
    isLoading: isLoadingParticipants,
    isRefetching: isRefetchingParticipants,
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
    enabled: isReady && !!currentPage && !!currentLimit,
  });

  const initializeQueryParams = useCallback(() => {
    if (!isReady) return;
    const initialQuery: ParsedUrlQueryInput = {
      limit: currentLimit || PAGINATION_OPTIONS.limitDefault,
      page: currentPage || PAGINATION_OPTIONS.pageDefault,
      search: currentSearch || '',
    };
    if (!fixedStatus && currentStatus && currentStatus !== 'all') {
      initialQuery.status = currentStatus;
    }

    replace({ pathname, query: initialQuery }, undefined, { shallow: true });
  }, [
    isReady,
    pathname,
    replace,
    currentLimit,
    currentPage,
    currentSearch,
    currentStatus,
    fixedStatus,
  ]);

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
    query.search,
    query.status,
    initializeQueryParams,
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

  function handleChangeLimit(selectedLimit: string) {
    push(
      {
        pathname,
        query: {
          ...query,
          limit: selectedLimit,
          page: PAGINATION_OPTIONS.pageDefault,
        },
      },
      undefined,
      { shallow: true }
    );
  }

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
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

  function handleChangeStatus(status: string) {
    if (fixedStatus) return;
    const nextQuery = { ...query };
    if (!status || status === 'all') {
      delete nextQuery.status;
    } else {
      nextQuery.status = status;
    }
    push(
      {
        pathname,
        query: {
          ...nextQuery,
          page: PAGINATION_OPTIONS.pageDefault,
        },
      },
      undefined,
      { shallow: true }
    );
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

  return {
    dataParticipants,
    isLoadingParticipants,
    isRefetchingParticipants,
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

export default useParticipants;
