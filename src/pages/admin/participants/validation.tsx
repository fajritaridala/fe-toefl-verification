import { Validation } from '@features/admin/enrollments';
import DashboardLayout from '@/components/layouts/Dashboard';

export default function AdminParticipantsValidation() {
  return (
    <>
      <DashboardLayout title="Validasi Peserta" description='Approve atau reject pendaftaran peserta baru'>
        <Validation />
      </DashboardLayout>
    </>
  );
}
