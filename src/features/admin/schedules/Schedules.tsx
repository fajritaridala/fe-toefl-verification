"use client";

import { useEffect, useState } from 'react';
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

const AdminSchedulesPage = () => {
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

  const [selectedService, setSelectedService] = useState(currentService);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<ScheduleItem | null>(null);
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
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
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
    <section className="space-y-6 pt-4">
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
        isOpen={!!deleteTarget}
        schedule={deleteTarget}
        onClose={closeDeleteModal}
      />

      <ScheduleParticipantsModal
        isOpen={isParticipantsOpen}
        schedule={participantsSchedule}
        onClose={closeParticipantsModal}
      />
    </section>
  );
};

export default AdminSchedulesPage;
