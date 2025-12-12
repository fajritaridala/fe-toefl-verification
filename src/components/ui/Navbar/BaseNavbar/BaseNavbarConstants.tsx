import { FileCheck, User, Bookmark, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

type RouterLike = {
  push: (href: string) => void;
};

const NAVBAR_ITEMS = [
  { label: 'Beranda', href: '/' },
  { label: 'Layanan', href: '/service' },
  { label: 'Verifikasi', href: '/verification' },
];

const NAVBAR_DROPDOWN_ITEMS = (router: RouterLike) => [
  {
    key: 'user_profile',
    label: 'Profil saya',
    icon: <User strokeWidth={2} className="h-4 w-4" />,
    onPress: () => {
      router.push('/profile');
    },
  },
  {
    key: 'user_activity',
    label: 'Aktivitas saya',
    icon: <Bookmark strokeWidth={2} className="h-4 w-4" />,
    onPress: () => {
      router.push('/profile/activity');
    },
  },
  {
    key: 'user_certificates',
    label: 'Sertifikat saya',
    icon: <FileCheck strokeWidth={2} className="h-4 w-4" />,
    onPress: () => {
      router.push('/certificate');
    },
  },
  {
    key: 'logout',
    label: 'Logout',
    icon: <LogOut strokeWidth={2} className='h-4 w-4' />,
    onPress: () => {
      signOut({ callbackUrl: '/auth/login' });
    },
  },
];

export { NAVBAR_ITEMS, NAVBAR_DROPDOWN_ITEMS };
