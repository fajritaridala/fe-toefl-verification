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
    href: '/participants',
    icon: <BiSolidUserDetail />,
  },
  {
    key: 'belum-aktivasi',
    label: 'Belum Aktivasi',
    href: '/participants/status/pending',
    icon: <BiSolidUserX />,
  },
  {
    key: 'sudah-aktivasi',
    label: 'Sudah Aktivasi',
    href: '/participants/status/completed',
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
