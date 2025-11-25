import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as yup from 'yup';
import schedulesService from '@/services/schedules.service';
import { ScheduleItem, SchedulePayload } from '@/utils/interfaces/Schedule';

const scheduleSchema: yup.ObjectSchema<SchedulePayload> = yup.object({
  service_id: yup.string().required('Layanan wajib dipilih'),
  schedule_date: yup.string().required('Tanggal jadwal wajib diisi'),
  quota: yup
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
      service_id: schedule?.service_id || '',
      schedule_date: formatDateValue(schedule?.schedule_date),
      quota: schedule?.quota ?? undefined,
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    reset({
      service_id: schedule?.service_id || '',
      schedule_date: formatDateValue(schedule?.schedule_date),
      quota: schedule?.quota ?? undefined,
    });
  }, [schedule, reset, isOpen, mode]);

  const { mutate, isPending } = useMutation({
    mutationFn: (values: ScheduleFormValues) => {
      const payload: SchedulePayload = {
        service_id: values.service_id,
        schedule_date: values.schedule_date,
        quota:
          typeof values.quota === 'number' && !Number.isNaN(values.quota)
            ? values.quota
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
