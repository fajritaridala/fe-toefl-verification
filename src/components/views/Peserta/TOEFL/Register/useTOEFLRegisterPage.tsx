import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import toeflService from '@/services/toefl.service';
import { SessionExt } from '@/utils/interfaces/Auth';
import { ToeflRegister } from '@/utils/interfaces/Toefl';

const TOEFLRegisterSchema = yup.object().shape({
  nama_lengkap: yup.string().required('Nama lengkap harus diisi'),
  jenis_kelamin: yup.string().required('Jenis kelamin harus dipilih'),
  tanggal_lahir: yup.string().required('Tanggal lahir harus diisi'),
  nomor_induk_mahasiswa: yup
    .string()
    .required('Nomor induk mahasiswa harus diisi'),
  fakultas: yup.string().required('Fakultas harus diisi'),
  program_studi: yup.string().required('Program studi harus diisi'),
  sesi_tes: yup.string().required('Sesi tes harus dipilih'),
});

function useTOEFLRegisterPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const sessionExt = session as SessionExt;
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: yupResolver(TOEFLRegisterSchema),
    defaultValues: {
      nama_lengkap: '',
      jenis_kelamin: '',
      tanggal_lahir: '',
      nomor_induk_mahasiswa: '',
      fakultas: '',
      program_studi: '',
      sesi_tes: '',
    },
  });

  async function registerService(payload: ToeflRegister) {
    try {
      const address = sessionExt?.user?.address;
      console.log(address)
      if (!address) {
        throw new Error('User address not found');
      }

      const result = await toeflService.register(payload, address);
      return result;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('Registration failed');
    }
  }

  const { mutate: mutateRegister, isPending } = useMutation({
    mutationFn: registerService,
    async onSuccess() {
      setIsLoading(false);
      setAlertOpen(false);
      reset();
      // Redirect to success page or dashboard
      router.push('/peserta/dashboard');
    },
    onError(error) {
      setIsLoading(false);
      setAlertOpen(true);
      setAlertMessage(error.message || 'Terjadi kesalahan saat mendaftar');
      setError('root', {
        message: error.message,
      });
    },
  });

  function handleRegister(data: ToeflRegister) {
    setIsLoading(true);
    mutateRegister(data);
  }

  return {
    control,
    handleSubmit,
    handleRegister,
    errors,
    isLoading: isLoading || isPending,
    alertOpen,
    setAlertOpen,
    alertMessage,
  };
}

export { useTOEFLRegisterPage };
