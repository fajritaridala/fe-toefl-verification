"use client";

import { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@heroui/react';
import { X, Save, Award } from 'lucide-react';

type ScoreData = {
  listening: string;
  structure: string;
  reading: string;
};

type ParticipantInfo = {
  _id: string;
  fullName: string;
  nim: string;
  scheduleId?: string;
  scheduleName?: string;
  scheduleDate?: string;
};

type ScoreInputModalProps = {
  isOpen: boolean;
  onClose: () => void;
  participant: ParticipantInfo | null;
  onSubmit: (participantId: string, scores: { listening: number; structure: number; reading: number }) => void;
  isSubmitting?: boolean;
};

export default function ScoreInputModal({
  isOpen,
  onClose,
  participant,
  onSubmit,
  isSubmitting = false,
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
      setScores({ listening: '', structure: '', reading: '' });
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
      setScores(prev => ({ ...prev, [field]: value }));
      
      // Clear error if valid
      if (value === '' || validateScore(value)) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    }
  };

  const handleBlur = (field: keyof ScoreData) => {
    const value = scores[field];
    if (value !== '' && !validateScore(value)) {
      setErrors(prev => ({
        ...prev,
        [field]: 'Nilai harus antara 0-100 (bilangan bulat)',
      }));
    }
  };

  const calculateTotal = (): number => {
    const listening = Number(scores.listening) || 0;
    const structure = Number(scores.structure) || 0;
    const reading = Number(scores.reading) || 0;
    return listening + structure + reading;
  };

  const isFormValid = (): boolean => {
    return (
      scores.listening !== '' &&
      scores.structure !== '' &&
      scores.reading !== '' &&
      validateScore(scores.listening) &&
      validateScore(scores.structure) &&
      validateScore(scores.reading) &&
      Object.keys(errors).length === 0
    );
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;
    
    onSubmit(participant._id, {
      listening: Number(scores.listening),
      structure: Number(scores.structure),
      reading: Number(scores.reading),
    });
  };

  const totalScore = calculateTotal();

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
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
            <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Input Nilai Peserta</h2>
              <p className="text-sm text-gray-500 font-normal">{participant.fullName}</p>
            </div>
          </div>
          
          <Button
            variant="light"
            isIconOnly
            onPress={onClose}
            isDisabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </ModalHeader>
        
        <ModalBody>
          <div className="space-y-5">
            {/* Participant Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">NIM:</span>
                  <span className="ml-2 font-medium text-gray-900">{participant.nim}</span>
                </div>
                {(participant.scheduleName || participant.scheduleId) && (
                  <div>
                    <span className="text-gray-500">Jadwal:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {participant.scheduleName || participant.scheduleId}
                    </span>
                  </div>
                )}
              </div>
              {participant.scheduleDate && (
                <div className="text-xs text-gray-500">
                  {participant.scheduleDate}
                </div>
              )}
            </div>

            {/* Score Inputs */}
            <div className="space-y-4">
              <div>
                <Input
                  type="text"
                  label="📊 Listening"
                  placeholder="0"
                  description="Masukkan nilai 0-100"
                  value={scores.listening}
                  onChange={(e) => handleScoreChange('listening', e.target.value)}
                  onBlur={() => handleBlur('listening')}
                  isInvalid={!!errors.listening}
                  errorMessage={errors.listening}
                  isDisabled={isSubmitting}
                  classNames={{
                    input: 'text-lg font-semibold',
                    inputWrapper: 'input-soft',
                  }}
                  endContent={
                    <span className="text-sm text-gray-500 font-medium">/ 100</span>
                  }
                />
              </div>

              <div>
                <Input
                  type="text"
                  label="📝 Structure"
                  placeholder="0"
                  description="Masukkan nilai 0-100"
                  value={scores.structure}
                  onChange={(e) => handleScoreChange('structure', e.target.value)}
                  onBlur={() => handleBlur('structure')}
                  isInvalid={!!errors.structure}
                  errorMessage={errors.structure}
                  isDisabled={isSubmitting}
                  classNames={{
                    input: 'text-lg font-semibold',
                    inputWrapper: 'input-soft',
                  }}
                  endContent={
                    <span className="text-sm text-gray-500 font-medium">/ 100</span>
                  }
                />
              </div>

              <div>
                <Input
                  type="text"
                  label="📖 Reading"
                  placeholder="0"
                  description="Masukkan nilai 0-100"
                  value={scores.reading}
                  onChange={(e) => handleScoreChange('reading', e.target.value)}
                  onBlur={() => handleBlur('reading')}
                  isInvalid={!!errors.reading}
                  errorMessage={errors.reading}
                  isDisabled={isSubmitting}
                  classNames={{
                    input: 'text-lg font-semibold',
                    inputWrapper: 'input-soft',
                  }}
                  endContent={
                    <span className="text-sm text-gray-500 font-medium">/ 100</span>
                  }
                />
              </div>
            </div>

            {/* Total Score Display */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-primary-700 font-medium">Total Nilai Otomatis</p>
                  <p className="text-xs text-primary-600 mt-0.5">Listening + Structure + Reading</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">
                    {totalScore}
                  </p>
                  <p className="text-sm text-primary-600">/ 300</p>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        
        <ModalFooter className="flex justify-between">
          <Button
            variant="light"
            onPress={onClose}
            isDisabled={isSubmitting}
          >
            Batal
          </Button>
          
          <Button
            color="primary"
            onPress={handleSubmit}
            isDisabled={!isFormValid() || isSubmitting}
            isLoading={isSubmitting}
            startContent={!isSubmitting && <Save className="w-4 h-4" />}
            className="font-semibold"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Nilai'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
