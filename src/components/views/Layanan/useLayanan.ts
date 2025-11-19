import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import servicesService from '@/services/services.service';

type LayananType = [
  {
    _id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    notes?: string;
  },
];

const useLayanan = () => {
  const router = useRouter();
  const {
    data: dataLayanan,
    isPending: isPendingLayanan,
    isError: isErrorLayanan,
  } = useQuery({
    queryKey: ['layanan'],
    queryFn: async () => {
      const response = await servicesService.getServices();
      return response;
    },
  });

  const layanan = dataLayanan?.data.data as LayananType;

  const handleRedirect = (service_id: string) => {
    router.push(`/layanan/jadwal/${service_id}`);
  };

  return { layanan, isPendingLayanan, isErrorLayanan, handleRedirect };
};

export default useLayanan;
