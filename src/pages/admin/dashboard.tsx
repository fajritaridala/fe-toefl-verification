import Head from "next/head";
import DashboardLayout from "@/components/layouts/Dashboard";
import { Dashboard } from "@features/admin/dashboard";

export default function AdminDashboard() {
  return (
    <>
      <Head>
        <title>Dashboard Admin - Simpeka</title>
      </Head>
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    </>
  );
}
