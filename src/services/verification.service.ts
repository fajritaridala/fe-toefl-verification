import instance from '@/utils/libs/axios/instance';
import endpoint from './endpoint';

const verificationService = {
  getVerification: (cid: string) =>
    instance.request({
      url: endpoint.VERIFICATIONS,
      method: 'GET',
      data: { cid },
    }),
};

export default verificationService;
