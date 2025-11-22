import { LuCalendar, LuDock, LuLayoutGrid, LuUsers } from 'react-icons/lu';

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
  {
    key: 'services',
    label: 'Layanan',
    href: '/admin/services',
    icon: <LuDock />,
  },
  {
    key: 'schedules',
    label: 'Jadwal',
    href: '/admin/schedules',
    icon: <LuCalendar />,
  },
];

export { SIDEBAR_ADMIN };
