'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { type Variants, motion } from 'framer-motion';
import DashboardLayout from '@/components/layouts/Dashboard';
import AddScheduleModal from '@/components/ui/Modal/AddScheduleModal';
import DeleteScheduleModal from '@/components/ui/Modal/DeleteScheduleModal';
import ScheduleParticipantsModal from '@/components/ui/Modal/ScheduleParticipantsModal';
import ScheduleTable from '@/components/ui/Table/ScheduleTable';
import usePagination from '@/hooks/usePagination';
import useServiceOptions from '@/hooks/useServiceOptions';
import { schedulesService } from '@/services/admin.service';
import { ScheduleItem, ScheduleListResponse } from '@/types/admin.types';

// ============ CONSTANTS ============
type ScheduleTableColumnKey =
  | 'scheduleDate'
  | 'service'
  | 'quota'
  | 'status'
  | 'actions';

type ScheduleTableColumn = {
  key: ScheduleTableColumnKey;
  label: string;
  className?: string;
};

type MonthOption = {
  label: string;
  value: string;
};

const ALL_SERVICE_OPTION_VALUE = '__all__';
const ALL_MONTH_OPTION_VALUE = '__all_month__';

const MONTH_FILTER_OPTIONS: MonthOption[] = [
  { label: 'Bulan', value: ALL_MONTH_OPTION_VALUE },
  { label: 'Januari', value: '01' },
  { label: 'Februari', value: '02' },
  { label: 'Maret', value: '03' },
  { label: 'April', value: '04' },
  { label: 'Mei', value: '05' },
  { label: 'Juni', value: '06' },
  { label: 'Juli', value: '07' },
  { label: 'Agustus', value: '08' },
  { label: 'September', value: '09' },
  { label: 'Oktober', value: '10' },
  { label: 'November', value: '11' },
  { label: 'Desember', value: '12' },
];

const SCHEDULE_TABLE_COLUMNS: ScheduleTableColumn[] = [
  { key: 'scheduleDate', label: 'Tanggal', className: 'w-36' },
  { key: 'service', label: 'Layanan', className: 'w-44 text-center' },
  { key: 'quota', label: 'Kuota', className: 'w-48 text-center' },
  { key: 'status', label: 'Status', className: 'w-36 text-center' },
  { key: 'actions', label: 'Aksi', className: 'w-20 text-center' },
];

// ============ ANIMATION VARIANTS ============
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

// ============ HOOK: useSchedules ============
const useSchedules = () => {
  const {
    currentPage,
    currentLimit,
    getParam,
    setParams,
    handleChangePage,
    handleChangeLimit,
  } = usePagination();

  const { serviceOptions } = useServiceOptions();

  const currentMonth = getParam('month');
  const currentService = getParam('serviceId');

  const {
    data: schedulesResponse,
    isLoading: isLoadingSchedules,
    isRefetching: isRefetchingSchedules,
  } = useQuery({
    queryKey: [
      'schedules',
      'admin',
      currentPage,
      currentLimit,
      currentMonth,
      currentService,
    ],
    queryFn: async () => {
      const response = await schedulesService.getSchedules({
        page: Number(currentPage),
        limit: Number(currentLimit),
        month:
          currentMonth && currentMonth !== ALL_MONTH_OPTION_VALUE
            ? currentMonth
            : undefined,
        serviceId: currentService || undefined,
      });
      return response.data as ScheduleListResponse;
    },
    enabled: !!currentPage && !!currentLimit,
  });

  const schedules = useMemo(() => {
    const items = schedulesResponse?.data || [];
    return items.map((item, idx) => ({
      ...item,
      __rowKey: item.scheduleId || `schedule-${idx}`,
    }));
  }, [schedulesResponse]);

  const pagination = useMemo(
    () => schedulesResponse?.pagination,
    [schedulesResponse]
  );

  function handleFilterService(serviceId: string) {
    setParams({
      serviceId:
        serviceId && serviceId !== ALL_SERVICE_OPTION_VALUE ? serviceId : null,
      page: '1',
    });
  }

  function handleFilterMonth(monthValue: string) {
    setParams({
      month:
        monthValue && monthValue !== ALL_MONTH_OPTION_VALUE ? monthValue : null,
      page: '1',
    });
  }

  return {
    schedules,
    pagination,
    serviceOptions,
    isLoadingSchedules,
    isRefetchingSchedules,
    currentLimit,
    currentPage,
    currentMonth,
    currentService,
    handleChangePage,
    handleChangeLimit,
    handleFilterMonth,
    handleFilterService,
  };
};

// ============ PAGE COMPONENT ============
export default function AdminSchedules() {
  const queryClient = useQueryClient();

  const {
    schedules,
    pagination,
    serviceOptions,
    isLoadingSchedules,
    isRefetchingSchedules,
    currentLimit,
    currentPage,
    currentMonth,
    currentService,
    handleChangePage,
    handleChangeLimit,
    handleFilterMonth,
    handleFilterService,
  } = useSchedules();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['schedules'] });
  };

  const [selectedService, setSelectedService] = useState(currentService);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<ScheduleItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [participantsSchedule, setParticipantsSchedule] =
    useState<ScheduleItem | null>(null);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);

  useEffect(() => {
    setSelectedService(currentService);
  }, [currentService]);

  useEffect(() => {
    setSelectedMonth(currentMonth);
  }, [currentMonth]);

  const onSelectMonth = (value: string) => {
    setSelectedMonth(value);
    handleFilterMonth(value);
  };

  const onSelectService = (value: string) => {
    setSelectedService(value);
    handleFilterService(value || '');
  };

  const openCreateModal = () => {
    setFormMode('create');
    setSelectedSchedule(null);
    setIsFormOpen(true);
  };

  const openEditModal = (schedule: ScheduleItem) => {
    setFormMode('edit');
    setSelectedSchedule(schedule);
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
  };

  const openDeleteModal = (schedule: ScheduleItem) => {
    setDeleteTarget(schedule);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTimeout(() => {
      setDeleteTarget(null);
    }, 400);
  };

  const openParticipantsModal = (schedule: ScheduleItem) => {
    setParticipantsSchedule(schedule);
    setIsParticipantsOpen(true);
  };

  const closeParticipantsModal = () => {
    setParticipantsSchedule(null);
    setIsParticipantsOpen(false);
  };

  return (
    <DashboardLayout
      title="Manajemen Jadwal"
      description="Atur jadwal tes dan kuota peserta."
    >
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="space-y-6 pt-4"
      >
        <ScheduleTable
          columns={SCHEDULE_TABLE_COLUMNS}
          schedules={schedules}
          serviceOptions={serviceOptions}
          selectedMonth={selectedMonth}
          monthOptions={MONTH_FILTER_OPTIONS}
          selectedService={selectedService}
          isLoading={isLoadingSchedules}
          isRefetching={isRefetchingSchedules}
          currentLimit={Number(currentLimit)}
          currentPage={Number(currentPage)}
          totalPages={pagination?.totalPages || 1}
          onChangePage={handleChangePage}
          onChangeLimit={(value) => handleChangeLimit(String(value))}
          onSelectMonth={onSelectMonth}
          onSelectService={onSelectService}
          onRefresh={handleRefresh}
          onAdd={openCreateModal}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onViewParticipants={openParticipantsModal}
        />

        <AddScheduleModal
          isOpen={isFormOpen}
          mode={formMode}
          schedule={selectedSchedule}
          serviceOptions={serviceOptions}
          onClose={closeFormModal}
        />

        <DeleteScheduleModal
          isOpen={isDeleteModalOpen}
          schedule={deleteTarget}
          onClose={closeDeleteModal}
        />

        <ScheduleParticipantsModal
          isOpen={isParticipantsOpen}
          schedule={participantsSchedule}
          onClose={closeParticipantsModal}
        />
      </motion.section>
    </DashboardLayout>
  );
}
