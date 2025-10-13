import { Control, Controller, FieldErrors } from 'react-hook-form';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  Input,
  Select,
  SelectItem,
  Spinner,
} from '@heroui/react';
import { ToeflRegister } from '@/utils/interfaces/Toefl';

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
  const { handleSubmit, handleRegister, onError, control, errors, isLoading } =
    props;
  return (
    <Card className="mx-auto w-full max-w-2xl scale-90 p-4 md:p-6 lg:p-8">
      <CardHeader className="text-center">
        <div className="w-full">
          <h1 className="text-primary-800 mb-2 text-[2.5rem] font-extrabold">
            TOEFL Like
          </h1>
          <p className="text-default-500 text-sm">
            Isi formulir pendaftaran dengan data yang valid
          </p>
        </div>
      </CardHeader>
      <CardBody className="space-y-6">
        <Form onSubmit={handleSubmit(handleRegister, onError)}>
          <div className="w-full space-y-10">
            <Controller
              name="nama_lengkap"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
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
                  isRequired
                  label="Sesi Tes"
                  labelPlacement="outside"
                  placeholder="Pilih sesi tes"
                  variant="bordered"
                  isInvalid={!!errors.sesi_tes}
                  errorMessage={errors.sesi_tes?.message}
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
            <Button
              color="primary"
              type="submit"
              variant="solid"
              className="text-md bg-primary-800 mt-6 w-full font-semibold text-white"
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
