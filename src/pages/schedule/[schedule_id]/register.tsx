import Head from "next/head";
import BaseLayout from "@/components/layouts/Base";
import { Register } from "@features/service";

export const dynamic = 'force-dynamic';

export default function RegisterSchedulePage() {
  return (
    <>
      <Head>
        <title>Daftar Jadwal - Simpeka</title>
      </Head>
      <BaseLayout title="Daftar Jadwal">
        <Register />
      </BaseLayout>
    </>
  );
}
