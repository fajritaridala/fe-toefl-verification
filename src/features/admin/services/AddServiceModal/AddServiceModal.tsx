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
  NumberInput,
  Textarea,
} from '@heroui/react';
import { ServiceItem } from '@features/admin';
import useAddServiceModal from './useAddServiceModal';

type Props = {
  isOpen: boolean;
  mode: 'create' | 'edit';
  service?: ServiceItem | null;
  onClose: () => void;
};

const AddServiceModal = ({ isOpen, mode, service, onClose }: Props) => {
  const { control, errors, handleSubmit, isSubmitting } = useAddServiceModal({
    mode,
    service,
    isOpen,
    onSuccess: onClose,
  });

  const title = mode === 'create' ? 'Tambah Layanan' : 'Ubah Layanan';

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      size="lg"
      onClose={onClose}
      placement="center"
    >
      <ModalContent>
        {() => (
          <Form onSubmit={handleSubmit} className="space-y-0">
            <ModalHeader className="flex flex-col gap-1">
              <h1 className="text-text text-2xl font-bold">{title}</h1>
              <p className="text-text-muted text-sm">
                Isi informasi layanan secara lengkap sebelum menyimpan.
              </p>
            </ModalHeader>
            <ModalBody className="space-y-4">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    isRequired
                    label="Nama layanan"
                    labelPlacement="outside"
                    placeholder="Contoh: TOEFL ITP"
                    errorMessage={errors.name?.message}
                    isInvalid={!!errors.name}
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    isRequired
                    minRows={3}
                    label="Deskripsi"
                    labelPlacement="outside"
                    placeholder="Tuliskan deskripsi singkat layanan"
                    errorMessage={errors.description?.message}
                    isInvalid={!!errors.description}
                  />
                )}
              />

              <Controller
                name="price"
                control={control}
                render={({ field }) => {
                  const { ref, value, onChange, ...restField } = field;
                  return (
                    <NumberInput
                      {...restField}
                      ref={ref}
                      isRequired
                      hideStepper
                      min={0}
                      label="Harga (Rp)"
                      labelPlacement="outside"
                      placeholder="Masukkan harga"
                      value={
                        typeof value === 'number'
                          ? value
                          : value
                            ? Number(value)
                            : undefined
                      }
                      onValueChange={(nextValue) =>
                        onChange(
                          typeof nextValue === 'number' &&
                            !Number.isNaN(nextValue)
                            ? nextValue
                            : undefined
                        )
                      }
                      errorMessage={errors.price?.message}
                      isInvalid={!!errors.price}
                    />
                  );
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={onClose}
                className="font-semibold"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-primary font-semibold text-white"
                isLoading={isSubmitting}
              >
                Simpan
              </Button>
            </ModalFooter>
          </Form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddServiceModal;
