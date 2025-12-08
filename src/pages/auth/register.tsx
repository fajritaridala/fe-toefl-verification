import Head from "next/head";
import AuthLayout from "@/components/layouts/Auth";
import { Register } from "@features/auth";

export default function RegisterPage() {
  return (
    <>
      <Head>
        <title>Register - Simpeka</title>
      </Head>
      <AuthLayout>
        <Register />
      </AuthLayout>
    </>
  );
}
