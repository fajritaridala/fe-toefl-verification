import Head from "next/head";
import BaseLayout from "@/components/layouts/Base";
import { Verification } from "@features/verification";

export default function VerificationPage() {
  return (
    <>
      <Head>
        <title>Verifikasi Sertifikat - Simpeka</title>
      </Head>
      <BaseLayout title="Verifikasi Sertifikat">
        <Verification />
      </BaseLayout>
    </>
  );
}
