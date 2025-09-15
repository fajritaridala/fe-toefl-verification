import DashboardLayout from '@/components/layouts/Dashboard';
import AdminDashboardPage from '@/components/views/Admin/Dashboard';

function Dashboard() {
  return (
    <DashboardLayout
      title="dashboard"
      type="admin"
      description="Dashboard admin"
    >
      <AdminDashboardPage />
    </DashboardLayout>
  );
}

export default Dashboard;
