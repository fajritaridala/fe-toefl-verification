import { Button, Card, CardBody, Alert, Spinner } from '@heroui/react';
import { useLogin } from './useLogin';
import AuthCard from '@/components/ui/Cards/AuthCard';

const LoginPage = () => {
  const { isLoading, alertOpen, setAlertOpen, alertMessage, handleLogin } =
    useLogin();

  return (
    <>
      {alertOpen && (
        <div className="fixed top-[1.5rem] left-1/2 z-50 w-full max-w-md -translate-x-1/2">
          <Alert
            color="default"
            title="Login Error"
            description={alertMessage}
            isClosable
            onClose={() => setAlertOpen(false)}
          />
        </div>
      )}
      <AuthCard
        heading="Login"
        buttonLabel="Connect MetaMask"
        isLoading={isLoading}
        handleOnPress={handleLogin}
      />
    </>
  );
};

export default LoginPage;
