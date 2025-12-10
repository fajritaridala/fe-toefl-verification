import { Schedules } from '@features/admin/schedules';
import DashboardLayout from '@/components/layouts/Dashboard';

export default function AdminSchedules() {
  return (
    <>
      <DashboardLayout title="Kelola jadwal">
        <Schedules />
      </DashboardLayout>
    </>
  );
}
