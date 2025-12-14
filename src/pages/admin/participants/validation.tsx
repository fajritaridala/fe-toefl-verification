import { Validation } from '@features/admin/enrollments';
import DashboardLayout from '@/components/layouts/Dashboard';

export default function AdminParticipantsValidation() {
  return (
    <>
      <DashboardLayout
      title="Validasi Pendaftaran"
      description="Verifikasi bukti pembayaran dan berkas peserta."
    >
      <Validation />
    </DashboardLayout>
    </>
  );
}
