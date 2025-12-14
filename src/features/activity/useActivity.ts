import { useQuery } from '@tanstack/react-query';
import { activityService } from './activity.service';

export const useActivity = () => {
  const {
    data: dataActivity,
    isLoading: isLoadingActivity,
    isRefetching: isRefetchingActivity,
    refetch: refetchActivity,
    error: errorActivity,
  } = useQuery({
    queryKey: ['user-activity'],
    queryFn: async () => {
      const response = await activityService.getActivity();
      return response.data;
    },
  });

  return {
    dataActivity,
    isLoadingActivity,
    isRefetchingActivity,
    refetchActivity,
    errorActivity,
  };
};
