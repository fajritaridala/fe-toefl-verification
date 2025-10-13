import { useSession } from 'next-auth/react';
import { SessionExt } from '@/utils/interfaces/Auth';

export default function useTOEFLPage() {
  const { data, status } = useSession();
  const session = data?.user as SessionExt;
  const user = session?.fullName as string;
  const isAuthenticated = status === 'authenticated';
  return {
    user,
    isAuthenticated,
  };
}
