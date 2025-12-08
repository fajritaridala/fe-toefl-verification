import type { Metadata } from "next";
import DashboardLayout from "@/components/layouts/Dashboard";
import ScoresPage from "@features/admin/enrollments/scores";

export const metadata: Metadata = {
  title: "Input nilai peserta",
  description: "Kelola nilai untuk peserta yang telah disetujui.",
};

export default function ParticipantsInputScorePage() {
  return (
    <DashboardLayout
      title="Input nilai peserta"
      description="Kelola nilai untuk peserta yang telah disetujui."
    >
      <ScoresPage />
    </DashboardLayout>
  );
}
