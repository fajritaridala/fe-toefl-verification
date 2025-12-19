'use client';

import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { type Variants, motion } from 'framer-motion';
import Head from 'next/head';
import DashboardLayout from '@/components/layouts/Dashboard';
import AddServiceModal from '@/components/ui/Modal/AddServiceModal';
import DeleteServiceModal from '@/components/ui/Modal/DeleteServiceModal';
import ServiceTable from '@/components/ui/Table/ServiceTable';
import usePagination from '@/hooks/usePagination';
import { servicesService } from '@/services/admin.service';
import { ServiceItem, ServiceListResponse } from '@/types/admin.types';

// ============ CONSTANTS ============
type ServiceTableColumn = {
  key: 'name' | 'price' | 'notes' | 'description' | 'actions';
  label: string;
  className?: string;
};

const SERVICE_TABLE_COLUMNS: ServiceTableColumn[] = [
  { key: 'name', label: 'Nama' },
  { key: 'price', label: 'Harga' },
  { key: 'notes', label: 'Catatan', className: 'w-36' },
  { key: 'description', label: 'Deskripsi' },
  { key: 'actions', label: 'Aksi', className: 'w-20 text-right' },
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

// ============ HOOK: useServices ============
const useServices = () => {
  const {
    currentPage,
    currentLimit,
    currentSearch,
    handleChangePage,
    handleChangeLimit,
    handleSearch,
    handleClearSearch,
  } = usePagination();

  const {
    data: servicesResponse,
    isLoading: isLoadingServices,
    isRefetching: isRefetchingServices,
  } = useQuery({
    queryKey: ['services', 'admin', currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const response = await servicesService.getServices({
        page: Number(currentPage),
        limit: Number(currentLimit),
        search: currentSearch,
      });
      return response.data as ServiceListResponse;
    },
    enabled: !!currentPage && !!currentLimit,
  });

  const services = useMemo(() => {
    const items = servicesResponse?.data || [];
    return items.map((item, idx) => ({
      ...item,
      __rowKey: item._id || `service-${idx}`,
    }));
  }, [servicesResponse]);

  const pagination = useMemo(
    () => servicesResponse?.pagination,
    [servicesResponse]
  );

  return {
    services,
    pagination,
    isLoadingServices,
    isRefetchingServices,
    currentLimit,
    currentPage,
    currentSearch,
    handleChangePage,
    handleChangeLimit,
    handleSearch,
    handleClearSearch,
  };
};

// ============ PAGE COMPONENT ============
export default function AdminServices() {
  const queryClient = useQueryClient();

  const {
    services,
    pagination,
    isLoadingServices,
    isRefetchingServices,
    currentPage,
    currentSearch,
    currentLimit,
    handleChangePage,
    handleChangeLimit,
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  return (
    <>
      <Head>
        <title>Kelola Layanan - Simpeka</title>
      </Head>
      <DashboardLayout
        title="Manajemen Layanan"
        description="Kelola jenis layanan tes yang tersedia."
      >
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="space-y-6 pt-4"
        >
          <ServiceTable
            columns={SERVICE_TABLE_COLUMNS}
            services={services}
            isLoading={isLoadingServices}
            isRefetching={isRefetchingServices}
            currentPage={Number(currentPage)}
            totalPages={pagination?.totalPages || 1}
            currentSearch={currentSearch}
            currentLimit={currentLimit}
            onChangeLimit={(val) => handleChangeLimit(String(val))}
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
            isOpen={isDeleteModalOpen}
            service={deleteTarget}
            onClose={closeDeleteModal}
          />
        </motion.section>
      </DashboardLayout>
    </>
  );
}
