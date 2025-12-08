import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import moment from 'moment';
import { ScheduleItem } from '@features/admin/admin.types';
import useDeleteScheduleModal from './useDeleteScheduleModal';

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
    if (!schedule?._id) return;
    deleteSchedule(schedule._id);
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
    >
      <ModalContent>
        <ModalHeader>
          <div>
            <p className="text-small text-text-muted uppercase tracking-[0.25rem]">
              Konfirmasi
            </p>
            <h1 className="text-2xl font-bold text-text">Hapus jadwal</h1>
          </div>
        </ModalHeader>
        <ModalBody>
          <p className="text-sm text-text">
            Apakah Anda yakin ingin menghapus jadwal untuk layanan{' '}
            <span className="font-semibold">{serviceName}</span> pada tanggal{' '}
            <span className="font-semibold">{scheduleDate}</span>? Tindakan
            ini tidak dapat dibatalkan.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} className="font-semibold">
            Batal
          </Button>
          <Button
            color="danger"
            className="font-semibold"
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
