import { schedulesService } from '@/domain/schedule.services';
import useDeleteMutation from '@/hooks/useDeleteMutation';

type UseDeleteScheduleModalProps = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Hook for deleting schedules.
 * Refactored to use shared useDeleteMutation hook.
 */
const useDeleteScheduleModal = ({
  onSuccess,
  onError,
}: UseDeleteScheduleModalProps = {}) => {
  const { deleteMutate, isDeleting } = useDeleteMutation({
    mutationFn: (scheduleId: string) =>
      schedulesService.removeSchedule(scheduleId),
    queryKey: ['schedules'],
    onSuccess,
    onError,
  });

  return {
    deleteSchedule: deleteMutate,
    isDeleting,
  };
};

export default useDeleteScheduleModal;
