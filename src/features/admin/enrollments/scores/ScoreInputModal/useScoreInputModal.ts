import { useEffect, useState } from 'react';

export type ScoreData = {
  listening: string;
  structure: string;
  reading: string;
};

export type ParticipantInfo = {
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

type UseScoreInputModalProps = {
  isOpen: boolean;
  participant: ParticipantInfo | null;
  onSubmit: (
    enrollId: string,
    participantId: string,
    scores: { listening: number; structure: number; reading: number }
  ) => void;
};

export const useScoreInputModal = ({
  isOpen,
  participant,
  onSubmit,
}: UseScoreInputModalProps) => {
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

      const num = Number(value);
      const maxValue = maxScores[field];

      if (value !== '' && num > maxValue) {
        setErrors((prev) => ({
          ...prev,
          [field]: `Maksimal ${field === 'structure' ? '40' : '50'}`,
        }));
      } else {
        // Clear error if valid
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
    if (!isFormValid() || !participant) return;

    onSubmit(participant.enrollId, participant.participantId, {
      listening: Number(scores.listening),
      structure: Number(scores.structure),
      reading: Number(scores.reading),
    });
  };

  return {
    scores,
    errors,
    handleScoreChange,
    handleBlur,
    handleSubmit,
    isFormValid,
  };
};
