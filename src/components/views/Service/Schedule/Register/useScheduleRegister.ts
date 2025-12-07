import { ChangeEvent, useRef, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import enrollmentsService from '@/services/enrollments.service';
import { ScheduleRegister } from '@/utils/interfaces/Schedule';

const scheduleRegisterSchema = yup.object().shape({
  fullName: yup.string().required('Nama lengkap wajib diisi'),
  gender: yup
    .string()
    .oneOf(['laki-laki', 'perempuan'], 'Jenis kelamin tidak valid')
    .required('Jenis kelamin wajib diisi'),
  email: yup.string().email('Email tidak valid').required('Email wajib diisi'),
  phoneNumber: yup.string().required('Nomor telepon wajib diisi'),
  nim: yup.string().required('NIM wajib diisi'),
  faculty: yup.string().required('Fakultas wajib diisi'),
  major: yup.string().required('Program studi wajib diisi'),
  paymentDate: yup.string().required('Tanggal pembayaran wajib diisi'),
  file: yup
    .mixed<File>()
    .required('Bukti pembayaran wajib diunggah')
    .nullable(),
});

export function useScheduleRegister() {
  const router = useRouter();
  const { schedule_id } = router.query as { schedule_id: string };

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
  } = useForm({
    resolver: yupResolver(scheduleRegisterSchema),
    defaultValues: {
      fullName: '',
      gender: undefined,
      email: '',
      phoneNumber: '',
      nim: '',
      faculty: '',
      major: '',
      paymentDate: '',
      file: null,
    },
  });

  const paymentReceipt = watch('file');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setValue('file', e.target.files[0], { shouldValidate: true });
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
        router.push('/service'); // Redirect to a success page or another relevant page
      }, 2000);
    },
    onError: (error) => {
      setIsLoading(false);
      setAlert({
        isOpen: true,
        message: error.message || 'Pendaftaran gagal. Silakan coba lagi.',
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
    setAlert({
      isOpen: true,
      message: 'Silakan periksa kembali data yang Anda masukkan.',
      type: 'danger',
    });
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
