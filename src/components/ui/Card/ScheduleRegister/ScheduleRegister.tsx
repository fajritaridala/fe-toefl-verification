import { ChangeEvent, RefObject } from 'react';
import { Control, FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import { LuCloudUpload, LuFileCheck } from 'react-icons/lu';
import { ScheduleRegister, Gender } from '@features/admin';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Form,
  cn,
} from '@heroui/react';
import { FormInput } from '@/components/ui/Form/FormInput';
import { FormSelect } from '@/components/ui/Form/FormSelect';

type Props = {
  handleSubmitAction: (
    onSubmit: (data: ScheduleRegister) => void,
    onError?: (errors: FieldErrors) => void
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  handleRegisterAction: (data: ScheduleRegister) => void;
  onErrorAction: (errors: FieldErrors) => void;
  control: Control<ScheduleRegister>;
  errors: FieldErrors<ScheduleRegister>;
  isLoading: boolean;
  handleGoBackAction: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  paymentReceipt: File | null;
  handleFileChangeAction: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFilePickerAction: () => void;
};

export default function ScheduleRegisterForm(props: Props) {
  const {
    handleSubmitAction,
    handleRegisterAction,
    onErrorAction,
    control,
    errors,
    isLoading,
    handleGoBackAction,
    fileInputRef,
    paymentReceipt,
    handleFileChangeAction,
    handleFilePickerAction,
  } = props;

  return (
    <Card className="w-full  rounded-2xl border border-gray-200 p-6 shadow-none">
      <CardHeader>
        <div className="w-full">
          <h1 className="text-primary-800 mb-2 text-3xl font-bold">
            Formulir Pendaftaran Jadwal
          </h1>
          <p className="text-default-500 text-base">
            Lengkapi data di bawah ini untuk menyelesaikan pendaftaran Anda.
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <Form
          onSubmit={handleSubmitAction(handleRegisterAction, onErrorAction)}
          className="space-y-6 my-2"
        >
          <div className="grid grid-cols-1 w-full md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Kolom Kiri: Data Diri */}
          <div className="space-y-4">
            <FormInput
              control={control}
              name="fullName"
              label="Nama Lengkap"
              placeholder="Masukkan nama lengkap"
              isRequired
              variant="bordered"
              labelPlacement="outside"
            />

            <FormInput
              control={control}
              name="birthDate"
              label="Tanggal Lahir"
              placeholder="Pilih tanggal lahir"
              type="date"
              isRequired
              variant="bordered"
              labelPlacement="outside"
            />

            <FormSelect
              control={control}
              name="gender"
              label="Jenis Kelamin"
              placeholder="Pilih jenis kelamin"
              isRequired
              variant="bordered"
              labelPlacement="outside"
              options={[
                { label: 'Laki-laki', value: Gender.MALE },
                { label: 'Perempuan', value: Gender.FEMALE },
              ]}
            />
            
            <FormInput
              control={control}
              name="email"
              label="Email"
              placeholder="Contoh: email@gmail.com"
              type="email"
              isRequired
              variant="bordered"
              labelPlacement="outside-top"
            />

            <FormInput
              control={control}
              name="phoneNumber"
              label="Nomor Telepon"
              placeholder="Contoh: 081234567890"
              type="tel"
              isRequired
              variant="bordered"
              labelPlacement="outside"
            />
          </div>

          {/* Kolom Kanan: Data Kontak & Akademik */}
          <div className="space-y-4">
            <FormInput
              control={control}
              name="nim"
              label="Nomor Induk Mahasiswa"
              placeholder="Masukkan NIM"
              isRequired
              variant="bordered"
              labelPlacement="outside"
            />

            <FormInput
              control={control}
              name="faculty"
              label="Fakultas"
              placeholder="Masukkan fakultas"
              isRequired
              variant="bordered"
              labelPlacement="outside"
            />

            <FormInput
              control={control}
              name="major"
              label="Program Studi"
              placeholder="Masukkan program studi"
              isRequired
              variant="bordered"
              labelPlacement="outside"
            />

            <FormInput
              control={control}
              name="paymentDate"
              label="Tanggal Pembayaran"
              type="date"
              isRequired
              variant="bordered"
              labelPlacement="outside"
            />
          </div>

          {/* Full Width: Upload Bukti Pembayaran */}
          <div className="flex flex-col col-span-1 md:col-span-2 pt-2">
            <label className="text-default-700 text-sm font-medium">
              Bukti Pembayaran
              <span className="text-danger-500">*</span>
            </label>
            <div
              onClick={handleFilePickerAction}
              className={cn(
                'border-default-200 hover:border-primary mt-2 flex cursor-pointer justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors',
                { 'border-danger-500': !!errors.file }
              )}
            >
              <div className="text-center">
                {paymentReceipt ? (
                  <LuFileCheck
                    className="text-success-500 mx-auto h-12 w-12"
                    strokeWidth={1.5}
                  />
                ) : (
                  <LuCloudUpload
                    className="text-default-400 mx-auto h-12 w-12"
                    strokeWidth={1.5}
                  />
                )}
                <div className="text-default-600 mt-4 flex text-sm leading-6">
                  <p className="pl-1">
                    {paymentReceipt
                      ? 'File terpilih:'
                      : 'Unggah file atau seret dan lepas'}
                  </p>
                </div>
                <p className="text-default-500 text-xs leading-5">
                  {paymentReceipt?.name || 'PNG, JPG, PDF hingga 10MB'}
                </p>
              </div>
            </div>
            {errors.file && (
              <p className="text-danger-500 mt-1 text-xs">
                {errors.file?.message}
              </p>
            )}
            <input
              type="file"
              ref={(node) => {
                // @ts-ignore
                fileInputRef.current = node;
              }}
              onChange={handleFileChangeAction}
              className="hidden"
              accept="image/png, image/jpeg, application/pdf"
            />
          </div>
        </div>

          <div className="flex justify-end gap-4 pt-4">
          <Button
            data-hover="false"
            radius="full"
            onPress={handleGoBackAction}
            className="border-warning text-warning hover:bg-warning border-2 bg-transparent font-bold transition-all delay-75 duration-100 hover:-translate-y-1 hover:text-white active:translate-y-0.5"
          >
            Kembali
          </Button>
          <Button
            data-hover="false"
            radius="full"
            color="primary"
            type="submit"
            isLoading={isLoading}
            className="bg-primary-800 font-semibold text-white transition-all delay-75 duration-100 hover:-translate-y-1 active:translate-y-0.5"
          >
            {isLoading ? 'Mendaftar...' : 'Daftar Sekarang'}
          </Button>
        </div>
        </Form>
      </CardBody>
    </Card>
  );
}
