import {
  BiSolidGridAlt,
  BiSolidUserCheck,
  BiSolidUserDetail,
  BiSolidUserX,
} from 'react-icons/bi';

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
  {
    key: 'belum-aktivasi',
    label: 'Belum Aktivasi',
    href: '/admin/participants/status/inactive',
    icon: <BiSolidUserX />,
  },
  {
    key: 'sudah-aktivasi',
    label: 'Sudah Aktivasi',
    href: '/admin/participants/status/active',
    icon: <BiSolidUserCheck />,
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
