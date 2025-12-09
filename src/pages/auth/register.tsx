import Register from '@features/auth/register';
import AuthLayout from '@/components/layouts/Auth';

export default function RegisterPage() {
  return (
    <>
      <AuthLayout title="Register - Simpeka">
        <Register />
      </AuthLayout>
    </>
  );
}
