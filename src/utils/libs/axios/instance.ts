import axios from 'axios';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { API_URL } from '@/utils/config/env';

type TSessionExt = Session & {
  accessToken?: string;
};

const headers = {
  'Content-Type': 'application/json',
};

const instance = axios.create({
  baseURL: API_URL,
  headers,
  timeout: 60 * 1000, // 60 seconds
});

// Menyiapkan request sebelum dikirim ke server
instance.interceptors.request.use(
  async (request) => {
    const session: TSessionExt | null = await getSession();
    if (session && session.accessToken) {
      request.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return request;
  },
  (error) => Promise.reject(error)
);

// Mempersiapkan response dari server
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const response = error.response;
    const { message } = response.data;
    error.message = message;
    return Promise.reject(error);
  }
);

export default instance;
