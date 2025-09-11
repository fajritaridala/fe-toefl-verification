import { connectMetamaskWallet } from '@/utils/libs/metamask/connect';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { IRegister } from '@/utils/interfaces/Auth';
import authServices from '@/services/auth.service';
import { useRouter } from 'next/router';

const registerSchema = Yup.object().shape({
  fullName: Yup.string().required('Silahkan masukan nama lengkap kamu'),
  email: Yup.string()
    .email('Format email tidak valid')
    .required('Silahkan masukan alamat email kamu'),
  roleToken: Yup.string().optional(),
});

export function useRegister() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isAddress, setIsAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      roleToken: '',
    },
  });

  async function registerService(payload: IRegister) {
    try {
      const result = await authServices.register(payload);

      if (!result) {
        const error = result as Error;
        throw new Error(error.message);
      }
      return result;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error('Registration failed');
    }
  }

  const { mutate: mutateRegister, isPending } = useMutation({
    mutationFn: registerService,
    onSuccess() {
      router.push('/auth/login');
      reset();
    },
    onError(error) {
      setIsLoading(false);
      setError('root', {
        message: error.message,
      });
    },
  });

  async function connectMetamask() {
    try {
      setIsLoading(true);
      const { address } = await connectMetamaskWallet();
      if (address) {
        setIsConnected(true);
        setIsAddress(address);
        setAlertOpen(false);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      const err = error as Error;
      setAlertOpen(true);
      setAlertMessage(err.message);
    }
  }

  function handleRegister(data: Omit<IRegister, 'address'>) {
    setIsLoading(true);
    const payload = {
      address: isAddress,
      fullName: data.fullName,
      email: data.email,
      roleToken: data.roleToken || '',
    };
    console.log(payload);

    mutateRegister(payload);
  }

  return {
    connectMetamask,
    handleRegister,
    handleSubmit,
    control,
    isPending,
    alertOpen,
    alertMessage,
    isLoading,
    isConnected,
    errors,
  };
}
