import { LuLogOut, LuUserRound } from 'react-icons/lu';

const NAVBAR_ITEMS = [
  { label: 'Beranda', href: '/'},
  { label: 'Layanan', href: '/peserta/toefl' },
];

const NAVBAR_DROPDOWN_ITEMS = (router: any, signOut: any) => [
  {
    key: 'user_profile',
    label: 'Profile saya',
    onPress: () => router.push('/profile'),
    icon: <LuUserRound />,
  },
  {
    key: 'logout',
    label: 'Logout',
    onPress: () => signOut({ callbackUrl: '/auth/login' }),
    icon: <LuLogOut />,
  },
];

export { NAVBAR_ITEMS, NAVBAR_DROPDOWN_ITEMS };
