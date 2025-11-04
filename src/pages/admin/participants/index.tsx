import DashboardLayout from '@/components/layouts/Dashboard';
import ParticipantsPage from '@/components/views/Admin/Participant';

function Participants() {
  return (
    <DashboardLayout title="Daftar peserta">
      <ParticipantsPage />
    </DashboardLayout>
  );
}

export default Participants;
