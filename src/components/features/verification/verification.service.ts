import instance from '@lib/axios/instance';
import endpoint from '@lib/endpoint';

const verificationService = {
  getVerification: (cid: string) =>
    instance.request({
      url: endpoint.VERIFICATIONS,
      method: 'GET',
      data: { cid },
    }),
};

export default verificationService;
