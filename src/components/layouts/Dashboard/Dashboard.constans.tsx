import { BiSolidGridAlt, BiSolidUserDetail } from 'react-icons/bi';
import { LuLayoutGrid, LuUsers } from 'react-icons/lu';

const SIDEBAR_ADMIN = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: <LuLayoutGrid />,
  },
  {
    key: 'daftar-peserta',
    label: 'Daftar Peserta',
    href: '/admin/participants',
    icon: <LuUsers />,
  },
];

export { SIDEBAR_ADMIN };
