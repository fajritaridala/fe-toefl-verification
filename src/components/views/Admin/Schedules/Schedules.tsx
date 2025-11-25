import { useEffect, useState } from 'react';
import { ScheduleItem } from '@/utils/interfaces/Schedule';
import ScheduleTable from '@/components/ui/Table/ScheduleTable';
import { SCHEDULE_TABLE_COLUMNS } from './Schedules.constants';
import useSchedules from './useSchedules';
import AddScheduleModal from './AddScheduleModal';
import DeleteScheduleModal from './DeleteScheduleModal';

const AdminSchedulesPage = () => {
  const {
    schedules,
    pagination,
    serviceOptions,
    isLoadingSchedules,
    isRefetchingSchedules,
    currentLimit,
    currentPage,
    currentSearch,
    currentService,
    handleChangePage,
    handleChangeLimit,
    handleSearch,
    handleFilterService,
  } = useSchedules();

  const [searchValue, setSearchValue] = useState(currentSearch);
  const [selectedService, setSelectedService] = useState(currentService);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<ScheduleItem | null>(null);

  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    setSelectedService(currentService);
  }, [currentService]);

  const onSearch = (value: string) => {
    setSearchValue(value);
    handleSearch(value);
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

  return (
    <section className="space-y-6 pt-4">
      <ScheduleTable
        columns={SCHEDULE_TABLE_COLUMNS}
        schedules={schedules}
        serviceOptions={serviceOptions}
        searchValue={searchValue}
        selectedService={selectedService}
        isLoading={isLoadingSchedules}
        isRefetching={isRefetchingSchedules}
        currentLimit={Number(currentLimit)}
        currentPage={Number(currentPage)}
        totalPages={pagination?.totalPages || 1}
        onChangePage={handleChangePage}
        onChangeLimit={(value) => handleChangeLimit(String(value))}
        onSearch={onSearch}
        onSelectService={onSelectService}
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
        isOpen={!!deleteTarget}
        schedule={deleteTarget}
        onClose={closeDeleteModal}
      />
    </section>
  );
};

export default AdminSchedulesPage;
