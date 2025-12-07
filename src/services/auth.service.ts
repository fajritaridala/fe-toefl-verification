import { IRegister } from '@/utils/interfaces/Auth';
import instance from '@/utils/libs/axios/instance';
import endpoint from './endpoint';

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
