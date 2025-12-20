import { servicesService } from '@/domain/service.services';
import useDeleteMutation from '@/hooks/useDeleteMutation';

type UseDeleteServiceModalProps = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Hook for deleting services.
 * Refactored to use shared useDeleteMutation hook.
 */
const useDeleteServiceModal = ({
  onSuccess,
  onError,
}: UseDeleteServiceModalProps = {}) => {
  const { deleteMutate, isDeleting } = useDeleteMutation({
    mutationFn: (serviceId: string) => servicesService.removeService(serviceId),
    queryKey: ['services'],
    onSuccess,
    onError,
  });

  return {
    deleteService: deleteMutate,
    isDeleting,
  };
};

export default useDeleteServiceModal;
