import { BiSolidGridAlt, BiSolidUserDetail } from 'react-icons/bi';

const SIDEBAR_ADMIN = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: <BiSolidGridAlt />,
  },
  {
    key: 'daftar-peserta',
    label: 'Daftar Peserta',
    href: '/admin/participants',
    icon: <BiSolidUserDetail />,
  },
];
const SIDEBAR_PESERTA = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    href: '/peserta/dashboard',
    icon: <BiSolidGridAlt />,
  },
];

export { SIDEBAR_ADMIN, SIDEBAR_PESERTA };
