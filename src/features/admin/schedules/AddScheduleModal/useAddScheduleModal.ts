import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as yup from 'yup';
import { schedulesService } from '@features/admin';
import { ScheduleItem, SchedulePayload } from '@features/admin';

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

      if (mode === 'edit' && schedule?._id) {
        return schedulesService.updateSchedule(schedule._id, payload);
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

export default useAddScheduleModal;
