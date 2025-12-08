import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { ServiceItem } from '@features/admin/admin.types';
import useDeleteServiceModal from './useDeleteServiceModal';

type Props = {
  isOpen: boolean;
  service?: ServiceItem | null;
  onClose: () => void;
};

const DeleteServiceModal = ({ isOpen, service, onClose }: Props) => {
  const { deleteService, isDeleting } = useDeleteServiceModal({
    onSuccess: onClose,
  });

  const handleDelete = () => {
    if (!service?._id) return;
    deleteService(service._id);
  };

  return (
    <Modal
      backdrop='blur'
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
    >
      <ModalContent>
        <ModalHeader>
          <div>
            <p className="text-small text-text-muted uppercase tracking-[0.25rem]">
              Konfirmasi
            </p>
            <h1 className="text-2xl font-bold text-text">Hapus layanan</h1>
          </div>
        </ModalHeader>
        <ModalBody>
          <p className="text-text text-sm">
            Apakah Anda yakin ingin menghapus layanan{' '}
            <span className="font-semibold">{service?.name}</span>? Tindakan ini
            tidak dapat dibatalkan.
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

export default DeleteServiceModal;
