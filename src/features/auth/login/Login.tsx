import { Alert } from '@heroui/react';
import AuthCard from '@/components/ui/Card/Auth';
import { useLogin } from './useLogin';

const Login = () => {
  const { isLoading, alertOpen, setAlertOpen, alertMessage, handleLogin } =
    useLogin();

  return (
    <>
      {alertOpen && (
        <div className="fixed top-6 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-4">
          <Alert
            color="danger"
            title="Gagal Masuk"
            description={alertMessage}
            isClosable
            onClose={() => setAlertOpen(false)}
            variant="faded"
            // Memastikan rounded-xl dan styling lainnya konsisten
            className="shadow-box border-danger-200 bg-white/90 rounded-xl border backdrop-blur-sm"
          />
        </div>
      )}
      <div className="w-lg">
        <AuthCard
          heading="Masuk"
          buttonLabel="Hubungkan MetaMask"
          isLoading={isLoading}
          handleOnPress={handleLogin}
        />
      </div>
    </>
  );
};

export default Login;