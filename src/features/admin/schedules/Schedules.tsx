'use client';

import { useEffect, useState } from 'react';
import { ScheduleItem } from '@features/admin/schedules/schedule.types';
import { Alert } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { type Variants, motion } from 'framer-motion';
import ScheduleTable from '@/components/ui/Table/ScheduleTable';
import AddScheduleModal from './AddScheduleModal';
import DeleteScheduleModal from './DeleteScheduleModal';
import {
  MONTH_FILTER_OPTIONS,
  SCHEDULE_TABLE_COLUMNS,
} from './Schedules.constants';
import useSchedules from './useSchedules';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const AdminSchedulesPage = () => {
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<ScheduleItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [alert, setAlert] = useState<{
    type: 'success' | 'danger';
    message: string;
    isOpen: boolean;
  } | null>(null);

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
    setIsAddModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsAddModalOpen(false);
  };

  const openEditModal = (schedule: ScheduleItem) => {
    setFormMode('edit');
    setSelectedSchedule(schedule);
    setIsAddModalOpen(true);
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

  const handleSuccess = () => {
    setAlert({
      type: 'success',
      message:
        formMode === 'create'
          ? 'Jadwal berhasil ditambahkan.'
          : 'Jadwal berhasil diperbarui.',
      isOpen: true,
    });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleError = (error: Error) => {
    setAlert({
      type: 'danger',
      message: error.message || 'Terjadi kesalahan saat menyimpan jadwal.',
      isOpen: true,
    });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="space-y-6 pt-4"
    >
      {alert?.isOpen && (
        <div className="fixed top-24 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-4">
          <Alert
            color={alert.type}
            title={alert.type === 'success' ? 'Berhasil' : 'Gagal'}
            description={alert.message}
            isClosable
            onClose={() => setAlert(null)}
            variant="faded"
            className={`shadow-box rounded-xl border bg-white/90 backdrop-blur-sm ${
              alert.type === 'success'
                ? 'border-success-200'
                : 'border-danger-200'
            }`}
          />
        </div>
      )}

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
      />

      <AddScheduleModal
        isOpen={isAddModalOpen}
        mode={formMode}
        schedule={selectedSchedule}
        serviceOptions={serviceOptions}
        onClose={closeCreateModal}
        onSuccess={handleSuccess}
        onError={handleError}
      />

      <DeleteScheduleModal
        isOpen={isDeleteModalOpen}
        schedule={deleteTarget}
        onClose={closeDeleteModal}
      />
    </motion.section>
  );
};

export default AdminSchedulesPage;
