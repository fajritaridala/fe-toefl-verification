
import BaseLayout from "@/components/layouts/Base";
import { Verification } from "@features/verification";

export default function VerificationPage() {
  return (
    <>
      <BaseLayout title="Verifikasi Sertifikat">
        <Verification />
      </BaseLayout>
    </>
  );
}
