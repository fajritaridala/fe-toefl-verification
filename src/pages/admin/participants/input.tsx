import { Scores } from '@features/admin/enrollments';
import DashboardLayout from '@/components/layouts/Dashboard';

export default function AdminParticipantsInput() {
  return (
    <>
      <DashboardLayout title="Input nilai">
        <Scores />
      </DashboardLayout>
    </>
  );
}
