import DashboardLayout from '@/components/layouts/Dashboard';
import ParticipantsPage from '@/components/views/Admin/Participants';

function AdminParticipantsActive() {
  return (
    <DashboardLayout
      title="Sudah Aktivasi"
      description="Halaman Sudah Aktivasi menampilkan daftar peserta yang telah melengkapi seluruh proses pendaftaran, termasuk pengisian data dan nilai yang diperlukan"
    >
      <ParticipantsPage />
    </DashboardLayout>
  );
}

export default AdminParticipantsActive;
