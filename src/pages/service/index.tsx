import Head from "next/head";
import BaseLayout from "@/components/layouts/Base";
import { Service } from "@features/service";

export default function ServicePage() {
  return (
    <>
      <Head>
        <title>Layanan - Simpeka</title>
      </Head>
      <BaseLayout title="Layanan">
        <Service />
      </BaseLayout>
    </>
  );
}
