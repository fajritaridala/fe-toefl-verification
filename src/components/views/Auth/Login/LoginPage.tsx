import { Button, Card, CardBody, Alert, Spinner } from '@heroui/react';
import { useLogin } from './useLogin';

const LoginPage = () => {
  const { isLoading, alertOpen, setAlertOpen, alertMessage, handleLogin } =
    useLogin();

  return (
    <section className="flex h-screen items-center justify-center">
      {alertOpen && (
        <div className="fixed top-[1.5rem] left-1/2 z-50 w-full max-w-md -translate-x-1/2">
          <Alert
            color="danger"
            title="Login Error"
            description={alertMessage}
            isClosable
            onClose={() => setAlertOpen(false)}
          />
        </div>
      )}
      <Card className="flex h-[20vh] w-[30%] items-center justify-center">
        <CardBody className="flex items-center justify-center gap-[1.5rem]">
          <h1 className="text-primary text-3xl font-bold">Sign in</h1>
          <Button
            color="primary"
            variant="ghost"
            className="w-[80%]"
            onPress={handleLogin}
          >
            {isLoading ? (
              <Spinner variant="gradient" />
            ) : (
              'Connect with metamask'
            )}
          </Button>
        </CardBody>
      </Card>
    </section>
  );
};

export default LoginPage;
