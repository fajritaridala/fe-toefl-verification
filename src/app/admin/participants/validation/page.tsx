import type { Metadata } from "next";
import DashboardLayout from "@/components/layouts/Dashboard";
import ValidationPage from "@features/admin/enrollments/validation";

export const metadata: Metadata = {
  title: "Validasi pendaftaran",
  description: "Tinjau dan setujui pendaftaran peserta yang masih menunggu.",
};

export default function ParticipantsValidationPage() {
  return (
    <DashboardLayout
      title="Validasi pendaftaran"
      description="Tinjau dan setujui pendaftaran peserta yang masih menunggu."
    >
      <ValidationPage />
    </DashboardLayout>
  );
}
