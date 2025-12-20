'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import * as yup from 'yup';
import { enrollmentsService } from '@/domain/enroll.services';

const inputSchema = yup.object().shape({
  listening: yup.number().required('Nilai listening wajib diisi'),
  structure: yup.number().required('Nilai structure wajib diisi'),
  reading: yup.number().required('Nilai reading wajib diisi'),
});

type ScorePayload = {
  listening: number;
  structure: number;
  reading: number;
};

type UseAddInputModalProps = {
  enrollId: string;
  participantId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

function useAddInputModal({
  enrollId,
  participantId,
  onSuccess,
  onError,
}: UseAddInputModalProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(inputSchema),
  });

  const { mutate: AddInputMutate } = useMutation({
    mutationFn: (payload: ScorePayload) =>
      enrollmentsService.submitScore(enrollId, participantId, payload),
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
      console.error('Input error:', error);
    },
  });

  function handleInput(payload: ScorePayload) {
    AddInputMutate(payload);
  }

  return {
    control,
    handleSubmit,
    handleInput,
    errors,
  };
}

export default useAddInputModal;
