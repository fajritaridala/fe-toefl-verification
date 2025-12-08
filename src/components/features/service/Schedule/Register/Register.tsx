"use client";

import { Alert } from '@heroui/react';
import ScheduleRegisterCard from '@/components/ui/Card/ScheduleRegister';
import { useScheduleRegister } from './useScheduleRegister';

const Register = () => {
  const {
    control,
    errors,
    isLoading,
    alert,
    setAlert,
    handleSubmit: handleSubmitAction,
    handleRegister: handleRegisterAction,
    onError: onErrorAction,
    handleGoBack,
    fileInputRef,
    paymentReceipt,
    handleFileChange,
    handleFilePicker,
  } = useScheduleRegister();

  return (
    <section className="bg-bg-light flex min-h-screen w-full items-center justify-center py-20">
      {alert && (
        <div className="fixed top-[6rem] left-1/2 z-50 w-full max-w-md -translate-x-1/2">
          <Alert
            color={alert.type}
            title={alert.type === 'success' ? 'Sukses' : 'Gagal'}
            description={alert.message}
            isClosable
            onClose={() => setAlert(null)}
            className="shadow-lg"
          />
        </div>
      )}
      <div className="animate-fade-bottom">
        <ScheduleRegisterCard
          control={control}
          errors={errors}
          isLoading={isLoading}
          handleSubmitAction={handleSubmitAction}
          handleRegisterAction={handleRegisterAction}
          onErrorAction={onErrorAction}
          handleGoBackAction={handleGoBack}
          fileInputRef={fileInputRef}
          paymentReceipt={paymentReceipt}
          handleFileChangeAction={handleFileChange}
          handleFilePickerAction={handleFilePicker}
        />
      </div>
    </section>
  );
};

export default Register;