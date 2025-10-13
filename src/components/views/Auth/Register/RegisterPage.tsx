import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import {
  Alert,
  Button,
  Card,
  CardBody,
  Form,
  Input,
  Spinner,
} from '@heroui/react';
import { useRouter } from 'next/router';
import AuthCard from '@/components/ui/Card/AuthCard';
import { useRegister } from '../Register/useRegister';

const RegisterPage = () => {
  const router = useRouter();
  const addressQuery = router.query.address as string;
  const {
    connectMetamask,
    handleRegister,
    handleSubmit,
    control,
    alertOpen,
    setAlertOpen,
    alertMessage,
    isLoading,
    isConnected,
    errors,
    setIsConnected,
    setIsAddress,
    handleAddressQuery,
  } = useRegister();

  useEffect(() => {
    const handleDecrypt = async () => {
      if (addressQuery) {
        try {
          const decrypted = await handleAddressQuery(addressQuery);
          setIsAddress(decrypted);
          setIsConnected(true); // anggap kalau ada address, berarti sudah "connect"
        } catch (error) {
          console.error('Gagal decrypt address dari query:', error);
        }
      }
    };

    handleDecrypt();
  }, [addressQuery, handleAddressQuery, setIsAddress, setIsConnected]);

  function onError() {
    console.log(errors);
  }

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

      <div className="flex min-h-screen w-full items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        {!isConnected ? (
          <div className="flex w-full max-w-md md:max-w-lg lg:max-w-xl">
            <div className="mx-auto">
              <AuthCard
                heading="Sign Up"
                buttonLabel="Connect MetaMask"
                isLoading={isLoading}
                handleOnPress={connectMetamask}
              />
            </div>
          </div>
        ) : (
          <Card className="w-full max-w-md p-4 md:max-w-lg md:p-6 lg:max-w-xl lg:p-8">
            <CardBody className="space-y-6">
              <h1 className="text-primary-800 text-center text-2xl font-bold md:text-3xl">
                Sign Up
              </h1>
              <Form onSubmit={handleSubmit(handleRegister, onError)}>
                <div className="w-full space-y-8 md:space-y-10">
                  <Controller
                    name="fullName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        isRequired
                        label="Fullname"
                        labelPlacement="outside"
                        placeholder="Enter your fullname"
                        type="text"
                        variant="bordered"
                        autoComplete="off"
                        isInvalid={!!errors.fullName}
                        errorMessage={errors.fullName?.message}
                      />
                    )}
                  />
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        isRequired
                        label="Email"
                        labelPlacement="outside"
                        placeholder="Enter your email"
                        type="email"
                        variant="bordered"
                        autoComplete="off"
                        isInvalid={!!errors.email}
                        errorMessage={errors.email?.message}
                      />
                    )}
                  />
                  <Controller
                    name="roleToken"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Role Token"
                        labelPlacement="outside"
                        placeholder="optional"
                        type="text"
                        variant="bordered"
                        autoComplete="off"
                        isInvalid={!!errors.roleToken}
                        errorMessage={errors.roleToken?.message}
                      />
                    )}
                  />
                </div>
                <Button
                  color="primary"
                  type="submit"
                  variant="solid"
                  className="text-md bg-primary-800 mt-6 w-full font-semibold text-white"
                >
                  {isLoading ? (
                    <Spinner
                      variant="wave"
                      color="current"
                      className="text-white"
                    />
                  ) : (
                    'submit'
                  )}
                </Button>
              </Form>
            </CardBody>
          </Card>
        )}
      </div>
    </>
  );
};

export default RegisterPage;
