import DashboardLayout from '@/components/layouts/Dashboard';
import Dashboard from '@/features/admin/dashboard';

export default function AdminDashboard() {
  return (
    <DashboardLayout 
      title="Overview Dashboard"
      description="Ringkasan statistik dan aktivitas terbaru Simpeka."
    >
      <Dashboard />
    </DashboardLayout>
  );
}
