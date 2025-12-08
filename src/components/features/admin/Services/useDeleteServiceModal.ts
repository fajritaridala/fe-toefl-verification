import { useMutation, useQueryClient } from '@tanstack/react-query';
import { servicesService } from '@features/admin/admin.service';

type UseDeleteServiceModalProps = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

const useDeleteServiceModal = ({
  onSuccess,
  onError,
}: UseDeleteServiceModalProps = {}) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (serviceId: string) => servicesService.removeService(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    deleteService: mutate,
    isDeleting: isPending,
  };
};

export default useDeleteServiceModal;
