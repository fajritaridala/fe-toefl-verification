import { Participants } from '@features/admin/enrollments';
import DashboardLayout from '@/components/layouts/Dashboard';

export default function AdminParticipants() {
  return (
    <>
      <DashboardLayout title="Data Peserta - Simpeka">
        <Participants />
      </DashboardLayout>
    </>
  );
}
