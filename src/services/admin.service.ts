import { IBodyInput } from '@/utils/interfaces/Auth';
import instance from '@/utils/libs/axios/instance';

const adminService = {
  input(payload: IBodyInput, address: string) {
    instance.patch(`/participants/${address}/score`, payload);
  },
  uploadCertificate(payload: File, address: string) {
    instance.patch(`/participants/${address}/certificate`, payload);
  },
  getParticipants() {
    instance.get('/participants');
  },
  getOverview() {
    instance.get('/participants/overview');
  },
  getParticipantsPending() {
    instance.get('/participants/status/pending');
  },
  getParticipantsComplete() {
    instance.get('/participants/status/complete');
  },
};

export default adminService;
