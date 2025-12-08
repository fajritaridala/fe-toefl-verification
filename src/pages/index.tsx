import Head from "next/head";
import BaseLayout from "@/components/layouts/Base";
import { Home } from "@features/home";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Beranda - Simpeka</title>
        <meta
          name="description"
          content="Platform tes TOEFL dengan verifikasi blockchain"
        />
      </Head>
      <BaseLayout title="Beranda">
        <Home />
      </BaseLayout>
    </>
  );
}
