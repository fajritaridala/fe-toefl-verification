import type { Metadata } from "next";
import DashboardLayout from "@/components/layouts/Dashboard";
import AdminServicesPage from "@features/admin/Services";

export const metadata: Metadata = {
  title: "Manajemen layanan",
  description: "Kelola daftar layanan TOEFL yang tersedia untuk peserta.",
};

export default function Services() {
  return (
    <DashboardLayout
      title="Manajemen layanan"
      description="Kelola daftar layanan TOEFL yang tersedia untuk peserta."
    >
      <AdminServicesPage />
    </DashboardLayout>
  );
}
