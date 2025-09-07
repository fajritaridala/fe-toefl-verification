import instance from '@/utils/libs/axios/instance';
import endpoint from '@/services/endpoint';

interface LoginPayload {
  address: string;
}

interface RegisterPayload extends LoginPayload {
  fullName: string;
  email: string;
  roleToken?: string;
}

export default {
  async login(payload: LoginPayload) {
    try {
      const { address } = payload;

      console.log('di dalam api.login() & akan masuk ke instance.post()');
      const res = await instance.post(`${endpoint.AUTH}/login`, { address });
      console.log(
        'sudah keluar dari instance.post(), berikut response dari server',
      );
      console.log(res);

      return {
        ok: true,
        data: res.data,
      };
    } catch (err: any) {
      const status = err?.response?.status;
      const data = err?.response?.data;

      if (status === 404 && data?.needsRegistration) {
        return {
          ok: false,
          needsRegistration: true,
          address: data?.address,
        };
      }

      throw err;
    }
  },

  async register(payload: RegisterPayload) {
    const { address, fullName, email, roleToken } = payload;
    const result = { address, fullName, email, roleToken };
    const res = await instance.post('/auth/register', result);
    return res.data;
  },
};
