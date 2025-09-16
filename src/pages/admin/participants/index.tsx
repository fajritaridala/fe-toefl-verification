import DashboardLayout from '@/components/layouts/Dashboard';
import ParticipantsPage from '@/components/views/Admin/Participants';

function Participants() {
  return (
    <DashboardLayout
      title="Daftar peserta"
      description="Menampilkan seluruh data peserta terdaftar dengan informasi lengkap"
    >
      <ParticipantsPage />
    </DashboardLayout>
  );
}

export default Participants;
