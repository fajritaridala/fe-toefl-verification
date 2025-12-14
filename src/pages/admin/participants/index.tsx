import { Participants } from '@features/admin/enrollments';
import DashboardLayout from '@/components/layouts/Dashboard';

export default function AdminParticipants() {
  return (
    <>
      <DashboardLayout 
      title="Manajemen Peserta"
      description="Kelola data pendaftar dan status pendaftaran."
    >
      <Participants />
    </DashboardLayout>
    </>
  );
}
