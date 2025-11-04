import { FieldErrors } from 'react-hook-form';
import { LuArrowLeft } from 'react-icons/lu';
import { Alert } from '@heroui/react';
import TOEFLRegisterCard from '@/components/ui/Card/TOEFLRegister';
import BaseFooter from '@/components/ui/Footer/Base';
import BaseNavbar from '@/components/ui/Navbar/BaseNavbar';
import useUserSession from '@/hooks/useUserSession';
import useTOEFLRegister from './useRegister';

const TOEFLRegister = () => {
  const { data, isAuthenticated } = useUserSession();
  const address = data?.user?.address as string;
  const {
    control,
    handleSubmit,
    handleRegister,
    errors,
    isLoading,
    alertOpen,
    setAlertOpen,
    alertMessage,
  } = useTOEFLRegister(address);

  function onError(errors: FieldErrors) {
    console.log(errors);
  }

  return (
    <BaseNavbar user={data} isAuthenticated={isAuthenticated}>
      {alertOpen && (
        <div className="fixed top-[1.5rem] left-1/2 z-50 w-full max-w-md -translate-x-1/2">
          <Alert
            color="danger"
            title="Registration Error"
            description={alertMessage}
            isClosable
            onClose={() => setAlertOpen(false)}
          />
        </div>
      )}
      <section className="mx-auto mt-8 w-full py-20 lg:max-w-5xl">
        <div className="mx-auto lg:max-w-xl">
          <TOEFLRegisterCard
            handleSubmit={handleSubmit}
            handleRegister={handleRegister}
            onError={onError}
            control={control}
            errors={errors}
            isLoading={isLoading}
          />
        </div>
      </section>
      <BaseFooter />
    </BaseNavbar>
  );
};

export default TOEFLRegister;
