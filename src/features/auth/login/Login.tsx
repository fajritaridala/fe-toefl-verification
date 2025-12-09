import { Alert } from '@heroui/react';
import AuthCard from '@/components/ui/Card/Auth';
import { useLogin } from './useLogin';

const Login = () => {
  const { isLoading, alertOpen, setAlertOpen, alertMessage, handleLogin } =
    useLogin();

  return (
    <>
      {alertOpen && (
        <div className="fixed top-[1.5rem] left-1/2 z-50 w-full max-w-md -translate-x-1/2">
          <Alert
            color="danger"
            title="Login Error"
            description={alertMessage}
            isClosable
            onClose={() => setAlertOpen(false)}
            className="shadow-main rounded-sm"
          />
        </div>
      )}
      <div className="bg-primary absolute top-40 left-80 h-32 w-32 rounded-full blur-2xl" />
      <div className="bg-secondary absolute right-80 bottom-40 h-32 w-32 rounded-full blur-2xl" />
      <div className="w-lg">
        <AuthCard
          heading="Login"
          buttonLabel="Connect MetaMask"
          isLoading={isLoading}
          handleOnPress={handleLogin}
        />
      </div>
    </>
  );
};

export default Login;
