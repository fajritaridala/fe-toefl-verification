import type { Metadata } from "next";
import DashboardLayout from "@/components/layouts/Dashboard/DashboardLayout";
import AdminSchedulesPage from "@features/admin/Schedules";

export const metadata: Metadata = {
  title: "Manajemen jadwal",
  description: "Atur jadwal TOEFL dan pantau kapasitas peserta.",
};

export default function Schedules() {
  return (
    <DashboardLayout
      title="Manajemen jadwal"
      description="Atur jadwal TOEFL dan pantau kapasitas peserta."
    >
      <AdminSchedulesPage />
    </DashboardLayout>
  );
}
