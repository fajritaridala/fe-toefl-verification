import { InputPayload, ToeflRegister } from '@/utils/interfaces/Auth';
import instance from '@/utils/libs/axios/instance';

const toeflService = {
  input(payload: InputPayload, address: string) {
    return instance.patch(`/toefls/${address}/input`, payload);
  },
  getParticipants(params: string) {
    return instance.get(`/toefls?${params}`);
  },
  uploadCertificate(payload: File, address: string) {
    return instance.patch(`/toefls/${address}/upload-certificate`, payload);
  },
  register(payload: ToeflRegister, address: string) {
    return instance.post(`/toefls/${address}/register`, payload);
  },
};

export default toeflService;
