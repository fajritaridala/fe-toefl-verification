import Login from '@features/auth/login';
import AuthLayout from '@/components/layouts/Auth';

export default function LoginPage() {
  return (
    <>
      <AuthLayout title="Login - Simpeka">
        <Login />
      </AuthLayout>
    </>
  );
}
