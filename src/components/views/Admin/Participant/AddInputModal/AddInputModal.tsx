import { Controller } from 'react-hook-form';
import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import useAddInputModal from './useAddInputModal';

type Props = {
  isOpen: boolean;
  address: string;
  onClose: () => void;
};

function AddInputModal(props: Props) {
  const { isOpen, address, onClose } = props;
  const { control, handleInput, handleSubmit, errors } = useAddInputModal({ 
    address, 
    onSuccess: () => onClose(), // Close modal on success
    onError: () => {
      // Keep modal open on error, let user fix the inputs
    } 
  });
  
  const onSubmit = handleSubmit((data) => {
    handleInput(data);
    // Note: The modal will be closed by the parent component on success
  });
  
  return (
    <Modal isOpen={isOpen} size="md" onClose={onClose}>
      <ModalContent>
        {(modalOnClose) => (
          <Form onSubmit={onSubmit}>
            <ModalHeader className="h-12 text-xl">
              Input Nilai Peserta
            </ModalHeader>
            <ModalBody className="w-full">
              <Controller
                name="nilai_listening"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value?.toString() || ''}
                    isRequired
                    label="Listening"
                    labelPlacement="outside"
                    placeholder="Masukan nilai"
                    type="number"
                    min={0}
                    max={100}
                    errorMessage={errors.nilai_listening?.message}
                    isInvalid={!!errors.nilai_listening}
                  />
                )}
              />
              <Controller
                name="nilai_structure"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value?.toString() || ''}
                    isRequired
                    label="Structure"
                    labelPlacement="outside"
                    placeholder="Masukan nilai"
                    type="number"
                    min={0}
                    max={100}
                    errorMessage={errors.nilai_structure?.message}
                    isInvalid={!!errors.nilai_structure}
                  />
                )}
              />
              <Controller
                name="nilai_reading"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value?.toString() || ''}
                    isRequired
                    label="Reading"
                    labelPlacement="outside"
                    placeholder="Masukan nilai"
                    type="number"
                    min={0}
                    max={100}
                    errorMessage={errors.nilai_reading?.message}
                    isInvalid={!!errors.nilai_reading}
                  />
                )}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="ghost" onPress={onClose}>
                Batal
              </Button>
              <Button type="submit" className="bg-black text-white">
                Simpan
              </Button>
            </ModalFooter>
          </Form>
        )}
      </ModalContent>
    </Modal>
  );
}

export default AddInputModal;
