import DashboardLayout from '@/components/layouts/Dashboard';
import Dashboard from '@/features/admin/dashboard';

export default function AdminDashboard() {
  return (
    <DashboardLayout title="Dashboard Admin - Simpeka">
      <Dashboard />
    </DashboardLayout>
  );
}
