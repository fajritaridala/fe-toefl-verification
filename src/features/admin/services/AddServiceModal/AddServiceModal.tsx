import { Controller } from 'react-hook-form';
import { ServiceItem } from '@features/admin/services/service.types';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  NumberInput,
  Textarea,
} from '@heroui/react';
import useAddServiceModal from './useAddServiceModal';

type Props = {
  isOpen: boolean;
  mode: 'create' | 'edit';
  service?: ServiceItem | null;
  onClose: () => void;
  onSuccess?: () => void;
};

const AddServiceModal = ({
  isOpen,
  mode,
  service,
  onClose,
  onSuccess,
}: Props) => {
  const { control, errors, handleSubmit, isSubmitting } = useAddServiceModal({
    mode,
    service,
    isOpen,
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
  });

  const title = mode === 'create' ? 'Tambah Layanan' : 'Ubah Layanan';

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      size="lg"
      onClose={onClose}
      placement="center"
      className="px-3 py-6"
    >
      <ModalContent>
        {() => (
          <form onSubmit={handleSubmit} noValidate>
            <ModalHeader className="flex flex-col gap-1">
              <h1 className="text-text text-2xl font-bold">{title}</h1>
              <p className="text-text-muted text-sm">
                Isi informasi layanan secara lengkap sebelum menyimpan.
              </p>
            </ModalHeader>
            <ModalBody className="w-full">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    isRequired
                    variant="bordered"
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
                    variant="bordered"
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
                      variant="bordered"
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
            <ModalFooter className="flex w-full justify-center gap-3">
              <Button
                variant="flat"
                color="danger"
                onPress={onClose}
                className="w-1/3 font-semibold"
              >
                Batal
              </Button>
              <Button
                type="submit"
                color="primary"
                className="w-1/3 font-semibold text-white"
                isLoading={isSubmitting}
              >
                Simpan
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddServiceModal;
