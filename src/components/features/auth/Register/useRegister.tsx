"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import authServices from '@features/auth/auth.service';
import randomize from '@/utils/config/randomize';
import { IRegister } from '@features/auth/auth.types';
import metamask from '@lib/metamask/metamask';

const registerSchema = Yup.object().shape({
  username: Yup.string().required('Silahkan masukan username kamu'),
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

  async function handleAddressQuery(chiperText: string) {
    const address = await randomize.decrypt(chiperText);
    return address;
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      username: '',
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
    async onSuccess(result) {
      const role = result?.data?.data?.role;
      try {
        const Result = await signIn('credentials', {
          address: isAddress,
          redirect: false,
        });

        if (Result?.ok) {
          if (role === 'admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/toefl');
          }
          reset();
        }
      } catch {
        router.push('/auth/login');
      }
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
      const { address } = await metamask.connect();
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
      username: data.username,
      email: data.email,
      roleToken: data.roleToken || '',
    };

    mutateRegister(payload);
  }

  return {
    connectMetamask,
    handleRegister,
    handleSubmit,
    control,
    isPending,
    alertOpen,
    setAlertOpen,
    alertMessage,
    isLoading,
    isConnected,
    errors,
    setIsConnected,
    setIsAddress,
    isAddress,
    handleAddressQuery,
  };
}
