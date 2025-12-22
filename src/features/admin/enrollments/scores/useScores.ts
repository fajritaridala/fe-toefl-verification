import { useCallback, useEffect, useState } from 'react';
import {
  type EnrollmentItem,
  EnrollmentStatus,
} from '@features/admin/enrollments/enrollment.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import blockchainService from '@/domain/blockchain.services';
import { enrollmentsService } from '@/domain/enroll.services';
import { useDebounce } from '@/hooks/useDebounce';
import useEnrollments from '../shared/useEnrollments';

// --- Types ---
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

interface BlockchainData {
  hash: string;
  cid: string;
  enrollId: string;
  participantId: string;
}

type BlockchainStatus =
  | 'idle'
  | 'submitting'
  | 'uploading-ipfs'
  | 'storing-blockchain'
  | 'updating-status'
  | 'success'
  | 'error';

// --- Helper Functions ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isUserRejectionError = (err: any): boolean => {
  return (
    err?.code === 4001 ||
    err?.code === 'ACTION_REJECTED' ||
    err?.message?.toLowerCase().includes('user rejected') ||
    err?.info?.error?.code === 4001
  );
};

export const useScores = () => {
  const queryClient = useQueryClient();

  // --- State ---
  const [selectedParticipant, setSelectedParticipant] =
    useState<EnrollmentItem | null>(null);
  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // Blockchain & Status State
  const [blockchainStatus, setBlockchainStatus] =
    useState<BlockchainStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [pendingBlockchainData, setPendingBlockchainData] =
    useState<BlockchainData | null>(null);

  // --- Data Fetching (UseEnrollments Composed) ---
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
  } = useEnrollments({ fixedStatus: EnrollmentStatus.APPROVED });

  // --- Search Logic (Integrated) ---
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    handleSearch(debouncedSearch);
  }, [debouncedSearch]);

  // No need for separate handleClearSearch, useEnrollments provides it or we wrap it
  const onClearSearch = useCallback(() => {
    setSearchInput('');
    handleClearSearch();
  }, [handleClearSearch]);

  // --- Core Logic: Blockchain Transaction Flow ---
  // Fungsi ini digunakan ulang oleh submitScore dan handleRetryBlockchain
  const processBlockchainTransaction = useCallback(
    async (data: BlockchainData) => {
      const { hash, cid, enrollId, participantId } = data;

      try {
        // 1. Store to Blockchain
        setBlockchainStatus('storing-blockchain');
        setStatusMessage(
          'Menyimpan ke blockchain (mohon konfirmasi di wallet)...'
        );

        await blockchainService.store({ hash, cid });

        // 2. Update Backend Status
        setBlockchainStatus('updating-status');
        setStatusMessage('Memperbarui status peserta...');

        try {
          await enrollmentsService.blockchainSuccess(
            enrollId,
            participantId,
            hash
          );
        } catch (backendError) {
          console.error(
            'Backend status update error (silent fail):',
            backendError
          );
          // Kita tidak throw error di sini karena data sudah masuk blockchain,
          // user tetap dianggap sukses secara teknis blockchain.
        }

        // 3. Success State
        setBlockchainStatus('success');
        setStatusMessage('Sertifikat berhasil disimpan!');
        setPendingBlockchainData(null); // Clear pending data
        queryClient.invalidateQueries({ queryKey: ['enrollments'] });

        // 4. Cleanup & Close Modal
        setTimeout(() => {
          setScoreModalOpen(false);
          setSelectedParticipant(null);
          setBlockchainStatus('idle');
          setStatusMessage('');
        }, 1500);
      } catch (error) {
        console.error('Blockchain transaction error:', error);
        setBlockchainStatus('error');

        if (isUserRejectionError(error)) {
          setStatusMessage('Transaksi dibatalkan oleh pengguna.');
        } else {
          setStatusMessage(
            `Error Blockchain: ${(error as any).message || 'Unknown error'}`
          );
        }

        // Simpan data agar bisa di-retry
        setPendingBlockchainData(data);
      }
    },
    [queryClient]
  );

  // --- Mutation: Submit Score to Backend ---
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
    onSuccess: (response) => {
      const data = response.data;
      if (!data || !data.hash || !data.cid) {
        setBlockchainStatus('error');
        setStatusMessage('Respon server tidak valid (Hash/CID hilang).');
        return;
      }

      // Lanjutkan ke proses blockchain
      processBlockchainTransaction({
        hash: data.hash,
        cid: data.cid,
        enrollId: data.enrollId,
        participantId: data.participantId,
      });
    },
    onError: (error: Error) => {
      console.error('Submission error:', error);
      setBlockchainStatus('error');
      setStatusMessage(`Gagal mengirim nilai: ${error.message}`);

      setTimeout(() => {
        setBlockchainStatus('idle');
        setStatusMessage('');
      }, 3000);
    },
  });

  // --- Handlers ---
  const handleOpenScoreModal = useCallback((participant: EnrollmentItem) => {
    setSelectedParticipant(participant);
    setScoreModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setScoreModalOpen(false);
    setTimeout(() => {
      setSelectedParticipant(null);
      setPendingBlockchainData(null);
      setBlockchainStatus('idle');
      setStatusMessage('');
    }, 400);
  }, []);

  const handleSubmitScore = useCallback(
    (
      enrollId: string,
      participantId: string,
      scores: { listening: number; structure: number; reading: number }
    ) => {
      submitScore({ enrollId, participantId, scores });
    },
    [submitScore]
  );

  const handleRetryBlockchain = useCallback(() => {
    if (pendingBlockchainData) {
      processBlockchainTransaction(pendingBlockchainData);
    }
  }, [pendingBlockchainData, processBlockchainTransaction]);

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['enrollments'] });
  }, [queryClient]);

  return {
    // State
    selectedParticipant,
    scoreModalOpen,

    isSubmittingScore,
    blockchainStatus,
    statusMessage,
    pendingBlockchainData,

    // Handlers
    handleOpenScoreModal,
    handleCloseModal,
    handleSubmitScore,
    handleRetryBlockchain,
    handleRefresh,
    // List Data & Handlers (Pass-through from useEnrollments)
    dataEnrollments,
    isLoadingEnrollments,
    isRefetchingEnrollments,
    currentLimit,
    currentPage,
    handleChangeLimit,
    handleChangePage,

    // Search
    setSearchInput,
    searchInput,
    handleClearSearch: onClearSearch,
  };
};
