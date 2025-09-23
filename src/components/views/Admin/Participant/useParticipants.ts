import { PAGINATION_OPTIONS } from '@/constants/list.constants';
import useDebounce from '@/hooks/useDebounce';
import toeflService from '@/services/toefl.service';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { ChangeEvent } from 'react';

function useParticipants() {
  const router = useRouter();
  const debounce = useDebounce();
  const currentLimit = router.query.limit;
  const currentPage = router.query.page;
  const currentSearch = router.query.search;

  function setUrl() {
    router.replace({
      query: {
        limit: currentLimit || PAGINATION_OPTIONS.limitDefault,
        page: currentPage || PAGINATION_OPTIONS.pageDefault,
        search: currentSearch || '',
      },
    });
  }

  async function getParticipants() {
    let params = `limit=${currentLimit}&page=${currentPage}`;
    if (currentSearch) {
      params += `&search=${currentSearch}`;
    }
    const response = await toeflService.getParticipants(params);
    const { data } = response;
    return data;
  }

  const {
    data: dataParticipants,
    isLoading: isLoadingParticipants,
    isRefetching: isRefetchingParticipants,
  } = useQuery({
    queryKey: ['toefls', currentPage, currentLimit, currentSearch],
    queryFn: getParticipants,
    enabled: router.isReady && !!currentPage && !!currentLimit,
  });

  function handleChangePage(page: number) {
    router.push({
      query: {
        ...router.query,
        page,
      },
    });
  }

  function handleChangeLimit(e: ChangeEvent<HTMLSelectElement>) {
    const selectedLimit = e.target.value;
    router.push({
      query: {
        ...router.query,
        limit: selectedLimit,
        page: PAGINATION_OPTIONS.pageDefault,
      },
    });
  }

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    debounce(() => {
      const search = e.target.value;
      router.push({
        query: {
          ...router.query,
          search,
          page: PAGINATION_OPTIONS.pageDefault,
        },
      });
    }, PAGINATION_OPTIONS.delay);
  }

  function handleClearSearch() {
    router.push({
      query: {
        ...router.query,
        search: '',
        page: PAGINATION_OPTIONS.pageDefault,
      },
    });
  }

  return {
    dataParticipants,
    isLoadingParticipants,
    isRefetchingParticipants,

    setUrl,
    currentLimit,
    currentPage,
    currentSearch,
    handleChangePage,
    handleChangeLimit,
    handleSearch,
    handleClearSearch,
  };
}

export default useParticipants;
