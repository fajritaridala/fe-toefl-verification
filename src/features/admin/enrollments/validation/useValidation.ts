import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  type EnrollmentItem,
  EnrollmentStatus,
} from '@features/admin/enrollments/enrollment.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentsService } from '@/domain/enroll.services';
import useEnrollments from '../shared/useEnrollments';

export const useValidation = () => {
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [searchInput, setSearchInput] = useState('');

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
  } = useEnrollments({ fixedStatus: EnrollmentStatus.PENDING });

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
      __rowKey: item.enrollId || item.participantId || `enrollment-${idx}`,
    }));
  }, [dataEnrollments]);

  const totalPages = dataEnrollments?.pagination?.totalPages || 1;

  // Mutations
  const { mutate: approveParticipant, isPending: isApproving } = useMutation({
    mutationFn: async (id: string) => {
      console.log('Approving participant:', id);
      const response = await enrollmentsService.approve(id, 'disetujui');
      console.log('Approve response:', response);
      return response;
    },
    onSuccess: () => {
      console.log('Approve success!');
      // Close modal to trigger exit animation
      setPreviewModalOpen(false);
      setDetailModalOpen(false); // Ensure both are closed

      // Wait for animation to finish before refetching data
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['enrollments'] });
        // Reset preview if needed, or let the list rebuild
      }, 450);
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      console.error('Approve error:', error);
      console.error('Error response:', error?.response?.data);
      alert(
        `Gagal menyetujui peserta: ${error?.response?.data?.message || error.message}`
      );
    },
  });

  const { mutate: rejectParticipant, isPending: isRejecting } = useMutation({
    mutationFn: async (id: string) => {
      console.log('Rejecting participant:', id);
      const response = await enrollmentsService.approve(id, 'ditolak');
      console.log('Reject response:', response);
      return response;
    },
    onSuccess: () => {
      console.log('Reject success!');
      // Close modal to trigger exit animation
      setPreviewModalOpen(false);
      setDetailModalOpen(false);

      // Wait for animation to finish before refetching data
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      }, 450);
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      console.error('Reject error:', error);
      console.error('Error response:', error?.response?.data);
      alert(
        `Gagal menolak peserta: ${error?.response?.data?.message || error.message}`
      );
    },
  });

  // Handlers
  const handleOpenPreview = useCallback((index: number) => {
    setCurrentPreviewIndex(index);
    setPreviewModalOpen(true);
  }, []);

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['enrollments'] });
  }, [queryClient]);

  const handleClosePreview = useCallback(() => {
    setPreviewModalOpen(false);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setDetailModalOpen(false);
    setPreviewModalOpen(true); // Go back to preview
  }, []);

  const isProcessing = isApproving || isRejecting;
  const currentParticipant = participants[currentPreviewIndex];

  return {
    // State
    previewModalOpen,
    detailModalOpen,
    currentPreviewIndex,
    searchInput,
    participants,
    currentParticipant,
    totalPages,
    currentLimit,
    currentPage,
    isLoadingEnrollments,
    isRefetchingEnrollments,
    isProcessing,

    // Handlers
    setSearchInput,
    handleOpenPreview,
    handleRefresh,
    handleClosePreview,
    handleCloseDetail,
    handleChangeLimit,
    handleChangePage,
    handleClearSearch,
    approveParticipant,
    rejectParticipant,
  };
};
