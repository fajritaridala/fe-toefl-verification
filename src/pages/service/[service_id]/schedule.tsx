import Head from "next/head";
import BaseLayout from "@/components/layouts/Base";
import { Schedule } from "@features/service";

export const dynamic = 'force-dynamic';

export default function SchedulePage() {
  return (
    <>
      <Head>
        <title>Jadwal - Simpeka</title>
      </Head>
      <BaseLayout title="Jadwal">
        <Schedule />
      </BaseLayout>
    </>
  );
}
