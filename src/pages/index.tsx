import Head from "next/head";
import BaseLayout from "@/components/layouts/Base";
import { Home } from "@features/home";

export default function HomePage() {
  return (
    <>
      <BaseLayout title="Beranda">
        <Home />
      </BaseLayout>
    </>
  );
}
