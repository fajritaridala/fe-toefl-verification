import {
  Alert,
  Button,
  Card,
  CardBody,
  Form,
  Input,
  Spinner,
} from '@heroui/react';
import { useRegister } from '../Register/useRegister';
import { Controller } from 'react-hook-form';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AuthCard from '@/components/ui/Cards/AuthCard';

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

      {!isConnected ? (
        <AuthCard
          heading="Register"
          buttonLabel="Connect MetaMask"
          isLoading={isLoading}
          handleOnPress={connectMetamask}
        />
      ) : (
        <Card className="px-[.8rem] py-[.8rem]">
          <CardBody className="gap-[1.5rem] text-center">
            <h1 className="text-3xl font-bold text-black">Register</h1>
            <Form onSubmit={handleSubmit(handleRegister, onError)}>
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
              <Button
                color="primary"
                type="submit"
                variant="solid"
                className="text-md my-[1rem] w-full bg-black font-semibold text-white"
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
    </>
  );
};

export default RegisterPage;
