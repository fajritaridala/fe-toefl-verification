import DashboardLayout from '@/components/layouts/Dashboard';
import PesertaDashboardPage from '@/components/views/Peserta/Dashboard';

function Dashboard() {
  return (
    <>
      <DashboardLayout
        title="Dashboard"
        type="peserta"
        description="Dashboard peserta"
      >
        <PesertaDashboardPage />
      </DashboardLayout>
    </>
  );
}

export default Dashboard;
