import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from '@heroui/react';
import { Trash2 } from 'lucide-react';
import moment from 'moment';
import useDeleteMutation from '@/hooks/useDeleteMutation';
import { schedulesService } from '@/services/admin.service';
import { ScheduleItem } from '@/types/admin.types';

// ============ HOOK ============
type UseDeleteScheduleModalProps = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

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

// ============ COMPONENT ============
type Props = {
  isOpen: boolean;
  schedule?: ScheduleItem | null;
  onClose: () => void;
};

const DeleteScheduleModal = ({ isOpen, schedule, onClose }: Props) => {
  const { deleteSchedule, isDeleting } = useDeleteScheduleModal({
    onSuccess: onClose,
  });

  const handleDelete = () => {
    if (!schedule?.scheduleId) return;
    deleteSchedule(schedule.scheduleId);
  };

  const serviceName = schedule?.serviceName || 'tanpa nama';
  const scheduleDate = schedule?.scheduleDate
    ? moment(schedule.scheduleDate).format('DD MMM YYYY')
    : '-';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      backdrop="blur"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: { duration: 0.4, ease: 'easeOut' },
          },
          exit: {
            y: 20,
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.3, ease: 'easeIn' },
          },
        },
      }}
    >
      <ModalContent>
        <ModalBody className="flex flex-col items-center justify-center py-8">
          <div className="bg-danger-50 text-danger ring-danger-50/50 mb-4 flex h-20 w-20 items-center justify-center rounded-full shadow-sm ring-8">
            <Trash2 size={32} strokeWidth={2.5} />
          </div>

          <h3 className="mb-2 text-center text-xl font-bold text-gray-900">
            Hapus Jadwal Tes?
          </h3>

          <p className="max-w-[85%] text-center text-sm text-gray-500">
            Anda akan menghapus jadwal{' '}
            <span className="font-bold text-gray-900">{serviceName}</span> pada
            tanggal{' '}
            <span className="font-bold text-gray-900">{scheduleDate}</span>.
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </ModalBody>
        <ModalFooter className="flex w-full justify-center gap-3 pt-0 pb-8">
          <Button
            variant="flat"
            onPress={onClose}
            className="w-1/3 font-semibold text-gray-700 hover:bg-gray-100"
          >
            Batal
          </Button>
          <Button
            color="danger"
            className="shadow-danger/20 w-1/3 font-semibold shadow-md"
            isLoading={isDeleting}
            onPress={handleDelete}
          >
            Hapus
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteScheduleModal;
