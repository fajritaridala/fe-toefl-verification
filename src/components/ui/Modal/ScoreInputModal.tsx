'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { Award, Save, X } from 'lucide-react';

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
  blockchainStatus?: 'idle' | 'submitting' | 'uploading-ipfs' | 'storing-blockchain' | 'updating-status' | 'success' | 'error';
  statusMessage?: string;
};

export default function ScoreInputModal({
  isOpen,
  onClose,
  participant,
  onSubmit,
  isSubmitting = false,
  blockchainStatus = 'idle',
  statusMessage = '',
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

  const validateScore = (value: string): boolean => {
    if (value === '') return false;
    const num = Number(value);
    return !isNaN(num) && num >= 0 && num <= 100 && Number.isInteger(num);
  };

  const handleScoreChange = (field: keyof ScoreData, value: string) => {
    // Allow empty or valid numbers only
    if (value === '' || /^\d+$/.test(value)) {
      setScores((prev) => ({ ...prev, [field]: value }));

      // Clear error if valid - remove the key entirely
      if (value === '' || validateScore(value)) {
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
    if (value !== '' && !validateScore(value)) {
      setErrors((prev) => ({
        ...prev,
        [field]: 'Nilai harus antara 0-100 (bilangan bulat)',
      }));
    }
  };

  const isFormValid = (): boolean => {
    // Check all scores are filled
    const allScoresFilled = 
      scores.listening !== '' &&
      scores.structure !== '' &&
      scores.reading !== '';
    
    // Check all scores are valid
    const allScoresValid =
      validateScore(scores.listening) &&
      validateScore(scores.structure) &&
      validateScore(scores.reading);
    
    // Check no errors exist (filter out undefined values)
    const hasNoErrors = Object.values(errors).every(error => error === undefined);
    
    return allScoresFilled && allScoresValid && hasNoErrors;
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;

    onSubmit(
      participant.enrollId,
      participant.participantId,
      {
        listening: Number(scores.listening),
        structure: Number(scores.structure),
        reading: Number(scores.reading),
      }
    );
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
        <ModalHeader className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
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
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  {blockchainStatus === 'submitting' && (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Mengirim nilai ke server...
                        </p>
                        <p className="text-xs text-gray-500">
                          Menghitung total nilai dan upload ke IPFS
                        </p>
                      </div>
                    </>
                  )}

                  {blockchainStatus === 'storing-blockchain' && (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Menyimpan ke blockchain...
                        </p>
                        <p className="text-xs text-gray-500">
                          Tunggu konfirmasi transaksi dari MetaMask
                        </p>
                      </div>
                    </>
                  )}

                  {blockchainStatus === 'updating-status' && (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Memperbarui status peserta...
                        </p>
                        <p className="text-xs text-gray-500">
                          Menyimpan hash ke database dan mengubah status
                        </p>
                      </div>
                    </>
                  )}

                  {blockchainStatus === 'success' && (
                    <>
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                        <svg
                          className="h-3 w-3 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-900">
                          Sertifikat berhasil disimpan!
                        </p>
                        <p className="text-xs text-green-600">{statusMessage}</p>
                      </div>
                    </>
                  )}

                  {blockchainStatus === 'error' && (
                    <>
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100">
                        <svg
                          className="h-3 w-3 text-red-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-900">
                          Terjadi kesalahan
                        </p>
                        <p className="text-xs text-red-600">{statusMessage}</p>
                      </div>
                    </>
                  )}
                </div>
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

        <ModalFooter className="flex justify-between">
          <Button variant="light" onPress={onClose} isDisabled={isSubmitting}>
            Batal
          </Button>

          <Button
            color="primary"
            onPress={handleSubmit}
            isDisabled={!isFormValid() || isSubmitting}
            isLoading={isSubmitting}
            startContent={!isSubmitting && <Save className="h-4 w-4" />}
            className="font-semibold"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Nilai'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
