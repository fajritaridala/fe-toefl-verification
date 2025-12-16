'use client';

import { Alert, Button } from '@heroui/react';
import { ArrowLeft } from 'lucide-react';
import ScheduleRegisterCard from '@/components/ui/Card/ScheduleRegister';
import { useScheduleRegister } from './useScheduleRegister';

const Register = () => {
  const {
    control,
    errors,
    isLoading,
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
    <section className="flex min-h-screen justify-center bg-white py-10">
      <div className="animate-fade-bottom my-10 flex w-full flex-col gap-6 px-6 lg:max-w-6xl lg:flex-row">
        {/* Header */}
        <div className="w-full space-y-2 lg:w-1/3">
          <Button
            variant="light"
            data-hover={false}
            onPress={handleGoBack}
            className="text-secondary hover:text-secondary/60 group -ml-3 w-fit p-0"
            startContent={
              <ArrowLeft
                size={18}
                className="transform duration-300 group-hover:-translate-x-1"
              />
            }
          >
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-extrabold text-black">
              Formulir Pendaftaran Jadwal
            </h1>
            <p className="text-sm text-gray-500">
              Lengkapi data di bawah ini untuk menyelesaikan pendaftaran Anda.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-2/3 lg:scale-95 lg:pt-8">
          <ScheduleRegisterCard
            control={control}
            errors={errors}
            isLoading={isLoading}
            handleSubmitAction={handleSubmitAction}
            handleRegisterAction={handleRegisterAction}
            onErrorAction={onErrorAction}
            fileInputRef={fileInputRef}
            paymentReceipt={paymentReceipt}
            handleFileChangeAction={handleFileChange}
            handleFilePickerAction={handleFilePicker}
          />
        </div>
      </div>
    </section>
  );
};

export default Register;
