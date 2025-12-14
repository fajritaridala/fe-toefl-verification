import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from '@heroui/react';
import { ServiceItem } from '@features/admin';
import useDeleteServiceModal from './useDeleteServiceModal';
import { Trash2 } from 'lucide-react';

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
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
              duration: 0.4,
              ease: "easeOut",
            },
          },
          exit: {
            y: 20,
            opacity: 0,
            scale: 0.95,
            transition: {
              duration: 0.3,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        <ModalBody className="flex flex-col items-center justify-center py-8">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-danger-50 text-danger shadow-sm ring-8 ring-danger-50/50">
            <Trash2 size={32} strokeWidth={2.5} />
          </div>

          <h3 className="mb-2 text-center text-xl font-bold text-gray-900">
            Hapus Layanan ini?
          </h3>

          <p className="max-w-[85%] text-center text-sm text-gray-500">
            Anda akan menghapus layanan{' '}
            <span className="font-bold text-gray-900">
              &quot;{service?.name}&quot;
            </span>
            . Data yang sudah dihapus tidak dapat dikembalikan lagi.
          </p>
        </ModalBody>
        <ModalFooter className="flex w-full justify-center gap-3 pb-8 pt-0">
          <Button
            variant="flat"
            onPress={onClose}
            className="w-1/3 font-semibold text-gray-700 hover:bg-gray-100"
          >
            Batal
          </Button>
          <Button
            color="danger"
            className="w-1/3 font-semibold shadow-md shadow-danger/20"
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
