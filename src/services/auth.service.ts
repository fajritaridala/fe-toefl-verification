import { ILogin, IRegister } from '@/utils/interfaces/Auth';
import instance from '@/utils/libs/axios/instance';
import endpoint from './endpoint';

const authServices = {
  login(payload: ILogin) {
    return instance.post(`auth/login`, payload);
  },
  register(payload: IRegister) {
    return instance.post(`auth/register`, payload);
  },
  getProfileWithToken(token: string) {
    return instance.get(`${endpoint.AUTH}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default authServices;
