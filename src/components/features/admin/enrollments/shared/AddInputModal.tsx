"use client";

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
} from '@heroui/react';
import useAddInputModal from './useAddInputModal';

type Props = {
  isOpen: boolean;
  participantId: string;
  participantName: string;
  onClose: () => void;
  onSuccess?: () => void;
};

function AddInputModal(props: Props) {
  const { isOpen, participantId, participantName, onClose, onSuccess } = props;
  const { control, handleInput, handleSubmit, errors } = useAddInputModal({
    participantId,
    onSuccess: () => {
      onClose();
      onSuccess?.();
    },
    onError: () => {},
  });

  return (
    <Modal
      isOpen={isOpen}
      size="md"
      onClose={onClose}
      backdrop="blur"
      classNames={{
        base: 'border border-border/60',
        header: 'border-b border-border/50',
        footer: 'border-t border-border/50',
      }}
    >
      <ModalContent>
        {() => (
          <Form onSubmit={handleSubmit(handleInput)}>
            <ModalHeader className="flex flex-col gap-1">
              <p className="text-2xsmall uppercase tracking-[0.2em] text-primary">
                Input Nilai
              </p>
              <h1 className="text-xl font-bold">{participantName}</h1>
              <p className="text-xs text-text-muted">
                Masukkan nilai Listening, Structure, dan Reading peserta yang telah disetujui.
              </p>
            </ModalHeader>
            <ModalBody className="w-full">
              <Controller
                name="listening"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value?.toString() || ''}
                    isRequired
                    label="Listening"
                    labelPlacement="outside"
                    placeholder="Masukan nilai"
                    type="number"
                    min={0}
                    max={100}
                    errorMessage={errors.listening?.message}
                    isInvalid={!!errors.listening}
                  />
                )}
              />
              <Controller
                name="structure"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value?.toString() || ''}
                    isRequired
                    label="Structure"
                    labelPlacement="outside"
                    placeholder="Masukan nilai"
                    type="number"
                    min={0}
                    max={100}
                    errorMessage={errors.structure?.message}
                    isInvalid={!!errors.structure}
                  />
                )}
              />
              <Controller
                name="reading"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value?.toString() || ''}
                    isRequired
                    label="Reading"
                    labelPlacement="outside"
                    placeholder="Masukan nilai"
                    type="number"
                    min={0}
                    max={100}
                    errorMessage={errors.reading?.message}
                    isInvalid={!!errors.reading}
                  />
                )}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="ghost"
                onPress={onClose}
                className="font-semibold transition duration-300"
              >
                Batal
              </Button>
              <Button type="submit" className="bg-primary-800 font-semibold text-white">
                Simpan
              </Button>
            </ModalFooter>
          </Form>
        )}
      </ModalContent>
    </Modal>
  );
}

export default AddInputModal;
