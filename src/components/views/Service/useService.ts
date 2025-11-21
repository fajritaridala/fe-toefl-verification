import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import servicesService from '@/services/services.service';

type ServiceType = [
  {
    _id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    notes?: string;
  },
];

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

  const services = serviceData?.data.data as ServiceType;
  console.log(serviceData?.data.data)

  const handleRedirect = (service_id: string) => {
    router.push(`/service/${service_id}/schedule`);
  };

  return { services, isPendingServices, isErrorServices, handleRedirect };
};

export default useService;
