'use client';

import { useEffect, useMemo, useState } from 'react';
import { EnrollmentItem } from '@features/admin';
import { FILTER_OPTIONS } from '@/constants/list.constants';
import AdminEnrollmentsTable, {
  type EnrollmentRow,
} from '@/components/ui/Table/Enrollments';
import ColumnListEnrollments from './columns';
import useEnrollments from './useEnrollments';

type EnrollmentsTableProps = {
  fixedStatus?: EnrollmentItem['status'];
};

  function EnrollmentsTable({ fixedStatus }: EnrollmentsTableProps) {
  const {
    dataEnrollments,
    isLoadingEnrollments,
    isRefetchingEnrollments,
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
  } = useEnrollments({ fixedStatus });

  const [statusFilter, setStatusFilter] = useState<string>(
    currentStatus ?? 'all'
  );

  useEffect(() => {
    setStatusFilter(currentStatus ?? 'all');
  }, [currentStatus]);

  const tableData = useMemo(
    () => (dataEnrollments?.data as EnrollmentItem[]) || [],
    [dataEnrollments]
  );
  const totalPages = dataEnrollments?.pagination?.totalPages || 1;
  const currentPageNumber = Number(currentPage) || 1;
  const currentLimitValue = String(currentLimit);

  const filteredParticipants = useMemo(() => {
    if (enforcedStatus) return tableData;
    if (statusFilter === 'all') return tableData;
    return tableData.filter(
      (participant) => participant.status === statusFilter
    );
  }, [enforcedStatus, statusFilter, tableData]);

  const tableItems: EnrollmentRow[] = useMemo(() => {
    return filteredParticipants.map((participant, idx) => {
      const baseKey =
        participant._id ||
        participant.participantId ||
        `${participant.nim}-${participant.scheduleId}` ||
        `${participant.fullName}-${participant.scheduleId}`;

      return {
        ...participant,
        __rowKey: baseKey || `row-${idx}`,
      };
    });
  }, [filteredParticipants]);

  const statusOptions = useMemo(
    () => [
      { label: 'Semua Status', value: 'all' },
      ...FILTER_OPTIONS.map((option) => ({
        label: option.name,
        value: option.uid,
      })),
    ],
    []
  );

  const showStatusFilter = !enforcedStatus;

  return (
    <>
      <AdminEnrollmentsTable
        columns={ColumnListEnrollments.map((c) => ({ key: c.key || c.uid, name: c.name }))}
        items={tableItems}
        isLoading={isLoadingEnrollments}
        isRefetching={isRefetchingEnrollments}
        currentSearch={currentSearch}
        statusFilter={statusFilter}
        statusOptions={statusOptions}
        showStatusFilter={showStatusFilter}
        currentLimitValue={currentLimitValue}
        currentPageNumber={currentPageNumber}
        totalPages={totalPages}
        totalItems={dataEnrollments?.pagination?.total || 0}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        onChangeStatus={(value) => {
          setStatusFilter(value);
          handleChangeStatus(value);
        }}
        onChangeLimit={handleChangeLimit}
        onChangePage={handleChangePage}
      />
    </>
  );
}

export default EnrollmentsTable;
