import DashboardLayout from '@/components/layouts/Dashboard';
import ParticipantsPage from '@/components/views/Admin/Participants';

function AdminParticipantsInactive() {
  return (
    <DashboardLayout title='Belum Aktivasi' description='Halaman Belum Aktivasi menampilkan daftar peserta yang telah mendaftar namun belum melengkapi data atau nilai yang diperlukan'>
      <ParticipantsPage />
    </DashboardLayout>
  );
}

export default AdminParticipantsInactive;
