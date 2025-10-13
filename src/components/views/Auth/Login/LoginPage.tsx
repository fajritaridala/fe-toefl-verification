import { Alert, Button, Card, CardBody, Spinner } from '@heroui/react';
import AuthCard from '@/components/ui/Card/AuthCard';
import { useLogin } from './useLogin';

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
