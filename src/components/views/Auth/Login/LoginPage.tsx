import { Button, Card, CardBody, Alert, Spinner } from '@heroui/react';
import { useLogin } from './useLogin';

function extractMessage(err: unknown) {
  if (typeof err === 'string') return err;
  if (err && typeof err === 'object' && 'message' in err)
    return (err as any).message as string;
  return 'Unexpected error';
}

const LoginPage = () => {
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
          />
        </div>
      )}
      <Card className="flex h-[20vh] w-[30%] items-center justify-center">
        <CardBody className="flex items-center justify-center gap-[1.5rem]">
          <h1 className="text-2xl font-bold">Sign in</h1>
          <Button
            color="primary"
            variant="ghost"
            className="w-[80%]"
            onPress={handleLogin}
          >
            {isLoading ? <Spinner variant="gradient" /> : 'Login with metamask'}
          </Button>
        </CardBody>
      </Card>
    </>
  );
};

export default LoginPage;
