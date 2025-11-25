import DashboardLayout from '@/components/layouts/Dashboard/DashboardLayout';
import AdminSchedulesPage from '@/components/views/Admin/Schedules';

function Schedules() {
  return (
    <DashboardLayout
      title="Manajemen jadwal"
      description="Atur jadwal TOEFL dan pantau kapasitas peserta."
    >
      <AdminSchedulesPage />
    </DashboardLayout>
  );
}

export default Schedules;
