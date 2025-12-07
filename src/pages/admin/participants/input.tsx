import DashboardLayout from '@/components/layouts/Dashboard';
import Participants from '@/components/views/Admin/Participant';

function ParticipantsInputScorePage() {
  return (
    <DashboardLayout
      title="Input nilai peserta"
      description="Kelola nilai untuk peserta yang telah disetujui."
    >
      <Participants fixedStatus="disetujui" />
    </DashboardLayout>
  );
}

export default ParticipantsInputScorePage;
