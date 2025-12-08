import type { Metadata } from "next";
import BaseLayout from "@/components/layouts/Base";
import Verification from "@features/verification";

export const metadata: Metadata = {
  title: "Verification",
};

export default function VerificationPage() {
  return (
    <BaseLayout title="verification page">
      <Verification />
    </BaseLayout>
  );
}
