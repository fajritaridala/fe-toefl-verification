import instance from '@/utils/libs/axios/instance';
import endpoint from './endpoint';

type CreateServicePayload = {
  name: string;
  description: string;
  price: number;
  duration: number;
  notes?: string;
};

type UpdateServicePayload = {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  notes?: string;
};

const servicesService = {
  getServices: () => {
    return instance.get(`${endpoint.SERVICES}`);
  },
  createService: (payload: CreateServicePayload) => {
    return instance.post(`${endpoint.SERVICES}`, payload);
  },
  updateService: (id: string, payload: UpdateServicePayload) => {
    return instance.put(`${endpoint.SERVICES}/${id}`, payload);
  },
  removeService: (id: string) => {
    return instance.delete(`${endpoint.SERVICES}/${id}`);
  },
};

export default servicesService;
