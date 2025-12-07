import DashboardLayout from '@/components/layouts/Dashboard';
import Participants from '@/components/views/Admin/Participant';

function ParticipantsValidationPage() {
  return (
    <DashboardLayout
      title="Validasi pendaftaran"
      description="Tinjau dan setujui pendaftaran peserta yang masih menunggu."
    >
      <Participants fixedStatus="menunggu" />
    </DashboardLayout>
  );
}

export default ParticipantsValidationPage;
