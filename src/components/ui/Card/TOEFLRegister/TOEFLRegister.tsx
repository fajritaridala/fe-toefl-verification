"use client";

import { Control, Controller, FieldErrors } from 'react-hook-form';
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
  Spinner,
} from '@heroui/react';
import { useRouter } from 'next/navigation';
import { ToeflRegister } from '@features/verification';

type Props = {
  handleSubmit: (
    onSubmit: (data: ToeflRegister) => void,
    onError?: (errors: FieldErrors) => void
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  handleRegister: (data: ToeflRegister) => void;
  onError: (errors: FieldErrors) => void;
  control: Control<ToeflRegister>;
  errors: FieldErrors<ToeflRegister>;
  isLoading: boolean;
};

export default function TOEFLRegisterCard(props: Props) {
  const router = useRouter();
  const { handleSubmit, handleRegister, onError, control, errors, isLoading } =
    props;

  return (
    <Card className="w-full rounded-lg border border-gray-200 p-4 shadow-box">
      <CardHeader>
        <div className="w-full">
          <h1 className="text-primary mb-2 text-2xl font-bold">
            Formulir Pendaftaran
          </h1>
          <p className="text-default-500 text-sm">
            Lengkapi data di bawah ini untuk mendaftar tes.
          </p>
        </div>
      </CardHeader>
      <Divider className="px-10" />
      <CardBody className="space-y-6">
        <Form onSubmit={handleSubmit(handleRegister, onError)}>
          <div className="grid w-full grid-cols-2 gap-4">
            <Controller
              name="nama_lengkap"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  size="sm"
                  radius="sm"
                  isRequired
                  label="Nama Lengkap"
                  labelPlacement="outside"
                  placeholder="Masukkan nama lengkap"
                  type="text"
                  variant="bordered"
                  autoComplete="off"
                  isInvalid={!!errors.nama_lengkap}
                  errorMessage={errors.nama_lengkap?.message}
                />
              )}
            />
            <Controller
              name="jenis_kelamin"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  size="sm"
                  radius="sm"
                  isRequired
                  label="Jenis Kelamin"
                  labelPlacement="outside"
                  placeholder="Pilih jenis kelamin"
                  variant="bordered"
                  isInvalid={!!errors.jenis_kelamin}
                  errorMessage={errors.jenis_kelamin?.message}
                >
                  <SelectItem key="laki-laki">Laki-laki</SelectItem>
                  <SelectItem key="perempuan">Perempuan</SelectItem>
                </Select>
              )}
            />
            <Controller
              name="tanggal_lahir"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  size="sm"
                  radius="sm"
                  isRequired
                  label="Tanggal Lahir"
                  labelPlacement="outside"
                  type="date"
                  variant="bordered"
                  isInvalid={!!errors.tanggal_lahir}
                  errorMessage={errors.tanggal_lahir?.message}
                />
              )}
            />
            <Controller
              name="nomor_induk_mahasiswa"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  size="sm"
                  radius="sm"
                  isRequired
                  label="Nomor Induk Mahasiswa"
                  labelPlacement="outside"
                  placeholder="Masukkan NIM"
                  type="text"
                  variant="bordered"
                  autoComplete="off"
                  isInvalid={!!errors.nomor_induk_mahasiswa}
                  errorMessage={errors.nomor_induk_mahasiswa?.message}
                />
              )}
            />
            <Controller
              name="fakultas"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  size="sm"
                  radius="sm"
                  isRequired
                  label="Fakultas"
                  labelPlacement="outside"
                  placeholder="Masukkan nama fakultas"
                  type="text"
                  variant="bordered"
                  autoComplete="off"
                  isInvalid={!!errors.fakultas}
                  errorMessage={errors.fakultas?.message}
                />
              )}
            />
            <Controller
              name="program_studi"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  size="sm"
                  radius="sm"
                  isRequired
                  label="Program Studi"
                  labelPlacement="outside"
                  placeholder="Masukkan program studi"
                  type="text"
                  variant="bordered"
                  autoComplete="off"
                  isInvalid={!!errors.program_studi}
                  errorMessage={errors.program_studi?.message}
                />
              )}
            />
            <Controller
              name="sesi_tes"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  size="sm"
                  radius="sm"
                  isRequired
                  label="Sesi Tes"
                  labelPlacement="outside"
                  placeholder="Pilih sesi tes"
                  variant="bordered"
                  isInvalid={!!errors.sesi_tes}
                  errorMessage={errors.sesi_tes?.message}
                  className="col-span-2"
                >
                  <SelectItem key="Sesi Pagi">
                    Sesi Pagi (08.30 - Selesai)
                  </SelectItem>
                  <SelectItem key="Sesi Siang">
                    Sesi Siang (13.00 - Selesai)
                  </SelectItem>
                </Select>
              )}
            />
            <Controller
              name="schedule_id"
              control={control}
              render={({ field }) => (
                <input type="hidden" {...field} />
              )}
            />
          </div>
          <Divider className="my-2" />
          <div className="flex w-full gap-4">
            <Button
              data-hover="false"
              radius="full"
              onPress={() => router.back()}
              className="bg-bg-dark w-full font-bold transition-all delay-75 duration-100 hover:-translate-y-1 active:translate-y-0.5"
            >
              Kembali
            </Button>
            <Button
              color="primary"
              type="submit"
              data-hover="false"
              radius="full"
              className="bg-primary-800 w-full font-semibold text-white transition-all delay-75 duration-100 hover:-translate-y-1 active:translate-y-0.5"
            >
              {isLoading ? (
                <Spinner
                  variant="wave"
                  color="current"
                  className="text-white"
                />
              ) : (
                'Daftar'
              )}
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
}
