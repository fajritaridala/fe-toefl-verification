import { Controller } from 'react-hook-form';
import { ScheduleItem } from '@features/admin/schedules/schedule.types';
import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  NumberInput,
  Select,
  SelectItem,
} from '@heroui/react';
import { ServiceOption } from '../Schedules.constants';
import useEditScheduleModal from './useEditScheduleModal';

type Props = {
  isOpen: boolean;
  schedule: ScheduleItem | null;
  serviceOptions: ServiceOption[];
  onClose: () => void;
};

const EditScheduleModal = ({
  isOpen,
  schedule,
  serviceOptions,
  onClose,
}: Props) => {
  const { control, errors, handleSubmit, isSubmitting } = useEditScheduleModal({
    schedule,
    isOpen,
    onSuccess: onClose,
  });

  const hasServiceOptions = serviceOptions.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      size="lg"
      onClose={onClose}
      placement="center"
      backdrop="blur"
      className="px-3 py-6"
    >
      <ModalContent>
        {() => (
          <Form onSubmit={handleSubmit} className="space-y-0">
            <ModalHeader className="flex flex-col gap-1">
              <h1 className="text-text text-2xl font-bold">Ubah Jadwal</h1>
              <p className="text-text-muted text-sm">
                Perbarui layanan, tanggal, serta kuota untuk jadwal TOEFL.
              </p>
            </ModalHeader>
            <ModalBody className="w-full space-y-4">
              <Controller
                name="serviceId"
                control={control}
                render={({ field }) => {
                  const { ref, value, onChange, ...restField } = field;
                  return (
                    <Select
                      {...restField}
                      ref={ref}
                      isRequired
                      variant="bordered"
                      label="Layanan"
                      labelPlacement="outside"
                      placeholder={
                        hasServiceOptions
                          ? 'Pilih layanan'
                          : 'Belum ada layanan tersedia'
                      }
                      selectedKeys={value ? [value] : []}
                      onSelectionChange={(keys) => {
                        const nextValue = Array.from(keys)[0]?.toString() ?? '';
                        onChange(nextValue);
                      }}
                      isDisabled={!hasServiceOptions}
                      isInvalid={!!errors.serviceId}
                      errorMessage={errors.serviceId?.message}
                    >
                      {serviceOptions.map((option) => (
                        <SelectItem key={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </Select>
                  );
                }}
              />

              <Controller
                name="scheduleDate"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="date"
                    isRequired
                    variant="bordered"
                    label="Tanggal jadwal"
                    labelPlacement="outside"
                    placeholder="Pilih tanggal pelaksanaan"
                    isInvalid={!!errors.scheduleDate}
                    errorMessage={errors.scheduleDate?.message}
                  />
                )}
              />

              <div className="grid gap-4 lg:grid-cols-2">
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="time"
                      isRequired
                      variant="bordered"
                      label="Waktu Mulai"
                      labelPlacement="outside"
                      placeholder="00:00"
                      isInvalid={!!errors.startTime}
                      errorMessage={errors.startTime?.message}
                    />
                  )}
                />

                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="time"
                      isRequired
                      variant="bordered"
                      label="Waktu Selesai"
                      labelPlacement="outside"
                      placeholder="00:00"
                      isInvalid={!!errors.endTime}
                      errorMessage={errors.endTime?.message}
                    />
                  )}
                />
              </div>

              <Controller
                name="capacity"
                control={control}
                render={({ field }) => {
                  const { ref, value, onChange, ...restField } = field;
                  return (
                    <NumberInput
                      {...restField}
                      ref={ref}
                      hideStepper
                      min={0}
                      variant="bordered"
                      label="Kuota (opsional)"
                      labelPlacement="outside"
                      placeholder="Masukkan jumlah kuota"
                      value={
                        typeof value === 'number'
                          ? value
                          : value
                            ? Number(value)
                            : undefined
                      }
                      onValueChange={(nextValue) =>
                        onChange(
                          typeof nextValue === 'number' &&
                            !Number.isNaN(nextValue)
                            ? nextValue
                            : undefined
                        )
                      }
                      isInvalid={!!errors.capacity}
                      errorMessage={errors.capacity?.message}
                    />
                  );
                }}
              />
            </ModalBody>
            <ModalFooter className="flex w-full justify-center gap-3">
              <Button
                variant="flat"
                color="danger"
                onPress={onClose}
                className="w-1/3 font-semibold"
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="solid"
                color="primary"
                className="w-1/3 font-semibold"
                isLoading={isSubmitting}
                isDisabled={!hasServiceOptions}
              >
                Simpan Perubahan
              </Button>
            </ModalFooter>
          </Form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditScheduleModal;
