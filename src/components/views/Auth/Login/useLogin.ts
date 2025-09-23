import { connectMetamaskWallet } from '@/utils/libs/metamask/connect';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { ILogin } from '@/utils/interfaces/Auth';
import { getSession, signIn } from 'next-auth/react';

const loginSchema = Yup.object().shape({
  address: Yup.string().required('Address is required'),
});

export const useLogin = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [address, setAddress] = useState('');
  const callbackUrl: string = (router.query.callbackUrl as string) || '/';

  const loginService = async (payload: ILogin) => {
    const result = await signIn('credentials', {
      ...payload,
      redirect: false,
      callbackUrl,
    });

    if (result === undefined) throw new Error('undefined');
    if (!result.ok && result.status === 401) throw new Error('Login failed!');
    return result;
  };

  const { mutate: mutateLogin } = useMutation({
    mutationFn: loginService,
    async onSuccess() {
      const session = await getSession();
      const user = session?.user as {
        address: string;
        needsRegistration: boolean;
        role: string;
      };
      console.log(user);
      if (user.needsRegistration) {
        router.push(`auth/register?address=${user.address}`);
      }
      if (user?.role === 'admin') {
        router.push('/admin/dashboard');
      }
      if (user?.role === 'peserta') {
        router.push('/participant/dashboard');
      }
    },
    onError(error) {
      setIsLoading(false);
      setAlertOpen(true);
      const err = error as Error;
      setAlertMessage(err.message);
    },
  });

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setAlertOpen(false);
      const { address } = await connectMetamaskWallet();
      setAddress(address);
      await loginSchema.validate({ address });
      mutateLogin({ address });
    } catch (error) {
      setIsLoading(false);
      const err = error as Error;
      setAlertOpen(true);
      setAlertMessage(err.message);
    }
  };

  return {
    handleLogin,
    alertOpen,
    setAlertOpen,
    alertMessage,
    isLoading,
    address,
  };
};
