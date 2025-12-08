import type { Metadata } from "next";
import AuthLayout from "@/components/layouts/Auth";
import RegisterPage from "@features/auth/Register/RegisterPage";

export const metadata: Metadata = {
  title: "Register",
};

export default function Register() {
  return (
    <AuthLayout title="Register">
      <RegisterPage />
    </AuthLayout>
  );
}
