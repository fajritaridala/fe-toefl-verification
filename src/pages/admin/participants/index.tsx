import DashboardLayout from '@/components/layouts/Dashboard';
import Participants from '@/components/views/Admin/Participant';

function AdminParticipants() {
  return (
    <DashboardLayout
      title="Manajemen peserta"
      description="Kelola pesanan peserta, status pendaftaran, dan input nilai."
    >
      <Participants />
    </DashboardLayout>
  );
}

export default AdminParticipants;
