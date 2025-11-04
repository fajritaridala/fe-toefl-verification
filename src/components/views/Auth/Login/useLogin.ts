import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import randomize from '@/utils/config/randomize';
import { ILogin } from '@/utils/interfaces/Auth';
import metamask from '@/utils/libs/metamask/metamask';

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

  const loginService = async (address: string) => {
    const result = await signIn('credentials', {
      address,
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
      // wait for session to be hydrated after signIn
      async function waitForSession(maxTries = 3, delayMs = 150) {
        for (let attempt = 0; attempt < maxTries; attempt++) {
          const session = await getSession();
          if (session?.user) return session;
          await new Promise((r) => setTimeout(r, delayMs));
        }
        return await getSession();
      }

      const session = await waitForSession(3, 150);
      const user = session?.user as
        | {
            address?: string;
            needsRegistration?: boolean;
            role?: string;
          }
        | undefined;

      if (user?.needsRegistration && user.address) {
        const enc = await randomize.encrypt(user.address);
        await router.push({
          pathname: '/auth/register',
          query: { address: enc },
        });
        return;
      }

      if (user?.role === 'admin') {
        await router.push('/admin/dashboard');
        return;
      }
      if (user?.role === 'peserta') {
        await router.push('/toefl');
        return;
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
      const { address } = await metamask.connect();
      setAddress(address);
      await loginSchema.validate({ address });
      mutateLogin(address);
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
