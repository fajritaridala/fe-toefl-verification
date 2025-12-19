import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
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
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as yup from 'yup';
import { servicesService } from '@/services/admin.service';
import { ServiceItem, ServicePayload } from '@/types/admin.types';

// ============ VALIDATION SCHEMA ============
const serviceSchema: yup.ObjectSchema<ServicePayload> = yup.object({
  name: yup.string().required('Nama layanan wajib diisi'),
  description: yup.string().required('Deskripsi wajib diisi'),
  price: yup
    .number()
    .typeError('Harga harus berupa angka')
    .positive('Harga harus lebih dari 0')
    .required('Harga wajib diisi'),
});

type ServiceFormValues = ServicePayload;

type UseAddServiceModalProps = {
  mode: 'create' | 'edit';
  service?: ServiceItem | null;
  isOpen: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

// ============ HOOK ============
const useAddServiceModal = ({
  mode,
  service,
  isOpen,
  onSuccess,
  onError,
}: UseAddServiceModalProps) => {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: yupResolver(serviceSchema),
    defaultValues: {
      name: service?.name || '',
      description: service?.description || '',
      price: service?.price ?? undefined,
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    reset({
      name: service?.name || '',
      description: service?.description || '',
      price: service?.price ?? undefined,
    });
  }, [service, reset, mode, isOpen]);

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: ServicePayload) => {
      if (mode === 'edit' && service?._id) {
        return servicesService.updateService(service._id, payload);
      }
      return servicesService.createService(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  const submit: SubmitHandler<ServiceFormValues> = (values) => {
    mutate(values);
  };

  return {
    control,
    errors,
    handleSubmit: handleSubmit(submit),
    isSubmitting: isPending,
  };
};

// ============ COMPONENT ============
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
      className="px-3 py-6"
    >
      <ModalContent>
        {() => (
          <Form onSubmit={handleSubmit}>
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
          </Form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddServiceModal;
