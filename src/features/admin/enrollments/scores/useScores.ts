import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  type EnrollmentItem,
  EnrollmentStatus,
} from '@features/admin/enrollments/enrollment.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentsService } from '@/domain/enroll.services';
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

  // Pending blockchain data for retry functionality
  const [pendingBlockchainData, setPendingBlockchainData] = useState<{
    hash: string;
    cid: string;
    enrollId: string;
    participantId: string;
  } | null>(null);

  const queryClient = useQueryClient();

  // Use existing enrollments hook
  const {
    dataEnrollments,
    isLoadingEnrollments,
    isRefetchingEnrollments,
    currentLimit,
    currentPage,
    currentSearch,
    handleChangeLimit,
    handleChangePage,
    handleSearch,
    handleClearSearch,
  } = useEnrollments({ fixedStatus: EnrollmentStatus.APPROVED });

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

      // Response logged only in dev via storeToBlockchain's conditional logger
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
            response?: { data?: { message?: string } };
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
        alert(
          `🎉 Sertifikat berhasil disimpan dan diverifikasi di blockchain!`
        );

        // Close modal after short delay
        setTimeout(() => {
          setScoreModalOpen(false);
          setSelectedParticipant(null);
          setBlockchainStatus('idle');
          setStatusMessage('');
        }, 1500);
      } catch (blockchainError) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err = blockchainError as any;
        console.error('Blockchain error details:', err);

        setBlockchainStatus('error');

        // Handle User Rejected Action specifically
        const isUserRejection =
          err.code === 4001 ||
          err.code === 'ACTION_REJECTED' ||
          err.message?.toLowerCase().includes('user rejected') ||
          err.info?.error?.code === 4001;

        if (isUserRejection) {
          setStatusMessage(
            'Transaksi dibatalkan oleh pengguna (User Rejected).'
          );
        } else {
          setStatusMessage(
            `Error Blockchain: ${err.message || 'Unknown error'}`
          );
        }

        // Save data for retry
        setPendingBlockchainData({ hash, cid, enrollId, participantId });

        // Don't show alert for user rejection to avoid annoyance, just show in modal status
        if (!isUserRejection) {
          alert(
            `❌ Gagal menyimpan ke blockchain!\n\n` +
              `Error: ${err.message}\n` +
              `Nilai tersimpan di database, tapi gagal di blockchain.\n` +
              `Gunakan tombol "Coba Lagi" untuk mencoba kembali.`
          );
        }
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
    setTimeout(() => {
      setSelectedParticipant(null);
      setPendingBlockchainData(null);
      setBlockchainStatus('idle');
      setStatusMessage('');
    }, 400);
  }, []);

  // Retry blockchain storage after failure
  const handleRetryBlockchain = useCallback(async () => {
    if (!pendingBlockchainData) return;

    const { hash, cid, enrollId, participantId } = pendingBlockchainData;

    try {
      setBlockchainStatus('storing-blockchain');
      setStatusMessage('Mencoba ulang menyimpan ke blockchain...');

      await storeToBlockchain({ hash, cid });

      // Notify backend about blockchain success
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
          response?: { data?: { message?: string } };
        };
        alert(
          `⚠️ Blockchain berhasil, tapi update database gagal!\n\n` +
            `Error: ${err.response?.data?.message || err.message}\n` +
            `Sertifikat sudah ada di blockchain. Silakan hubungi administrator.`
        );
      }

      setBlockchainStatus('success');
      setStatusMessage('Sertifikat berhasil disimpan!');
      setPendingBlockchainData(null);

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });

      alert(`🎉 Sertifikat berhasil disimpan dan diverifikasi di blockchain!`);

      // Close modal after short delay
      setTimeout(() => {
        setScoreModalOpen(false);
        setSelectedParticipant(null);
        setBlockchainStatus('idle');
        setStatusMessage('');
      }, 1500);
    } catch (retryError) {
      const err = retryError as Error;
      setBlockchainStatus('error');
      setStatusMessage(`Error: ${err.message}`);
      // Keep pendingBlockchainData for another retry attempt
    }
  }, [pendingBlockchainData, queryClient]);

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
    pendingBlockchainData,

    // Handlers
    setSearchInput,
    handleOpenScoreModal,
    handleSubmitScore,
    handleRefresh,
    handleCloseModal,
    handleRetryBlockchain,
    handleChangeLimit,
    handleChangePage,
    handleClearSearch,
  };
};
