"use client";

import { ChangeEvent, RefObject } from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { LuCloudUpload, LuFileCheck } from 'react-icons/lu';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Form,
  Input,
  Select,
  SelectItem,
  cn,
} from '@heroui/react';
import { ScheduleRegister } from '@features/admin/admin.types';

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

export default function ScheduleRegisterCard(props: Props) {
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
    <Card className="w-full max-w-2xl rounded-lg border border-gray-200 p-6 shadow-lg">
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
          className="space-y-6"
        >
          <div className="grid w-full grid-cols-1 gap-y-4">
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  isRequired
                  label="Nama Lengkap"
                  labelPlacement="outside"
                  placeholder="Masukkan nama lengkap"
                  variant="bordered"
                  isInvalid={!!errors.fullName}
                  errorMessage={errors.fullName?.message}
                />
              )}
            />
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isRequired
                  label="Jenis Kelamin"
                  labelPlacement="outside"
                  placeholder="Pilih jenis kelamin"
                  variant="bordered"
                  isInvalid={!!errors.gender}
                  errorMessage={errors.gender?.message}
                >
                  <SelectItem key="laki-laki">Laki-laki</SelectItem>
                  <SelectItem key="perempuan">Perempuan</SelectItem>
                </Select>
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
                  labelPlacement="outside-top"
                  type="email"
                  variant="bordered"
                  isInvalid={!!errors.email}
                  errorMessage={errors.email?.message}
                />
              )}
            />
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  isRequired
                  label="Nomor Telepon"
                  labelPlacement="outside"
                  placeholder="Contoh: 081234567890"
                  type="tel"
                  variant="bordered"
                  isInvalid={!!errors.phoneNumber}
                  errorMessage={errors.phoneNumber?.message}
                />
              )}
            />
            <Controller
              name="nim"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  isRequired
                  label="NIM (Nomor Induk Mahasiswa)"
                  labelPlacement="outside"
                  placeholder="Masukkan NIM"
                  variant="bordered"
                  isInvalid={!!errors.nim}
                  errorMessage={errors.nim?.message}
                />
              )}
            />
            <Controller
              name="faculty"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  isRequired
                  label="Fakultas"
                  labelPlacement="outside"
                  placeholder="Masukkan fakultas"
                  variant="bordered"
                  isInvalid={!!errors.faculty}
                  errorMessage={errors.faculty?.message}
                />
              )}
            />
            <Controller
              name="major"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  isRequired
                  label="Program Studi"
                  labelPlacement="outside"
                  placeholder="Masukkan program studi"
                  variant="bordered"
                  isInvalid={!!errors.major}
                  errorMessage={errors.major?.message}
                />
              )}
            />
            <Controller
              name="paymentDate"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  isRequired
                  label="Tanggal Pembayaran"
                  labelPlacement="outside"
                  type="date"
                  variant="bordered"
                  isInvalid={!!errors.paymentDate}
                  errorMessage={errors.paymentDate?.message}
                />
              )}
            />
            <div className="flex flex-col">
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
              <Controller
                name="file"
                control={control}
                render={({ field: { ref } }) => (
                  <input
                    type="file"
                    ref={(node) => {
                      fileInputRef.current = node;
                      ref(node);
                    }}
                    onChange={handleFileChangeAction}
                    className="hidden"
                    accept="image/png, image/jpeg, application/pdf"
                  />
                )}
              />
            </div>
          </div>{' '}
          <Divider className="my-6" />
          <div className="flex justify-end gap-4">
            <Button
              data-hover="false"
              onPress={handleGoBackAction}
              className="border-warning text-warning hover:bg-warning border-2 bg-transparent font-bold transition-all delay-75 duration-100 hover:-translate-y-1 hover:text-white active:translate-y-0.5"
            >
              Kembali
            </Button>
            <Button
              data-hover="false"
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
