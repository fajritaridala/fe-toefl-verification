import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  type EnrollmentItem,
  EnrollmentStatus,
} from '@features/admin/enrollments/enrollment.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentsService } from '@/domain/enroll.services';
import { useDebounce } from '@/hooks/useDebounce';
import useEnrollments from '../shared/useEnrollments';

// Tipe status untuk aksi validasi
type ValidationStatus = 'disetujui' | 'ditolak';

export const useValidation = () => {
  const queryClient = useQueryClient();

  // --- State Lokal ---
  // Mengatur visibilitas modal preview dan detail
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  // State pencarian lokal
  const [searchInput, setSearchInput] = useState('');

  // --- Data Fetching ---
  // Menggunakan shared hook untuk mengambil daftar pendaftaran
  // Hanya mengambil data dengan status 'PENDING' (menunggu validasi)
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
    currentSearch,
  } = useEnrollments({ fixedStatus: EnrollmentStatus.PENDING });

  // --- Logika Pencarian (Search) ---
  // Menggunakan debounce (500ms) untuk mencegah request API berlebihan saat user mengetik
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    // Prevent infinite loop by checking if value actually changed
    if (debouncedSearch !== currentSearch) {
      handleSearch(debouncedSearch);
    }
  }, [debouncedSearch, handleSearch, currentSearch]);

  const handleClearLocalSearch = useCallback(() => {
    setSearchInput('');
    handleClearSearch();
  }, [handleClearSearch]);

  // --- Transformasi Data ---
  // Menambahkan properti unik (__rowKey) untuk keperluan rendering list/tabel
  const participants = useMemo(() => {
    const items = (dataEnrollments?.data as EnrollmentItem[]) || [];
    return items.map((item, idx) => ({
      ...item,
      __rowKey: item.enrollId || item.participantId || `enrollment-${idx}`,
    }));
  }, [dataEnrollments]);

  const totalPages = dataEnrollments?.pagination?.totalPages || 1;

  // Mengambil data peserta yang sedang dipilih berdasarkan index
  const currentParticipant = participants[currentPreviewIndex];

  // --- Mutasi (Aksi Validasi) ---
  // Menangani request API untuk menyetujui atau menolak peserta
  const { mutate: processValidation, isPending: isProcessing } = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: ValidationStatus;
    }) => {
      return await enrollmentsService.approve(id, status);
    },
    onSuccess: () => {
      // 1. Tutup semua modal segera agar UI terasa responsif
      setPreviewModalOpen(false);
      setDetailModalOpen(false);

      // 2. Beri jeda sedikit (450ms) sebelum refresh data
      // Tujuannya agar animasi penutupan modal selesai dulu, mencegah glitch visual
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      }, 450);
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message || error.message || 'Terjadi kesalahan';
      alert(`Gagal memproses validasi: ${msg}`);
    },
  });

  // Wrapper function untuk mempermudah pemanggilan di UI
  const approveParticipant = (id: string) =>
    processValidation({ id, status: 'disetujui' });
  const rejectParticipant = (id: string) =>
    processValidation({ id, status: 'ditolak' });

  // --- Handlers (Navigasi Modal) ---

  // Membuka modal preview untuk peserta tertentu
  const handleOpenPreview = useCallback((index: number) => {
    setCurrentPreviewIndex(index);
    setPreviewModalOpen(true);
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewModalOpen(false);
  }, []);

  // Menutup detail dan kembali ke modal preview (tombol Back)
  const handleCloseDetail = useCallback(() => {
    setDetailModalOpen(false);
    setPreviewModalOpen(true);
  }, []);

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['enrollments'] });
  }, [queryClient]);

  return {
    // State Data & UI
    participants,
    currentParticipant,
    previewModalOpen,
    detailModalOpen,
    currentPreviewIndex,

    // Status Loading
    isLoadingEnrollments,
    isRefetchingEnrollments,
    isProcessing,

    // Pagination Info
    totalPages,
    currentLimit,
    currentPage,

    // Input Search
    searchInput,

    // Actions / Handlers
    setSearchInput,
    handleClearSearch: handleClearLocalSearch,
    handleOpenPreview,
    handleClosePreview,
    handleCloseDetail,
    handleRefresh,
    handleChangeLimit,
    handleChangePage,

    // Core Actions (Validation)
    approveParticipant,
    rejectParticipant,
  };
};
