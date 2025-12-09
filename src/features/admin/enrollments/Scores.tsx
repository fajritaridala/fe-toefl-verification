"use client";

import { useState, useMemo, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Button, 
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
  Search, 
  PenSquare
} from 'lucide-react';
import { enrollmentsService, type EnrollmentItem } from '@features/admin';
import { ScoreInputModal } from '@/components/ui/Modal';
import { LIMIT_LISTS } from '@/constants/list.constants';
import useEnrollments from './shared/useEnrollments';
import { formatDate } from '@/lib/utils';

export default function ScoresPageEnhanced() {
  const [selectedParticipant, setSelectedParticipant] = useState<{
    _id: string;
    fullName: string;
    nim: string;
    scheduleId?: string;
  } | null>(null);
  const [scoreModalOpen, setScoreModalOpen] = useState(false);

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
  } = useEnrollments({ fixedStatus: 'disetujui' });

  const participants = useMemo(() => {
    const items = (dataEnrollments?.data as EnrollmentItem[]) || [];
    return items.map((item, idx) => ({
      ...item,
      __rowKey: item._id || item.participantId || `score-${idx}`,
    }));
  }, [dataEnrollments]);

  const totalPages = dataEnrollments?.pagination?.totalPages || 1;
  const totalItems = participants.length;

  // Score submission mutation
  const { mutate: submitScore, isPending: isSubmittingScore } = useMutation({
    mutationFn: ({ participantId, scores }: { 
      participantId: string; 
      scores: { listening: number; structure: number; reading: number } 
    }) => enrollmentsService.submitScore(participantId, scores),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      setScoreModalOpen(false);
      setSelectedParticipant(null);
    },
  });

  // Handlers
  const handleOpenScoreModal = useCallback((participant: EnrollmentItem) => {
    setSelectedParticipant({
      _id: participant._id,
      fullName: participant.fullName,
      nim: participant.nim,
      scheduleId: participant.scheduleId,
    });
    setScoreModalOpen(true);
  }, []);

  const handleSubmitScore = useCallback((participantId: string, scores: { 
    listening: number; 
    structure: number; 
    reading: number 
  }) => {
    submitScore({ participantId, scores });
  }, [submitScore]);

  const columns = [
    { key: 'fullName', name: 'Nama Lengkap', uid: 'fullName' },
    { key: 'nim', name: 'NIM', uid: 'nim' },
    { key: 'serviceName', name: 'Layanan', uid: 'serviceName' },
    { key: 'scheduleDate', name: 'Jadwal', uid: 'scheduleDate' },
    { key: 'status', name: 'Status', uid: 'status' },
    { key: 'actions', name: 'Actions', uid: 'actions' },
  ];

  const renderCell = useCallback((participant: EnrollmentItem, columnKey: string) => {
    switch (columnKey) {
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
      
      case 'status':
        // Check if participant has score based on status or score fields
        const hasScore = participant.status === 'selesai' || 
                        (participant.listening !== undefined && 
                         participant.structure !== undefined && 
                         participant.reading !== undefined);
        
        return hasScore ? (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-[1.5px] bg-transparent border-green-600 text-green-700 font-medium text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
            Selesai
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-[1.5px] bg-transparent border-gray-400 text-gray-700 font-medium text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            Belum Dinilai
          </span>
        );
      
      case 'actions':
        return (
          <Button
            size="sm"
            color="primary"
            variant="flat"
            onPress={() => handleOpenScoreModal(participant)}
            startContent={<PenSquare className="w-4 h-4" />}
            className="font-medium"
          >
            Input Nilai
          </Button>
        );
      
      default:
        return null;
    }
  }, [handleOpenScoreModal]);

  return (
    <section className="space-y-4">
      {/* Page Header - Outside Card */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Input Nilai Peserta</h1>
        <p className="text-sm text-gray-500 mt-1">
          Input nilai untuk peserta yang sudah disetujui
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

        {/* Table */}
        <div className="overflow-x-auto rounded-b-xl">
          <Table
            aria-label="Scores table"
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
                <TableColumn key={col.uid}>{col.name}</TableColumn>
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
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-base font-medium text-gray-900">Tidak ada peserta yang disetujui</p>
                  <p className="text-sm text-gray-500 mt-1">Belum ada peserta untuk input nilai</p>
                </div>
              }
            >
              {(item) => (
                <TableRow key={item.__rowKey || item._id}>
                  {columns.map((col) => (
                    <TableCell key={col.uid}>
                      {renderCell(item, col.key)}
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

      {/* Score Input Modal */}
      <ScoreInputModal
        isOpen={scoreModalOpen}
        onClose={() => {
          setScoreModalOpen(false);
          setSelectedParticipant(null);
        }}
        participant={selectedParticipant}
        onSubmit={handleSubmitScore}
        isSubmitting={isSubmittingScore}
      />
    </section>
  );
}
