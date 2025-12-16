'use client';

import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  cn,
} from '@heroui/react';
import { X } from 'lucide-react';

type ScoreData = {
  listening: string;
  structure: string;
  reading: string;
};

type ParticipantInfo = {
  enrollId: string;
  participantId: string;
  fullName: string;
  nim?: string;
  scheduleId?: string;
  scheduleName?: string;
  scheduleDate?: string;
  listeningScore?: number;
  structureScore?: number;
  readingScore?: number;
};

type ScoreInputModalProps = {
  isOpen: boolean;
  onClose: () => void;
  participant: ParticipantInfo | null;
  onSubmit: (
    enrollId: string,
    participantId: string,
    scores: { listening: number; structure: number; reading: number }
  ) => void;
  isSubmitting?: boolean;
  blockchainStatus?:
    | 'idle'
    | 'submitting'
    | 'uploading-ipfs'
    | 'storing-blockchain'
    | 'updating-status'
    | 'success'
    | 'error';
  statusMessage?: string;
  onRetry?: () => void;
};

export default function ScoreInputModal({
  isOpen,
  onClose,
  participant,
  onSubmit,
  isSubmitting = false,
  blockchainStatus = 'idle',
  statusMessage = '',
  onRetry,
}: ScoreInputModalProps) {
  const [scores, setScores] = useState<ScoreData>({
    listening: '',
    structure: '',
    reading: '',
  });

  const [errors, setErrors] = useState<Partial<ScoreData>>({});

  // Reset form when modal opens/closes or participant changes
  useEffect(() => {
    if (isOpen && participant) {
      setScores({
        listening: participant.listeningScore?.toString() || '',
        structure: participant.structureScore?.toString() || '',
        reading: participant.readingScore?.toString() || '',
      });
      setErrors({});
    }
  }, [isOpen, participant]);

  if (!participant) return null;

  // Field-specific max values
  const maxScores: Record<keyof ScoreData, number> = {
    listening: 50,
    reading: 50,
    structure: 40,
  };

  const validateScore = (field: keyof ScoreData, value: string): boolean => {
    if (value === '') return false;
    const num = Number(value);
    const maxValue = maxScores[field];
    return !isNaN(num) && num >= 0 && num <= maxValue && Number.isInteger(num);
  };

  const handleScoreChange = (field: keyof ScoreData, value: string) => {
    // Allow empty or valid numbers only
    if (value === '' || /^\d+$/.test(value)) {
      setScores((prev) => ({ ...prev, [field]: value }));

      // Clear error if valid - remove the key entirely
      if (value === '' || validateScore(field, value)) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }
  };

  const handleBlur = (field: keyof ScoreData) => {
    const value = scores[field];
    const maxValue = maxScores[field];
    if (value !== '' && !validateScore(field, value)) {
      setErrors((prev) => ({
        ...prev,
        [field]: `Nilai harus antara 0-${maxValue} (bilangan bulat)`,
      }));
    }
  };

  const isFormValid = (): boolean => {
    // Check all scores are filled
    const allScoresFilled =
      scores.listening !== '' &&
      scores.structure !== '' &&
      scores.reading !== '';

    // Check all scores are valid with field-specific limits
    const allScoresValid =
      validateScore('listening', scores.listening) &&
      validateScore('structure', scores.structure) &&
      validateScore('reading', scores.reading);

    // Check no errors exist (filter out undefined values)
    const hasNoErrors = Object.values(errors).every(
      (error) => error === undefined
    );

    return allScoresFilled && allScoresValid && hasNoErrors;
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;

    onSubmit(participant.enrollId, participant.participantId, {
      listening: Number(scores.listening),
      structure: Number(scores.structure),
      reading: Number(scores.reading),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      backdrop="blur"
      isDismissable={!isSubmitting}
      hideCloseButton
      classNames={{
        base: 'bg-white',
        header: 'border-b border-gray-200',
        body: 'py-6',
        footer: 'border-t border-gray-200 bg-gray-50',
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between border py-6">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-black">
                Input Nilai Peserta
              </h2>
              <p className="text-sm font-normal text-gray-500">
                {participant.fullName}
              </p>
            </div>
          </div>

          <Button
            variant="light"
            isIconOnly
            onPress={onClose}
            isDisabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-5">
            {/* Blockchain Status Progress */}
            {blockchainStatus !== 'idle' && (
              <div className="space-y-3">
                {blockchainStatus === 'submitting' && (
                  <Alert
                    color="primary"
                    variant="flat"
                    title="Mengirim nilai ke server..."
                    description="Menghitung total nilai dan upload ke IPFS"
                    startContent={
                      <div className="border-primary h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
                    }
                  />
                )}

                {blockchainStatus === 'storing-blockchain' && (
                  <Alert
                    color="primary"
                    variant="flat"
                    title="Menyimpan ke blockchain..."
                    description="Tunggu konfirmasi transaksi dari MetaMask"
                    startContent={
                      <div className="border-primary h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
                    }
                  />
                )}

                {blockchainStatus === 'updating-status' && (
                  <Alert
                    color="success"
                    variant="flat"
                    title="Memperbarui status peserta..."
                    description="Menyimpan hash ke database dan mengubah status"
                    startContent={
                      <div className="border-success h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
                    }
                  />
                )}

                {blockchainStatus === 'success' && (
                  <Alert
                    color="success"
                    variant="flat"
                    title="Sertifikat berhasil disimpan!"
                    description={statusMessage}
                  />
                )}

                {blockchainStatus === 'error' && (
                  <Alert
                    color="danger"
                    variant="flat"
                    title="Terjadi kesalahan"
                    description={statusMessage}
                    endContent={
                      onRetry && (
                        <Button
                          size="sm"
                          color="danger"
                          variant="solid"
                          onPress={onRetry}
                        >
                          Coba Lagi
                        </Button>
                      )
                    }
                  />
                )}
              </div>
            )}

            {/* Score Inputs */}
            <div className="space-y-4">
              <div>
                <Input
                  type="text"
                  label="Listening"
                  value={scores.listening}
                  onChange={(e) =>
                    handleScoreChange('listening', e.target.value)
                  }
                  onBlur={() => handleBlur('listening')}
                  isInvalid={!!errors.listening}
                  errorMessage={errors.listening}
                  isDisabled={isSubmitting}
                  classNames={{
                    input: 'text-lg font-semibold',
                  }}
                />
              </div>

              <div>
                <Input
                  type="text"
                  label="Structure"
                  value={scores.structure}
                  onChange={(e) =>
                    handleScoreChange('structure', e.target.value)
                  }
                  onBlur={() => handleBlur('structure')}
                  isInvalid={!!errors.structure}
                  errorMessage={errors.structure}
                  isDisabled={isSubmitting}
                  classNames={{
                    input: 'text-lg font-semibold',
                  }}
                />
              </div>

              <div>
                <Input
                  type="text"
                  label="Reading"
                  value={scores.reading}
                  onChange={(e) => handleScoreChange('reading', e.target.value)}
                  onBlur={() => handleBlur('reading')}
                  isInvalid={!!errors.reading}
                  errorMessage={errors.reading}
                  isDisabled={isSubmitting}
                  classNames={{
                    input: 'text-lg font-semibold',
                  }}
                />
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="flex w-full justify-end-safe gap-3 py-6">
          <Button
            variant="flat"
            size="lg"
            color="default"
            radius="full"
            onPress={onClose}
            isDisabled={isSubmitting}
            className="w-2/3 font-semibold"
          >
            Batal
          </Button>

          <Button
            color="primary"
            size="lg"
            radius="full"
            onPress={handleSubmit}
            isDisabled={!isFormValid() || isSubmitting}
            isLoading={isSubmitting}
            className={cn('w-2/3 font-semibold text-white', {
              'cursor-not-allowed': !isFormValid(),
            })}
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Nilai'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
