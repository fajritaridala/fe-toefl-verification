'use client';

import { ChangeEvent, useRef, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { enrollmentsService } from '@features/admin';
import { Gender, ScheduleRegister } from '@features/admin';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import * as yup from 'yup';

const scheduleRegisterSchema = yup.object().shape({
  fullName: yup.string().required('Nama lengkap wajib diisi'),
  birthDate: yup.string().required('Tanggal lahir wajib diisi'),
  gender: yup
    .mixed<Gender>()
    .oneOf(Object.values(Gender), 'Jenis kelamin tidak valid')
    .required('Jenis kelamin wajib diisi'),
  email: yup.string().email('Email tidak valid').required('Email wajib diisi'),
  phoneNumber: yup
    .number()
    .typeError('Nomor telepon harus berupa angka')
    .required('Nomor telepon wajib diisi'),
  nim: yup.string().required('NIM wajib diisi'),
  faculty: yup.string().required('Fakultas wajib diisi'),
  major: yup.string().required('Program studi wajib diisi'),
  paymentDate: yup.string().required('Tanggal pembayaran wajib diisi'),
  paymentProof: yup
    .mixed<File>()
    .nullable()
    .defined()
    .test(
      'fileRequired',
      'Bukti pembayaran wajib diunggah',
      (value) => value instanceof File
    ),
});

export function useScheduleRegister() {
  const router = useRouter();
  const params = useParams<{ schedule_id?: string }>();
  const schedule_id = params?.schedule_id ?? '';

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    message: string;
    type: 'success' | 'danger';
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ScheduleRegister>({
    resolver: yupResolver(scheduleRegisterSchema),
    defaultValues: {
      fullName: '',
      birthDate: '',
      gender: undefined,
      email: '',
      phoneNumber: undefined as number | undefined,
      nim: '',
      faculty: '',
      major: '',
      paymentDate: '',
      paymentProof: null,
    },
  });

  const paymentReceipt = watch('paymentProof');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setValue('paymentProof', e.target.files[0], { shouldValidate: true });
    }
  };

  const handleFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleGoBack = () => {
    router.back();
  };

  const { mutate: registerMutate } = useMutation({
    mutationFn: (payload: ScheduleRegister) =>
      enrollmentsService.register(schedule_id, payload),
    onSuccess: () => {
      setIsLoading(false);
      setAlert({
        isOpen: true,
        message: 'Pendaftaran berhasil! Anda akan dialihkan.',
        type: 'success',
      });
      reset();
      setTimeout(() => {
        router.push('/?success_registration=true');
      }, 2000);
    },
    onError: (
      error: Error & { response?: { data?: { meta?: { message?: string } } } }
    ) => {
      console.log(error);
      setIsLoading(false);

      // Check if error is due to duplicate schedule registration
      const errorMessage =
        error.response?.data?.meta?.message || error.message || '';
      console.log(errorMessage);

      const isDuplicateRegistration =
        errorMessage.toLowerCase().includes('already registered') ||
        errorMessage.toLowerCase().includes('sudah terdaftar') ||
        errorMessage.toLowerCase().includes('schedule') ||
        errorMessage.toLowerCase().includes('duplicate');

      setAlert({
        isOpen: true,
        message: isDuplicateRegistration
          ? 'Anda telah terdaftar pada jadwal ini sebelumnya.'
          : errorMessage || 'Pendaftaran gagal. Silakan coba lagi.',
        type: 'danger',
      });
    },
  });

  const handleRegister = (data: ScheduleRegister) => {
    setIsLoading(true);
    setAlert(null);
    registerMutate(data);
  };

  const onError = (errors: FieldErrors<ScheduleRegister>) => {
    console.error('Form Errors:', errors);
  };

  return {
    control,
    errors,
    isLoading,
    alert,
    setAlert,
    handleSubmit,
    handleRegister,
    onError,
    setValue,
    watch,
    handleGoBack,
    fileInputRef,
    paymentReceipt,
    handleFileChange,
    handleFilePicker,
  };
}
