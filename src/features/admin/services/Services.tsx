"use client";

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ServiceItem } from '@features/admin';
import ServiceTable from '@/components/ui/Table/ServiceTable';
import { SERVICE_TABLE_COLUMNS } from './Services.constants';
import AddServiceModal from './AddServiceModal';
import DeleteServiceModal from './DeleteServiceModal';
import useServices from './useServices';

const AdminServicesPage = () => {
  const queryClient = useQueryClient();

  const {
    services,
    pagination,
    isLoadingServices,
    isRefetchingServices,
    currentPage,
    currentSearch,
    handleChangePage,
    handleSearch,
    handleClearSearch,
  } = useServices();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['services'] });
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<ServiceItem | null>(null);

  const openCreateModal = () => {
    setFormMode('create');
    setSelectedService(null);
    setIsFormOpen(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setFormMode('edit');
    setSelectedService(service);
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
  };

  const handleDeleteModal = (service: ServiceItem) => {
    setDeleteTarget(service);
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
  };

  return (
    <section className="space-y-6 pt-4">
      <ServiceTable
        columns={SERVICE_TABLE_COLUMNS}
        services={services}
        isLoading={isLoadingServices}
        isRefetching={isRefetchingServices}
        currentPage={Number(currentPage)}
        totalPages={pagination?.totalPages || 1}
        currentSearch={currentSearch}
        onChangePage={handleChangePage}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        onRefresh={handleRefresh}
        onAdd={openCreateModal}
        onEdit={openEditModal}
        onDelete={handleDeleteModal}
      />

      <AddServiceModal
        isOpen={isFormOpen}
        mode={formMode}
        service={selectedService}
        onClose={closeFormModal}
      />

      <DeleteServiceModal
        isOpen={!!deleteTarget}
        service={deleteTarget}
        onClose={closeDeleteModal}
      />
    </section>
  );
};

export default AdminServicesPage;
