import { useCallback, useEffect, useMemo, useState } from 'react';
import { type EnrollmentItem, enrollmentsService } from '@features/admin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { storeToBlockchain } from '@/lib/blockchain/storeToBlockchain';
import useEnrollments from '../shared/useEnrollments';

// Backend response type
interface SubmitScoreResponse {
  success: boolean;
  message: string;
  data?: {
    hash: string;
    cid: string;
    participantId: string;
    enrollId: string;
    scores: {
      listening: number;
      structure: number;
      reading: number;
      total: number;
    };
  };
}

export const useScores = () => {
  const [selectedParticipant, setSelectedParticipant] = useState<{
    enrollId: string;
    participantId: string;
    fullName: string;
    nim: string;
    scheduleId?: string;
  } | null>(null);
  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [blockchainStatus, setBlockchainStatus] = useState< 
    | 'idle'
    | 'submitting'
    | 'uploading-ipfs'
    | 'storing-blockchain'
    | 'updating-status'
    | 'success'
    | 'error'
  >('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const queryClient = useQueryClient();

  // Use existing enrollments hook
  const {
    dataEnrollments,
    isLoadingEnrollments,
    isRefetchingEnrollments,
    currentLimit,
    currentPage,
    handleChangeLimit,
    handleChangePage,
    handleSearch,
    handleClearSearch,
  } = useEnrollments({ fixedStatus: 'disetujui' });

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const participants = useMemo(() => {
    const items = (dataEnrollments?.data as EnrollmentItem[]) || [];
    return items.map((item, idx) => ({
      ...item,
      __rowKey: item.enrollId || item.participantId || `score-${idx}`,
    }));
  }, [dataEnrollments]);

  const totalPages = dataEnrollments?.pagination?.totalPages || 1;

  // Score submission mutation
  const { mutate: submitScore, isPending: isSubmittingScore } = useMutation({
    mutationFn: async ({
      enrollId,
      participantId,
      scores,
    }: {
      enrollId: string;
      participantId: string;
      scores: { listening: number; structure: number; reading: number };
    }) => {
      setBlockchainStatus('submitting');
      setStatusMessage('Mengirim nilai ke server...');

      const response = await enrollmentsService.submitScore(
        enrollId,
        participantId,
        scores
      );

      return response.data as SubmitScoreResponse;
    },
    onSuccess: async (response) => {
      if (!response.data) {
        throw new Error('Invalid response from backend');
      }

      console.log(response)
      const { hash, cid, participantId, enrollId } = response.data;

      if (!hash || !cid) {
        throw new Error('Hash or CID missing from backend response');
      }

      try {
        // Step 3: Store to blockchain
        setBlockchainStatus('storing-blockchain');
        setStatusMessage('Menyimpan ke blockchain...');

        await storeToBlockchain({ hash, cid });

        // Step 4: Notify backend about blockchain success
        setBlockchainStatus('updating-status');
        setStatusMessage('Memperbarui status peserta...');

        try {
          await enrollmentsService.blockchainSuccess(
            enrollId,
            participantId,
            hash
          );
        } catch (backendError) {
          const err = backendError as Error & { 
            response?: { data?: { message?: string } } 
          };
          
          console.error('Backend status update error:', err);
          
          alert(
            `⚠️ Blockchain berhasil, tapi update database gagal!\n\n` +
            `Error: ${err.response?.data?.message || err.message}\n` +
            `Sertifikat sudah ada di blockchain. Silakan hubungi administrator.`
          );
        }

        setBlockchainStatus('success');
        setStatusMessage('Sertifikat berhasil disimpan!');

        // Refresh data
        queryClient.invalidateQueries({ queryKey: ['enrollments'] });

        // Show success notification
        alert(`🎉 Sertifikat berhasil disimpan dan diverifikasi di blockchain!`);

        // Close modal after short delay
        setTimeout(() => {
          setScoreModalOpen(false);
          setSelectedParticipant(null);
          setBlockchainStatus('idle');
          setStatusMessage('');
        }, 1500);

      } catch (blockchainError) {
        const err = blockchainError as Error;
        console.error('Blockchain error:', err);
        setBlockchainStatus('error');
        setStatusMessage(`Error Blockchain: ${err.message}`);

        alert(
          `❌ Gagal menyimpan ke blockchain!\n\n` +
            `Error: ${err.message}\n` +
            `Nilai tersimpan di database, tapi gagal di blockchain.`
        );
      }
    },
    onError: (error: Error) => {
      console.error('Submission error:', error);
      setBlockchainStatus('error');
      setStatusMessage(`Error: ${error.message}`);
      alert(`❌ Gagal mengirim nilai:\n${error.message}`);

      // Reset status after error
      setTimeout(() => {
        setBlockchainStatus('idle');
        setStatusMessage('');
      }, 3000);
    },
  });

  // Handlers
  const handleOpenScoreModal = useCallback((participant: EnrollmentItem) => {
    setSelectedParticipant({
      enrollId: participant.enrollId,
      participantId: participant.participantId,
      fullName: participant.fullName,
      nim: participant.nim,
      scheduleId: participant.scheduleId,
    });
    setScoreModalOpen(true);
  }, []);

  const handleSubmitScore = useCallback(
    (
      enrollId: string,
      participantId: string,
      scores: {
        listening: number;
        structure: number;
        reading: number;
      }
    ) => {
      submitScore({ enrollId, participantId, scores });
    },
    [submitScore]
  );

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['enrollments'] });
  }, [queryClient]);

  const handleCloseModal = useCallback(() => {
    setScoreModalOpen(false);
    setSelectedParticipant(null);
  }, []);

  return {
    // State
    selectedParticipant,
    scoreModalOpen,
    searchInput,
    participants,
    totalPages,
    currentLimit,
    currentPage,
    isLoadingEnrollments,
    isRefetchingEnrollments,
    isSubmittingScore,
    blockchainStatus,
    statusMessage,

    // Handlers
    setSearchInput,
    handleOpenScoreModal,
    handleSubmitScore,
    handleRefresh,
    handleCloseModal,
    handleChangeLimit,
    handleChangePage,
    handleClearSearch,
  };
};