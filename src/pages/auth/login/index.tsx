import AuthLayout from "@/components/layouts/Auth";
import LoginPage from "@/components/views/Auth/Login/LoginPage";

const Login = () => {
  return (
    <AuthLayout title="Login">
      <LoginPage />
    </AuthLayout>
  );
};

export default Login;
