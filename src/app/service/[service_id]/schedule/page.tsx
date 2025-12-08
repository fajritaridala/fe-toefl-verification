import type { Metadata } from "next";
import BaseLayout from "@/components/layouts/Base";
import Schedule from "@features/service/Schedule";

export const metadata: Metadata = {
  title: "Jadwal",
};

export default function SchedulePage() {
  return (
    <BaseLayout title="Jadwal">
      <Schedule />
    </BaseLayout>
  );
}
