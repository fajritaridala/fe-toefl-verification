"use client";

import { useState, useMemo, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Button, 
  Checkbox, 
  Table, 
  TableBody, 
  TableCell, 
  TableColumn, 
  TableHeader, 
  TableRow,
  Spinner,
  Pagination,
  Input,
  Select,
  SelectItem,
} from '@heroui/react';
import { 
  Eye, 
  Check, 
  X, 
  Users, 
  Search,
} from 'lucide-react';
import { enrollmentsService, type EnrollmentItem } from '@features/admin';
import { QuickPreviewModal, ParticipantDetailModal } from '@/components/ui/Modal';
import { LIMIT_LISTS } from '@/constants/list.constants';
import useEnrollments from './shared/useEnrollments';
import { formatDate } from '@/lib/utils';

export default function ValidationPageEnhanced() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

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
  } = useEnrollments({ fixedStatus: 'menunggu' });

  const participants = useMemo(() => {
    const items = (dataEnrollments?.data as EnrollmentItem[]) || [];
    return items.map((item, idx) => ({
      ...item,
      __rowKey: item._id || item.participantId || `enrollment-${idx}`,
    }));
  }, [dataEnrollments]);

  const totalPages = dataEnrollments?.pagination?.totalPages || 1;
  const totalItems = participants.length;

  // Mutations
  const { mutate: approveParticipant, isPending: isApproving } = useMutation({
    mutationFn: (id: string) => enrollmentsService.approve(id, 'disetujui'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      // Auto move to next in preview
      if (currentPreviewIndex < participants.length - 1) {
        setCurrentPreviewIndex(prev => prev + 1);
      } else {
        setPreviewModalOpen(false);
      }
    },
  });

  const { mutate: rejectParticipant, isPending: isRejecting } = useMutation({
    mutationFn: (id: string) => enrollmentsService.approve(id, 'ditolak'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      // Auto move to next in preview
      if (currentPreviewIndex < participants.length - 1) {
        setCurrentPreviewIndex(prev => prev + 1);
      } else {
        setPreviewModalOpen(false);
      }
    },
  });

  const { mutate: bulkApprove, isPending: isBulkApproving } = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map(id => enrollmentsService.approve(id, 'disetujui')));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      setSelectedIds(new Set());
    },
  });

  // Handlers
  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === participants.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(participants.map(p => p._id)));
    }
  }, [selectedIds.size, participants]);

  const handleSelectOne = useCallback((id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleOpenPreview = useCallback((index: number) => {
    setCurrentPreviewIndex(index);
    setPreviewModalOpen(true);
  }, []);

  const handleBulkApprove = useCallback(() => {
    if (confirm(`Approve ${selectedIds.size} peserta sekaligus?`)) {
      bulkApprove(Array.from(selectedIds));
    }
  }, [selectedIds, bulkApprove]);

  const isProcessing = isApproving || isRejecting || isBulkApproving;

  const columns = [
    { key: 'checkbox', name: '', uid: 'checkbox' },
    { key: 'fullName', name: 'Nama Lengkap', uid: 'fullName' },
    { key: 'nim', name: 'NIM', uid: 'nim' },
    { key: 'serviceName', name: 'Layanan', uid: 'serviceName' },
    { key: 'scheduleDate', name: 'Jadwal', uid: 'scheduleDate' },
    { key: 'paymentProof', name: 'Bukti Bayar', uid: 'paymentProof' },
    { key: 'actions', name: 'Actions', uid: 'actions' },
  ];

  const renderCell = useCallback((participant: EnrollmentItem, columnKey: string, rowIndex: number) => {
    switch (columnKey) {
      case 'checkbox':
        return (
          <Checkbox
            isSelected={selectedIds.has(participant._id)}
            onValueChange={() => handleSelectOne(participant._id)}
            isDisabled={isProcessing}
            classNames={{
              wrapper: 'after:bg-primary after:border-primary',
            }}
          />
        );
      
      case 'fullName':
        return (
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-gray-900">{participant.fullName}</p>
            <p className="text-xs text-gray-500">{participant.email || '-'}</p>
          </div>
        );
      
      case 'nim':
        return <p className="text-sm font-medium text-gray-700">{participant.nim}</p>;
      
      case 'serviceName':
        return (
          <p className="font-medium text-gray-700">{participant.serviceName || '-'}</p>
        );
      
      case 'scheduleDate':
        return (
          <p className="text-sm text-gray-700">{formatDate(participant.scheduleDate)}</p>
        );
      
      case 'paymentProof':
        return (
          <Button
            size="sm"
            variant="flat"
            color="primary"
            onPress={() => handleOpenPreview(rowIndex)}
            startContent={<Eye className="w-4 h-4" />}
            className="font-medium"
          >
            Lihat
          </Button>
        );
      
      case 'actions':
        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              isIconOnly
              color="success"
              variant="flat"
              onPress={() => approveParticipant(participant._id)}
              isDisabled={isProcessing}
              className="bg-success-50 text-success-700 hover:bg-success-100"
              title="Approve"
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              isIconOnly
              color="danger"
              variant="flat"
              onPress={() => rejectParticipant(participant._id)}
              isDisabled={isProcessing}
              className="bg-danger-50 text-danger-700 hover:bg-danger-100"
              title="Reject"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  }, [selectedIds, isProcessing, handleSelectOne, handleOpenPreview, approveParticipant, rejectParticipant]);

  const currentParticipant = participants[currentPreviewIndex];

  return (
    <section className="space-y-4">
      {/* Page Header - Outside Card */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Validasi Peserta</h1>
        <p className="text-sm text-gray-500 mt-1">
          Approve atau reject pendaftaran peserta baru
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between gap-4">
            <Input
              isClearable
              type="search"
              placeholder="🔍 Cari berdasarkan nama atau NIM..."
              startContent={<Search className="w-4 h-4 text-gray-400" />}
              value={currentSearch}
              onClear={handleClearSearch}
              onValueChange={handleSearch}
              classNames={{
                base: 'w-full max-w-md',
                inputWrapper: 'h-10 bg-white border border-gray-200 hover:border-gray-300',
                input: 'text-sm',
              }}
            />

            <Select
              disallowEmptySelection
              aria-label="Items per page"
              selectedKeys={new Set([String(currentLimit)])}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0];
                handleChangeLimit(value as string);
              }}
              classNames={{
                base: 'w-24',
                trigger: 'h-10 bg-white border border-gray-200 hover:border-gray-300',
                value: 'text-sm',
              }}
            >
              {LIMIT_LISTS.map((limit) => (
                <SelectItem key={limit.value}>{limit.label}</SelectItem>
              ))}
            </Select>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedIds.size > 0 && (
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-900">
                <Users className="w-5 h-5" />
                <span className="font-medium">{selectedIds.size} peserta dipilih</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="light"
                  onPress={() => setSelectedIds(new Set())}
                  isDisabled={isProcessing}
                  className="text-blue-700 hover:bg-blue-100"
                >
                  Clear Selection
                </Button>
                <Button
                  size="sm"
                  color="success"
                  onPress={handleBulkApprove}
                  isDisabled={isProcessing}
                  isLoading={isBulkApproving}
                  startContent={!isBulkApproving && <Check className="w-4 h-4" />}
                  className="bg-green-600 text-white font-semibold hover:bg-green-700"
                >
                  Approve Selected ({selectedIds.size})
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-b-xl">
          <Table
            aria-label="Validation table"
            removeWrapper
            classNames={{
              th: 'bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wide px-6 py-4 border-b border-gray-200',
              td: 'px-6 py-4 text-sm text-gray-900 border-b border-gray-100',
              tr: 'hover:bg-gray-50/50 transition-colors',
              base: 'min-w-full',
            }}
          >
            <TableHeader columns={columns}>
              {(col) => (
                <TableColumn 
                  key={col.uid}
                  width={col.key === 'checkbox' ? 40 : undefined}
                >
                  {col.key === 'checkbox' ? (
                    <Checkbox
                      isSelected={selectedIds.size === participants.length && participants.length > 0}
                      isIndeterminate={selectedIds.size > 0 && selectedIds.size < participants.length}
                      onValueChange={handleSelectAll}
                      isDisabled={isProcessing || participants.length === 0}
                      classNames={{
                        wrapper: 'after:bg-primary after:border-primary',
                      }}
                    />
                  ) : (
                    col.name
                  )}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={participants || []}
              isLoading={isLoadingEnrollments}
              loadingContent={
                <div className="flex flex-col items-center justify-center py-12">
                  <Spinner size="lg" color="primary" />
                  <p className="text-sm text-gray-500 mt-3">Memuat data peserta...</p>
                </div>
              }
              emptyContent={
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-base font-medium text-gray-900">Tidak ada peserta menunggu validasi</p>
                  <p className="text-sm text-gray-500 mt-1">Semua peserta sudah diproses</p>
                </div>
              }
            >
              {(item) => (
                <TableRow key={item.__rowKey || item._id}>
                  {columns.map((col) => (
                    <TableCell key={col.uid}>
                      {renderCell(item, col.key, participants.indexOf(item))}
                    </TableCell>
                  ))}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isRefetchingEnrollments && (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" color="primary" />
                  <span className="text-xs text-gray-500">Menyegarkan...</span>
                </div>
              )}
              <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                <span className="text-sm text-gray-600">
                  Menampilkan <span className="font-semibold text-gray-900">{participants.length}</span> dari{' '}
                  <span className="font-semibold text-gray-900">{totalItems}</span> peserta
                </span>
              </div>
            </div>

            {totalPages > 1 && (
              <Pagination
                isCompact
                showControls
                page={Number(currentPage)}
                total={totalPages}
                onChange={handleChangePage}
                classNames={{
                  item: 'bg-white border border-gray-200 hover:bg-gray-50',
                  cursor: 'bg-primary text-white font-semibold',
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Quick Preview Modal */}
      <QuickPreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        participant={currentParticipant}
        currentIndex={currentPreviewIndex}
        totalParticipants={participants.length}
        onNext={() => setCurrentPreviewIndex(prev => Math.min(prev + 1, participants.length - 1))}
        onPrevious={() => setCurrentPreviewIndex(prev => Math.max(prev - 1, 0))}
        onApprove={(id) => approveParticipant(id)}
        onReject={(id) => rejectParticipant(id)}
        onViewDetail={() => {
          setPreviewModalOpen(false);
          setDetailModalOpen(true);
        }}
        isProcessing={isProcessing}
      />

      {/* Detail Modal */}
      <ParticipantDetailModal
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setPreviewModalOpen(true); // Go back to preview
        }}
        participant={currentParticipant}
      />
    </section>
  );
}
