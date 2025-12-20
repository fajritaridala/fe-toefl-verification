'use client';

import { useEffect, useState } from 'react';
import { ScheduleItem } from '@features/admin';
import { useQueryClient } from '@tanstack/react-query';
import { type Variants, motion } from 'framer-motion';
import ScheduleTable from '@/components/ui/Table/ScheduleTable';
import AddScheduleModal from './AddScheduleModal';
import DeleteScheduleModal from './DeleteScheduleModal';
import EditScheduleModal from './EditScheduleModal';
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
    setIsAddModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsAddModalOpen(false);
  };

  const openEditModal = (schedule: ScheduleItem) => {
    setSelectedSchedule(schedule);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setTimeout(() => {
      setSelectedSchedule(null);
    }, 400);
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
        isOpen={isAddModalOpen}
        serviceOptions={serviceOptions}
        onClose={closeCreateModal}
      />

      <EditScheduleModal
        isOpen={isEditModalOpen}
        schedule={selectedSchedule}
        serviceOptions={serviceOptions}
        onClose={closeEditModal}
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
