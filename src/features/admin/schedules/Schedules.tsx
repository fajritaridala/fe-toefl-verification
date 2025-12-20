'use client';

import { useEffect, useState } from 'react';
import { ScheduleItem } from '@features/admin';
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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<ScheduleItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  return (
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
    </motion.section>
  );
};

export default AdminSchedulesPage;
