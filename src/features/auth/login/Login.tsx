import { Alert, Button } from '@heroui/react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import AuthCard from '@/components/ui/Card/Auth';
import { useLogin } from './useLogin';

const Login = () => {
  const router = useRouter();
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
            className="shadow-box border-danger-200 rounded-xl border bg-white/90 backdrop-blur-sm"
          />
        </div>
      )}
      <div className="w-lg">
        <Button
          variant="light"
          data-hover={false}
          onPress={() => router.back()}
          className="text-secondary hover:text-secondary/60 group mb-6 -ml-3 w-fit p-0"
          startContent={
            <ArrowLeft
              size={18}
              className="transform duration-300 group-hover:-translate-x-1"
            />
          }
        >
          Kembali
        </Button>
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
