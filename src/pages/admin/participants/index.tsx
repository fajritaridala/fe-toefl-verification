import { Participants } from '@features/admin/enrollments';
import DashboardLayout from '@/components/layouts/Dashboard';

export default function AdminParticipants() {
  return (
    <>
      <DashboardLayout title="Daftar Pendaftar">
        <Participants />
      </DashboardLayout>
    </>
  );
}
