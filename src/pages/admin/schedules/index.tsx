import { Schedules } from '@features/admin/schedules';
import DashboardLayout from '@/components/layouts/Dashboard';

export default function AdminSchedules() {
  return (
    <>
      <DashboardLayout
      title="Manajemen Jadwal"
      description="Atur jadwal tes dan kuota peserta."
    >
      <Schedules />
    </DashboardLayout>
    </>
  );
}
