import type { Metadata } from "next";
import Header from "@/components/common/Header";
import VerificationResult from "@features/verification/Result";

export const metadata: Metadata = {
  title: "Verification Result",
};

export default function VerificationResultPage() {
  return (
    <>
      <Header title="verification result page" />
      <VerificationResult />
    </>
  );
}
