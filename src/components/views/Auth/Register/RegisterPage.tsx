import {
  Alert,
  Button,
  Card,
  CardBody,
  cn,
  Form,
  Input,
  Spinner,
} from '@heroui/react';
import { useRegister } from '../Register/useRegister';
import { Controller } from 'react-hook-form';

const RegisterPage = () => {
  const {
    connectMetamask,
    handleRegister,
    handleSubmit,
    control,
    isPending,
    alertOpen,
    alertMessage,
    isLoading,
    isConnected,
    errors,
  } = useRegister();

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
            // isClosable
            // onClose={() => setAlertOpen(false)}
          />
        </div>
      )}

      {!isConnected ? (
        <Card className="flex h-[20vh] w-[30%] items-center justify-center">
          <CardBody className="flex items-center justify-center gap-[1.5rem]">
            <h1 className="text-primary text-3xl font-bold">Sign up</h1>
            <Button
              color="primary"
              variant="ghost"
              className="w-[80%] font-semibold"
              onPress={connectMetamask}
            >
              {isLoading ? (
                <Spinner variant="gradient" />
              ) : (
                'Connect with metamask'
              )}
            </Button>
          </CardBody>
        </Card>
      ) : (
        <Card className="px-[.8rem] py-[.8rem]">
          <CardBody className="gap-[1.5rem] text-center">
            <h1 className="text-primary text-3xl font-bold">Sign up</h1>
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
                variant="ghost"
                className="text-md my-[1rem] w-full font-semibold"
              >
                {isLoading ? <Spinner variant="gradient" /> : 'submit'}
              </Button>
            </Form>
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default RegisterPage;
