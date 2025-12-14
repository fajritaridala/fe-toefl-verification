import Head from "next/head";
import DashboardLayout from "@/components/layouts/Dashboard";
import { Services } from "@features/admin/services";

export default function AdminServices() {
  return (
    <>
      <Head>
        <title>Kelola Layanan - Simpeka</title>
      </Head>
      <DashboardLayout 
      title="Manajemen Layanan"
      description="Kelola jenis layanan tes yang tersedia."
    >
      <Services />
    </DashboardLayout>
    </>
  );
}
