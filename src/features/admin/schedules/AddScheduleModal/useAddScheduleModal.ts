import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { SchedulePayload } from '@features/admin/schedules/schedule.types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as yup from 'yup';
import { schedulesService } from '@/domain/schedule.services';
import { ScheduleItem } from '../schedule.types';

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
  isOpen: boolean;
  mode: 'create' | 'edit';
  schedule?: ScheduleItem | null;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

const useAddScheduleModal = ({
  isOpen,
  mode,
  schedule,
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
    mode: 'onTouched',
    defaultValues: {
      serviceId: schedule?.serviceId || '',
      scheduleDate: schedule?.scheduleDate
        ? new Date(schedule.scheduleDate).toISOString().split('T')[0]
        : '',
      startTime: schedule?.startTime || '09:00',
      endTime: schedule?.endTime || '11:00',
      capacity: schedule?.quota ?? undefined,
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    reset({
      serviceId: schedule?.serviceId || '',
      scheduleDate: schedule?.scheduleDate
        ? new Date(schedule.scheduleDate).toISOString().split('T')[0]
        : '',
      startTime: schedule?.startTime || '09:00',
      endTime: schedule?.endTime || '11:00',
      capacity: schedule?.quota ?? undefined,
    });
  }, [reset, isOpen, schedule, mode]);

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

export default useAddScheduleModal;
