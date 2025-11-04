import AuthLayout from '@/components/layouts/Auth';
import Login from '@/components/views/Auth/Login/Login';

const LoginPage = () => {
  return (
    <AuthLayout title="Login">
      <Login />
    </AuthLayout>
  );
};

export default LoginPage;
