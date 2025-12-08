import Head from "next/head";
import DashboardLayout from "@/components/layouts/Dashboard";
import { Scores } from "@features/admin/enrollments";

export default function AdminParticipantsInput() {
  return (
    <>
      <Head>
        <title>Input Nilai - Simpeka</title>
      </Head>
      <DashboardLayout>
        <Scores />
      </DashboardLayout>
    </>
  );
}
