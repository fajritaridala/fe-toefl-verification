import { IRegister } from '@features/auth/auth.types';
import instance from '@lib/axios/instance';
import endpoint from '@lib/endpoint';

const authServices = {
  login(address: string) {
    return instance.post(`${endpoint.AUTH}/login`, { address });
  },
  register(payload: IRegister) {
    return instance.post(`${endpoint.AUTH}/register`, payload);
  },
  getProfileWithToken(token: string) {
    return instance.get(`${endpoint.AUTH}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default authServices;
