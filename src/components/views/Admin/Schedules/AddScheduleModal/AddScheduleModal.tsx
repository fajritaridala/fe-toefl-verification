import { Controller } from 'react-hook-form';
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
import { ScheduleItem } from '@/utils/interfaces/Schedule';
import { ServiceOption } from '../Schedules.constants';
import useAddScheduleModal from './useAddScheduleModal';

type Props = {
  isOpen: boolean;
  mode: 'create' | 'edit';
  schedule?: ScheduleItem | null;
  serviceOptions: ServiceOption[];
  onClose: () => void;
};

const AddScheduleModal = ({
  isOpen,
  mode,
  schedule,
  serviceOptions,
  onClose,
}: Props) => {
  const { control, errors, handleSubmit, isSubmitting } = useAddScheduleModal({
    mode,
    schedule,
    isOpen,
    onSuccess: onClose,
  });

  const title = mode === 'create' ? 'Tambah Jadwal' : 'Ubah Jadwal';
  const hasServiceOptions = serviceOptions.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      size="lg"
      onClose={onClose}
      placement="center"
      classNames={{ backdrop: 'backdrop-blur-md bg-black/40' }}
    >
      <ModalContent>
        {() => (
          <Form onSubmit={handleSubmit} className="space-y-0">
            <ModalHeader className="flex flex-col gap-1">
              <h1 className="text-text text-2xl font-bold">{title}</h1>
              <p className="text-text-muted text-sm">
                Tentukan layanan, tanggal, serta kuota untuk jadwal TOEFL.
              </p>
            </ModalHeader>
            <ModalBody className="space-y-4">
              <Controller
                name="service_id"
                control={control}
                render={({ field }) => {
                  const { ref, value, onChange, ...restField } = field;
                  return (
                    <Select
                      {...restField}
                      ref={ref}
                      isRequired
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
                      isInvalid={!!errors.service_id}
                      errorMessage={errors.service_id?.message}
                    >
                      {serviceOptions.map((option) => (
                        <SelectItem key={option.value}>{option.label}</SelectItem>
                      ))}
                    </Select>
                  );
                }}
              />

              <Controller
                name="schedule_date"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="date"
                    isRequired
                    label="Tanggal jadwal"
                    labelPlacement="outside"
                    placeholder="Pilih tanggal pelaksanaan"
                    isInvalid={!!errors.schedule_date}
                    errorMessage={errors.schedule_date?.message}
                  />
                )}
              />

              <Controller
                name="quota"
                control={control}
                render={({ field }) => {
                  const { ref, value, onChange, ...restField } = field;
                  return (
                    <NumberInput
                      {...restField}
                      ref={ref}
                      hideStepper
                      min={0}
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
                          typeof nextValue === 'number' && !Number.isNaN(nextValue)
                            ? nextValue
                            : undefined
                        )
                      }
                      isInvalid={!!errors.quota}
                      errorMessage={errors.quota?.message}
                    />
                  );
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose} className="font-semibold">
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-primary font-semibold text-white"
                isLoading={isSubmitting}
                isDisabled={!hasServiceOptions}
              >
                Simpan
              </Button>
            </ModalFooter>
          </Form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddScheduleModal;
