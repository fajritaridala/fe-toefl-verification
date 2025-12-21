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
import { ParticipantInfo, useScoreInputModal } from './useScoreInputModal';

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

const ScoreInputModal = ({
  isOpen,
  onClose,
  participant,
  onSubmit,
  isSubmitting = false,
  blockchainStatus = 'idle',
  statusMessage = '',
  onRetry,
}: ScoreInputModalProps) => {
  const {
    scores,
    errors,
    handleScoreChange,
    handleBlur,
    handleSubmit,
    isFormValid,
  } = useScoreInputModal({
    isOpen,
    participant,
    onSubmit,
  });

  if (!participant) return null;

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
};

export default ScoreInputModal;
