import Head from "next/head";
import DashboardLayout from "@/components/layouts/Dashboard";
import { Schedules } from "@features/admin/schedules";

export default function AdminSchedules() {
  return (
    <>
      <Head>
        <title>Kelola Jadwal - Simpeka</title>
      </Head>
      <DashboardLayout>
        <Schedules />
      </DashboardLayout>
    </>
  );
}
