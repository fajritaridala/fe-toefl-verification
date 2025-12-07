import { Key, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { CiSearch } from 'react-icons/ci';
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  type Selection,
} from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LuCheck, LuFilter, LuListChecks, LuX } from 'react-icons/lu';
import enrollmentsService from '@/services/enrollments.service';
import { EnrollmentItem } from '@/utils/interfaces/Schedule';
import { FILTER_OPTIONS, LIMIT_LISTS } from '@/constants/list.constants';
import AddInputModal from './AddInputModal';
import ColumnListParticipants from './Participants.constants';
import useParticipants from './useParticipants';

type ParticipantsProps = {
  fixedStatus?: EnrollmentItem['status'];
};

function Participants({ fixedStatus }: ParticipantsProps) {
  const [selectedParticipant, setSelectedParticipant] = useState<{
    participantId: string;
    name: string;
  } | null>(null);
  const {
    dataParticipants,
    isLoadingParticipants,
    isRefetchingParticipants,
    currentLimit,
    currentPage,
    currentSearch,
    currentStatus,
    handleChangeLimit,
    handleChangePage,
    handleSearch,
    handleClearSearch,
    handleChangeStatus,
    fixedStatus: enforcedStatus,
  } = useParticipants({ fixedStatus });
  const [statusFilter, setStatusFilter] = useState<string>(currentStatus ?? 'all');

  useEffect(() => {
    setStatusFilter(currentStatus ?? 'all');
  }, [currentStatus]);

  const queryClient = useQueryClient();

  const { mutate: updateEnrollmentStatus, isPending: isUpdatingStatus } =
    useMutation({
      mutationFn: ({
        enrollId,
        status,
      }: {
        enrollId: string;
        status: 'disetujui' | 'ditolak';
      }) => enrollmentsService.approve(enrollId, status),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      },
    });

  const tableData = useMemo(
    () => (dataParticipants?.data as EnrollmentItem[]) || [],
    [dataParticipants]
  );
  const totalPages = dataParticipants?.pagination?.totalPages || 1;
  const currentPageNumber = Number(currentPage) || 1;
  const currentLimitValue = String(currentLimit);

  const filteredParticipants = useMemo(() => {
    if (enforcedStatus) return tableData;
    if (statusFilter === 'all') return tableData;
    return tableData.filter((participant) => participant.status === statusFilter);
  }, [enforcedStatus, statusFilter, tableData]);

  const statusOptions = useMemo(
    () =>
      [{ label: 'Semua Status', value: 'all' }, ...FILTER_OPTIONS.map((option) => ({ label: option.name, value: option.uid }))],
    []
  );

  const showStatusFilter = !enforcedStatus;

  const handleOpenScoreModal = useCallback((participant: EnrollmentItem) => {
    const participantId = participant.participantId || participant._id;
    if (!participantId) return;
    setSelectedParticipant({ participantId, name: participant.fullName });
  }, []);

  const renderStatusChip = (status: EnrollmentItem['status']) => {
    const color =
      status === 'disetujui'
        ? 'success'
        : status === 'ditolak'
          ? 'danger'
          : 'warning';
    return (
      <Chip
        size="sm"
        variant="flat"
        color={color}
        className="font-semibold capitalize"
      >
        {status}
      </Chip>
    );
  };

  const renderCell = useCallback(
    (participant: EnrollmentItem, columnKey: Key): ReactNode => {
      switch (columnKey) {
        case 'fullName':
          return (
            <div className="flex flex-col">
              <p className="text-text text-sm font-semibold">
                {participant.fullName}
              </p>
              <span className="text-2xsmall text-text-muted">
                {participant.email || 'Email tidak tersedia'}
              </span>
            </div>
          );
        case 'status':
          return renderStatusChip(participant.status);
        case 'scheduleId':
          return (
            <span className="text-2xsmall text-text-muted font-mono">
              {participant.scheduleId || '-'}
            </span>
          );
        case 'actions': {
          if (enforcedStatus === 'menunggu') {
            return (
              <div className="flex items-center gap-2">
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  color="success"
                  aria-label="Setujui peserta"
                  onPress={() =>
                    updateEnrollmentStatus({
                      enrollId: participant._id,
                      status: 'disetujui',
                    })
                  }
                  isDisabled={isUpdatingStatus}
                >
                  <LuCheck />
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  color="danger"
                  aria-label="Tolak peserta"
                  onPress={() =>
                    updateEnrollmentStatus({
                      enrollId: participant._id,
                      status: 'ditolak',
                    })
                  }
                  isDisabled={isUpdatingStatus}
                >
                  <LuX />
                </Button>
              </div>
            );
          }

          if (enforcedStatus === 'disetujui') {
            return (
              <Button
                size="sm"
                variant="flat"
                className="bg-primary/5 text-primary font-semibold"
                startContent={<LuListChecks />}
                onPress={() => handleOpenScoreModal(participant)}
              >
                Input Nilai
              </Button>
            );
          }

          return (
            <Dropdown>
              <DropdownTrigger>
                <Button size="sm" variant="light">
                  <BiDotsVerticalRounded className="text-default-700 text-[1.2rem]" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {participant.status === 'menunggu' && (
                  <>
                    <DropdownItem
                      key="approve-enrollment"
                      onPress={() =>
                        updateEnrollmentStatus({
                          enrollId: participant._id,
                          status: 'disetujui',
                        })
                      }
                      isDisabled={isUpdatingStatus}
                    >
                      Setujui
                    </DropdownItem>
                    <DropdownItem
                      key="reject-enrollment"
                      className="text-danger"
                      onPress={() =>
                        updateEnrollmentStatus({
                          enrollId: participant._id,
                          status: 'ditolak',
                        })
                      }
                      isDisabled={isUpdatingStatus}
                    >
                      Tolak
                    </DropdownItem>
                  </>
                )}
              </DropdownMenu>
            </Dropdown>
          );
        }
        default:
          return (participant as Record<string, ReactNode>)[
            columnKey as keyof EnrollmentItem
          ] as ReactNode;
      }
    },
    [enforcedStatus, handleOpenScoreModal, isUpdatingStatus, updateEnrollmentStatus]
  );

  const handleStatusSelection = (keys: Selection) => {
    if (!showStatusFilter) return;
    if (keys === 'all') {
      setStatusFilter('all');
      handleChangeStatus('all');
      return;
    }
    const firstKey =
      keys instanceof Set && keys.size > 0
        ? Array.from(keys)[0]?.toString()
        : typeof keys === 'string'
          ? keys
          : undefined;
    setStatusFilter(firstKey || 'all');
    handleChangeStatus(firstKey || 'all');
  };

  const handleLimitSelection = (keys: Selection) => {
    if (keys === 'all') return;
    const firstKey =
      keys instanceof Set && keys.size > 0
        ? Array.from(keys)[0]?.toString()
        : typeof keys === 'string'
          ? keys
          : undefined;
    if (!firstKey) return;
    handleChangeLimit(firstKey);
  };

  const topContent = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 lg:flex-row lg:flex-1">
          <Input
            isClearable
            placeholder="Cari peserta"
            startContent={<CiSearch size={20} className="text-text-muted" />}
            value={currentSearch}
            onChange={handleSearch}
            onClear={handleClearSearch}
            className="w-full lg:w-52"
            classNames={{
              inputWrapper:
                'bg-bg-light min-h-10 h-10 border border-border shadow-none',
            }}
          />
          {showStatusFilter ? (
            <Select
              selectedKeys={new Set([statusFilter])}
              onSelectionChange={handleStatusSelection}
              variant="bordered"
              labelPlacement="outside"
              placeholder="Filter status"
              className="w-full lg:w-52"
              startContent={<LuFilter className="text-text-muted" />}
              disallowEmptySelection
              classNames={{
                trigger: 'bg-bg-light min-h-10 h-10 border border-border',
                value: 'text-small font-semibold',
              }}
            >
              {statusOptions.map((option) => (
                <SelectItem key={option.value}>{option.label}</SelectItem>
              ))}
            </Select>
          ) : null}
        </div>
        {isRefetchingParticipants && (
          <div className="flex items-center gap-2 text-text-muted">
            <Spinner size="sm" color="secondary" />
            <span className="text-2xsmall font-semibold">Memuat...</span>
          </div>
        )}
      </div>
    </div>
  );

  const bottomContent = (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="bg-bg-light text-text-muted flex items-center gap-2 rounded-lg px-4 py-2 text-xsmall font-semibold shadow">
        <span>Tampilkan</span>
        <Select
          selectedKeys={new Set([currentLimitValue])}
          onSelectionChange={handleLimitSelection}
          disallowEmptySelection
          className="w-16"
          classNames={{
            trigger: 'h-7 min-h-7 rounded-md border border-border',
            value: 'text-xsmall',
          }}
        >
          {LIMIT_LISTS.map((option) => (
            <SelectItem key={String(option.value)}>{option.label}</SelectItem>
          ))}
        </Select>
        <span>baris</span>
      </div>
      <div className="bg-bg-light flex w-full justify-end rounded-lg px-4 py-1 shadow lg:w-auto">
        {totalPages > 1 && (
          <Pagination
            isCompact
            showControls
            variant="light"
            page={currentPageNumber}
            total={totalPages}
            onChange={handleChangePage}
            classNames={{
              wrapper: 'min-h-8 h-8',
              prev: 'h-7',
              next: 'h-7',
              cursor:
                'h-7 min-w-7 w-7 bg-bg border border-border text-text rounded-lg',
            }}
          />
        )}
      </div>
    </div>
  );

  return (
    <section className="space-y-6 pt-4">
      <Table
        aria-label="Tabel peserta"
        classNames={{ base: 'min-w-full', wrapper: 'rounded-lg shadow' }}
        topContent={topContent}
        topContentPlacement="outside"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
      >
        <TableHeader columns={ColumnListParticipants}>
          {(column) => (
            <TableColumn key={column.uid} className="text-2xsmall uppercase">
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={filteredParticipants}
          emptyContent="Belum ada peserta"
          isLoading={isLoadingParticipants || isRefetchingParticipants}
          loadingContent={<Spinner color="secondary" />}
        >
          {(participant) => {
            const rowKey =
              participant._id ||
              participant.participantId ||
              participant.scheduleId ||
              participant.email ||
              participant.nim ||
              JSON.stringify(participant);
            return (
              <TableRow
                key={rowKey}
                className="border-border border-b last:border-0"
              >
                {ColumnListParticipants.map((column) => (
                  <TableCell className="text-xsmall" key={column.uid}>
                    {renderCell(participant, column.uid as Key)}
                  </TableCell>
                ))}
              </TableRow>
            );
          }}
        </TableBody>
      </Table>

      {selectedParticipant && (
        <AddInputModal
          participantId={selectedParticipant.participantId}
          participantName={selectedParticipant.name}
          isOpen
          onClose={() => setSelectedParticipant(null)}
          onSuccess={() =>
            queryClient.invalidateQueries({ queryKey: ['enrollments'] })
          }
        />
      )}
    </section>
  );
}

export default Participants;
