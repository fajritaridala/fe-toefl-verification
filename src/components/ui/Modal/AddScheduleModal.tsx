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
  Select,
  SelectItem,
} from '@heroui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as yup from 'yup';
import { schedulesService } from '@/services/admin.service';
import { ScheduleItem, SchedulePayload } from '@/types/admin.types';

// ============ TYPES ============
export type ServiceOption = {
  label: string;
  value: string;
};

// ============ VALIDATION SCHEMA ============
const scheduleSchema: yup.ObjectSchema<SchedulePayload> = yup.object({
  serviceId: yup.string().required('Layanan wajib dipilih'),
  scheduleDate: yup.string().required('Tanggal jadwal wajib diisi'),
  startTime: yup.string().required('Waktu mulai wajib diisi'),
  endTime: yup.string().required('Waktu selesai wajib diisi'),
  capacity: yup
    .number()
    .typeError('Kuota harus berupa angka')
    .positive('Kuota harus lebih dari 0')
    .integer('Kuota harus berupa angka bulat')
    .optional(),
});

type ScheduleFormValues = SchedulePayload;

type UseAddScheduleModalProps = {
  mode: 'create' | 'edit';
  schedule?: ScheduleItem | null;
  isOpen: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

// ============ HELPER FUNCTIONS ============
const formatDateValue = (date?: string) => {
  if (!date) return '';
  if (date.includes('T')) {
    return date.split('T')[0] ?? '';
  }
  return date;
};

const formatTimeValue = (date?: string) => {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    if (date.includes('T')) {
      return date.split('T')[1]?.slice(0, 5) ?? '';
    }
    return date;
  }
  return parsed.toISOString().slice(11, 16);
};

// ============ HOOK ============
const useAddScheduleModal = ({
  mode,
  schedule,
  isOpen,
  onSuccess,
  onError,
}: UseAddScheduleModalProps) => {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ScheduleFormValues>({
    resolver: yupResolver(scheduleSchema),
    defaultValues: {
      serviceId: schedule?.serviceId || '',
      scheduleDate: formatDateValue(schedule?.scheduleDate),
      startTime: formatTimeValue(schedule?.startTime),
      endTime: formatTimeValue(schedule?.endTime),
      capacity: schedule?.quota ?? undefined,
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    reset({
      serviceId: schedule?.serviceId || '',
      scheduleDate: formatDateValue(schedule?.scheduleDate),
      startTime: formatTimeValue(schedule?.startTime),
      endTime: formatTimeValue(schedule?.endTime),
      capacity: schedule?.quota ?? undefined,
    });
  }, [schedule, reset, isOpen, mode]);

  const { mutate, isPending } = useMutation({
    mutationFn: (values: ScheduleFormValues) => {
      const payload: SchedulePayload = {
        ...values,
        capacity:
          typeof values.capacity === 'number' && !Number.isNaN(values.capacity)
            ? values.capacity
            : undefined,
      };

      if (mode === 'edit' && schedule?.scheduleId) {
        return schedulesService.updateSchedule(schedule.scheduleId, payload);
      }
      return schedulesService.createSchedule(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  const submit: SubmitHandler<ScheduleFormValues> = (values) => {
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
  schedule?: ScheduleItem | null;
  serviceOptions: ServiceOption[];
  onClose: () => void;
};

const AddScheduleModal = ({
  isOpen,
  mode,
  schedule,
  serviceOptions,
  onClose,
}: Props) => {
  const { control, errors, handleSubmit, isSubmitting } = useAddScheduleModal({
    mode,
    schedule,
    isOpen,
    onSuccess: onClose,
  });

  const title = mode === 'create' ? 'Tambah Jadwal' : 'Ubah Jadwal';
  const hasServiceOptions = serviceOptions.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      size="lg"
      onClose={onClose}
      placement="center"
      backdrop="blur"
      className="px-3 py-6"
    >
      <ModalContent>
        {() => (
          <Form onSubmit={handleSubmit} className="space-y-0">
            <ModalHeader className="flex flex-col gap-1">
              <h1 className="text-text text-2xl font-bold">{title}</h1>
              <p className="text-text-muted text-sm">
                Tentukan layanan, tanggal, serta kuota untuk jadwal TOEFL.
              </p>
            </ModalHeader>
            <ModalBody className="w-full space-y-4">
              <Controller
                name="serviceId"
                control={control}
                render={({ field }) => {
                  const { ref, value, onChange, ...restField } = field;
                  return (
                    <Select
                      {...restField}
                      ref={ref}
                      isRequired
                      variant="bordered"
                      label="Layanan"
                      labelPlacement="outside"
                      placeholder={
                        hasServiceOptions
                          ? 'Pilih layanan'
                          : 'Belum ada layanan tersedia'
                      }
                      selectedKeys={value ? [value] : []}
                      onSelectionChange={(keys) => {
                        const nextValue = Array.from(keys)[0]?.toString() ?? '';
                        onChange(nextValue);
                      }}
                      isDisabled={!hasServiceOptions}
                      isInvalid={!!errors.serviceId}
                      errorMessage={errors.serviceId?.message}
                    >
                      {serviceOptions.map((option) => (
                        <SelectItem key={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </Select>
                  );
                }}
              />

              <Controller
                name="scheduleDate"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="date"
                    isRequired
                    variant="bordered"
                    label="Tanggal jadwal"
                    labelPlacement="outside"
                    placeholder="Pilih tanggal pelaksanaan"
                    isInvalid={!!errors.scheduleDate}
                    errorMessage={errors.scheduleDate?.message}
                  />
                )}
              />

              <div className="grid gap-4 lg:grid-cols-2">
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="time"
                      isRequired
                      variant="bordered"
                      label="Waktu Mulai"
                      labelPlacement="outside"
                      placeholder="00:00"
                      isInvalid={!!errors.startTime}
                      errorMessage={errors.startTime?.message}
                    />
                  )}
                />

                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="time"
                      isRequired
                      variant="bordered"
                      label="Waktu Selesai"
                      labelPlacement="outside"
                      placeholder="00:00"
                      isInvalid={!!errors.endTime}
                      errorMessage={errors.endTime?.message}
                    />
                  )}
                />
              </div>

              <Controller
                name="capacity"
                control={control}
                render={({ field }) => {
                  const { ref, value, onChange, ...restField } = field;
                  return (
                    <NumberInput
                      {...restField}
                      ref={ref}
                      hideStepper
                      min={0}
                      variant="bordered"
                      label="Kuota (opsional)"
                      labelPlacement="outside"
                      placeholder="Masukkan jumlah kuota"
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
                      isInvalid={!!errors.capacity}
                      errorMessage={errors.capacity?.message}
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
                variant="solid"
                color="primary"
                className="w-1/3 font-semibold"
                isLoading={isSubmitting}
                isDisabled={!hasServiceOptions}
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

export default AddScheduleModal;
