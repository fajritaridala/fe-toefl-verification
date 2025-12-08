import Head from "next/head";
import DashboardLayout from "@/components/layouts/Dashboard";
import { Participants } from "@features/admin/enrollments";

export default function AdminParticipants() {
  return (
    <>
      <Head>
        <title>Data Peserta - Simpeka</title>
      </Head>
      <DashboardLayout>
        <Participants />
      </DashboardLayout>
    </>
  );
}
