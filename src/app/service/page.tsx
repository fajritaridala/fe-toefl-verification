import type { Metadata } from "next";
import BaseLayout from "@/components/layouts/Base";
import Service from "@features/service";

export const metadata: Metadata = {
  title: "Layanan TOEFL",
};

export default function ServicePage() {
  return (
    <BaseLayout title="Layanan TOEFL">
      <Service />
    </BaseLayout>
  );
}
