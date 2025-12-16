import { Controller } from 'react-hook-form';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  Input,
} from '@heroui/react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import AuthCard from '@/components/ui/Card/Auth';
import { useRegister } from './useRegister';

const Register = () => {
  const router = useRouter();
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
  } = useRegister();

  return (
    <>
      {alertOpen && (
        <div className="fixed top-6 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-4">
          <Alert
            color="danger"
            title="Registrasi Gagal"
            description={alertMessage}
            isClosable
            onClose={() => setAlertOpen(false)}
            variant="faded"
            // Memastikan rounded-xl dan styling lainnya konsisten
            className="shadow-box border-danger-200 rounded-xl border bg-white/90 backdrop-blur-sm"
          />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex w-full items-center justify-center px-4 py-8 sm:px-6 lg:px-8"
      >
        {!isConnected ? (
          <div className="w-full max-w-md">
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
              heading="Daftar"
              buttonLabel="Hubungkan MetaMask"
              isLoading={isLoading}
              handleOnPress={connectMetamask}
            />
          </div>
        ) : (
          <div className="w-full max-w-lg">
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
            <Card className="border-border shadow-main w-full rounded-2xl border bg-white p-6 md:p-8">
              <CardHeader className="flex-col items-start px-4 pt-2 pb-0">
                <h1 className="text-text text-3xl font-bold tracking-tight">
                  Buat Akun
                </h1>
                <p className="text-text-muted mt-2 text-sm">
                  Silakan isi detail Anda untuk melanjutkan.
                </p>
              </CardHeader>
              <CardBody className="overflow-visible py-6">
                <Form
                  onSubmit={handleSubmit(handleRegister)}
                  className="flex flex-col gap-6"
                >
                  <Controller
                    name="username"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        isRequired
                        label="Nama Pengguna"
                        labelPlacement="outside"
                        placeholder="Masukan nama pengguna Anda"
                        type="text"
                        variant="bordered"
                        color={errors.username ? 'danger' : 'default'}
                        validationBehavior="aria"
                        classNames={{
                          inputWrapper:
                            'border-border shadow-none hover:border-primary/50 focus-within:!border-primary rounded-lg transition-colors',
                          label: 'text-text-muted font-medium mb-1',
                        }}
                        isInvalid={!!errors.username}
                        errorMessage={errors.username?.message}
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
                        placeholder="nama@contoh.com"
                        type="email"
                        variant="bordered"
                        color={errors.email ? 'danger' : 'default'}
                        validationBehavior="aria"
                        classNames={{
                          inputWrapper:
                            'border-border shadow-none hover:border-primary/50 focus-within:!border-primary rounded-lg transition-colors',
                          label: 'text-text-muted font-medium mb-1',
                        }}
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
                        label="Token Peran"
                        labelPlacement="outside"
                        placeholder="Opsional"
                        type="text"
                        variant="bordered"
                        color={errors.roleToken ? 'danger' : 'default'}
                        validationBehavior="aria"
                        classNames={{
                          inputWrapper:
                            'border-border shadow-none hover:border-primary/50 focus-within:!border-primary rounded-lg transition-colors',
                          label: 'text-text-muted font-medium mb-1',
                        }}
                        isInvalid={!!errors.roleToken}
                        errorMessage={errors.roleToken?.message}
                      />
                    )}
                  />

                  <Button
                    color="primary"
                    type="submit"
                    size="lg"
                    className="bg-primary shadow-primary/20 hover:shadow-primary/30 mt-4 w-full rounded-full font-bold text-white shadow-lg transition-all duration-100 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:shadow-md"
                    isLoading={isLoading}
                  >
                    {isLoading ? 'Membuat Akun...' : 'Daftar'}
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Register;
