import type { Metadata } from "next";
import AuthLayout from "@/components/layouts/Auth";
import Login from "@features/auth/Login/Login";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <AuthLayout title="Login">
      <Login />
    </AuthLayout>
  );
}
