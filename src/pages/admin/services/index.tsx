import DashboardLayout from '@/components/layouts/Dashboard';
import AdminServicesPage from '@/components/views/Admin/Services';

function Services() {
  return (
    <DashboardLayout
      title="Manajemen layanan"
      description="Kelola daftar layanan TOEFL yang tersedia untuk peserta."
    >
      <AdminServicesPage />
    </DashboardLayout>
  );
}

export default Services;
