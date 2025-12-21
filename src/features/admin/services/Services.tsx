'use client';

import { useState } from 'react';
import { ServiceItem } from '@features/admin/services/service.types';
import { Alert } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { type Variants, motion } from 'framer-motion';
import ServiceTable from '@/components/ui/Table/ServiceTable';
import AddServiceModal from './AddServiceModal';
import DeleteServiceModal from './DeleteServiceModal';
import { SERVICE_TABLE_COLUMNS } from './Services.constants';
import useServices from './useServices';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const AdminServicesPage = () => {
  const queryClient = useQueryClient();

  const {
    services,
    pagination,
    isLoadingServices,
    isRefetchingServices,
    currentPage,

    handleChangePage,
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [alert, setAlert] = useState<{
    type: 'success' | 'danger';
    message: string;
    isOpen: boolean;
  } | null>(null);

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
          ? 'Layanan berhasil ditambahkan.'
          : 'Layanan berhasil diperbarui.',
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

      <ServiceTable
        columns={SERVICE_TABLE_COLUMNS}
        services={services}
        isLoading={isLoadingServices}
        isRefetching={isRefetchingServices}
        currentPage={Number(currentPage)}
        totalPages={pagination?.totalPages || 1}
        onChangePage={handleChangePage}
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
        onSuccess={handleSuccess}
      />

      <DeleteServiceModal
        isOpen={isDeleteModalOpen}
        service={deleteTarget}
        onClose={closeDeleteModal}
      />
    </motion.section>
  );
};

export default AdminServicesPage;
