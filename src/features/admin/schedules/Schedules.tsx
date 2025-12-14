"use client";

import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { motion, type Variants } from 'framer-motion';
import { ScheduleItem } from '@features/admin';
import ScheduleTable from '@/components/ui/Table/ScheduleTable';
import {
  MONTH_FILTER_OPTIONS,
  SCHEDULE_TABLE_COLUMNS,
} from './Schedules.constants';
import useSchedules from './useSchedules';
import AddScheduleModal from './AddScheduleModal';
import DeleteScheduleModal from './DeleteScheduleModal';
import ScheduleParticipantsModal from './ScheduleParticipantsModal';

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
  );
};

export default AdminSchedulesPage;
