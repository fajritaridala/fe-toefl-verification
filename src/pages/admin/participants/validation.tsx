import Head from "next/head";
import DashboardLayout from "@/components/layouts/Dashboard";
import { Validation } from "@features/admin/enrollments";

export default function AdminParticipantsValidation() {
  return (
    <>
      <Head>
        <title>Validasi Peserta - Simpeka</title>
      </Head>
      <DashboardLayout>
        <Validation />
      </DashboardLayout>
    </>
  );
}
