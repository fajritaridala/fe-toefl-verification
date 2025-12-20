'use client';

import { ServiceItem } from '@features/admin/services/service.types';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { servicesService } from '@/domain/service.services';

const useService = () => {
  const router = useRouter();
  const {
    data: serviceData,
    isPending: isPendingServices,
    isError: isErrorServices,
  } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await servicesService.getServices();
      return response;
    },
  });
  const services = (serviceData?.data.data as ServiceItem[]) || [];

  const handleRedirect = (service_id: string) => {
    router.push(`/service/${service_id}/schedule`);
  };

  return { services, isPendingServices, isErrorServices, handleRedirect };
};

export default useService;
