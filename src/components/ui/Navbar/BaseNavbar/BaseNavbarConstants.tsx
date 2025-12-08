import { LuBookmark, LuLogOut, LuUser } from 'react-icons/lu';
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
    icon: <LuUser strokeWidth={2} className="text-sm" />,
    onPress: () => {
      router.push('/profile');
    },
  },
  {
    key: 'user_activity',
    label: 'Aktivitas saya',
    icon: <LuBookmark strokeWidth={2} className="text-sm" />,
    onPress: () => {
      router.push('/profile/activity');
    },
  },
  {
    key: 'logout',
    label: 'Logout',
    icon: <LuLogOut strokeWidth={2} className='text-sm' />,
    onPress: () => {
      signOut({ callbackUrl: '/auth/login' });
    },
  },
];

export { NAVBAR_ITEMS, NAVBAR_DROPDOWN_ITEMS };
