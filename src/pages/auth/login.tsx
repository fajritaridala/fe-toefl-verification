import Head from "next/head";
import AuthLayout from "@/components/layouts/Auth";
import { Login } from "@features/auth";

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login - Simpeka</title>
      </Head>
      <AuthLayout>
        <Login />
      </AuthLayout>
    </>
  );
}
