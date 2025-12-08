import type { Metadata } from "next";
import BaseLayout from "@/components/layouts/Base";
import Register from "@features/service/Schedule/Register";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <BaseLayout title="Register">
      <Register />
    </BaseLayout>
  );
}
