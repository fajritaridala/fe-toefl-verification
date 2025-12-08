import { useSession } from 'next-auth/react';
import { SessionExt } from '@features/auth';

const useUserSession = () => {
  const session = useSession();
  const data = session.data as SessionExt;
  const isAuthenticated = session.status === 'authenticated';
  return { data, isAuthenticated };
};

export default useUserSession;
