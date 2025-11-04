import AuthLayout from '@/components/layouts/Auth';
import RegisterPage from '@/components/views/Auth/Register/RegisterPage';

const Register = () => {
  return (
    <AuthLayout title="Register">
      <RegisterPage />
    </AuthLayout>
  );
};

export default Register;