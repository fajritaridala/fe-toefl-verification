import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  ScheduleItem,
  SchedulePayload,
} from '@features/admin/schedules/schedule.types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as yup from 'yup';
import { schedulesService } from '@/domain/schedule.services';

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

type UseEditScheduleModalProps = {
  schedule: ScheduleItem | null;
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

const useEditScheduleModal = ({
  schedule,
  isOpen,
  onSuccess,
  onError,
}: UseEditScheduleModalProps) => {
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
    if (!isOpen || !schedule) return;
    reset({
      serviceId: schedule.serviceId || '',
      scheduleDate: formatDateValue(schedule.scheduleDate),
      startTime: formatTimeValue(schedule.startTime),
      endTime: formatTimeValue(schedule.endTime),
      capacity: schedule.quota ?? undefined,
    });
  }, [schedule, reset, isOpen]);

  const { mutate, isPending } = useMutation({
    mutationFn: (values: ScheduleFormValues) => {
      const payload: SchedulePayload = {
        ...values,
        capacity:
          typeof values.capacity === 'number' && !Number.isNaN(values.capacity)
            ? values.capacity
            : undefined,
      };

      if (schedule?.scheduleId) {
        return schedulesService.updateSchedule(schedule.scheduleId, payload);
      }
      return Promise.reject(new Error('Schedule ID is missing'));
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

export default useEditScheduleModal;
