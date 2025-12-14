import Head from "next/head";
import Header from "@/components/common/Header";
import { VerificationResult } from "@features/verification";

export default function VerificationResultPage() {
  return (
    <>
      <Head>
        <title>Hasil Verifikasi - Simpeka</title>
      </Head>
      <Header title="verification result page" />
      <VerificationResult />
    </>
  );
}
