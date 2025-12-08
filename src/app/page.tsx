import type { Metadata } from "next";
import BaseLayout from "@/components/layouts/Base";
import Home from "@features/home";

export const metadata: Metadata = {
  title: "Beranda",
};

export default function HomePage() {
  return (
    <BaseLayout title="Beranda">
      <Home />
    </BaseLayout>
  );
}
