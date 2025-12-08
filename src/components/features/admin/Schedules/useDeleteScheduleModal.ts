import { useMutation, useQueryClient } from '@tanstack/react-query';
import { schedulesService } from '@features/admin/admin.service';

type UseDeleteScheduleModalProps = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

const useDeleteScheduleModal = ({
  onSuccess,
  onError,
}: UseDeleteScheduleModalProps = {}) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (scheduleId: string) =>
      schedulesService.removeSchedule(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    deleteSchedule: mutate,
    isDeleting: isPending,
  };
};

export default useDeleteScheduleModal;
