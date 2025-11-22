import DashboardLayout from '@/components/layouts/Dashboard';
import Participants from '@/components/views/Admin/Participant';

function AdminParticipants() {
  return (
    <DashboardLayout title="Daftar peserta">
      <Participants />
    </DashboardLayout>
  );
}

export default AdminParticipants;
