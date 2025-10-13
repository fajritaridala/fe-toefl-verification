import { FieldErrors } from 'react-hook-form';
import { Alert } from '@heroui/react';
import TOEFLRegisterCard from '@/components/ui/Card/TOEFLRegisterCard';
import { useTOEFLRegisterPage } from './useTOEFLRegisterPage';

export default function TOEFLRegisterPage() {
  const {
    control,
    handleSubmit,
    handleRegister,
    errors,
    isLoading,
    alertOpen,
    setAlertOpen,
    alertMessage,
  } = useTOEFLRegisterPage();

  function onError(errors: FieldErrors) {
    console.log(errors);
  }

  return (
    <>
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

      <div className="flex min-h-screen w-full items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <TOEFLRegisterCard
          handleSubmit={handleSubmit}
          handleRegister={handleRegister}
          onError={onError}
          control={control}
          errors={errors}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
