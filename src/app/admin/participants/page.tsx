import type { Metadata } from "next";
import DashboardLayout from "@/components/layouts/Dashboard";
import Participants from "@features/admin/enrollments/participants";

export const metadata: Metadata = {
  title: "Manajemen peserta",
  description: "Kelola pesanan peserta, status pendaftaran, dan input nilai.",
};

export default function AdminParticipants() {
  return (
    <DashboardLayout
      title="Manajemen peserta"
      description="Kelola pesanan peserta, status pendaftaran, dan input nilai."
    >
      <Participants />
    </DashboardLayout>
  );
}
