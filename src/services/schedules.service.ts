import instance from '@/utils/libs/axios/instance';
import endpoint from './endpoint';

type GetQueryPayload = {
  page: number;
  limit: number;
  search?: string;
  service_id?: string;
};

type CreatePayload = {
  service_id: string;
  schedule_date: string;
};

type RegisterPayload = {
  file: File;
  fullName: string;
  gender: string;
  birth_date: string;
  phone_number: string;
  nim: string;
  faculty: string;
  major: string;
  payment_date: string;
};

type InputParams = {
  scheduleId: string;
  participantId: string;
};

type InputPayload = {
  listening: number;
  reading: number;
  writing: number;
};

const schedulesService = {
  getSchedules: (query?: GetQueryPayload) => {
    return instance.get(`${endpoint.SCHEDULES}?${query}`);
  },
  getSchedule: (scheduleId: string) => {
    return instance.get(`${endpoint.SCHEDULES}/${scheduleId}/participants`);
  },
  createSchedule: (payload: CreatePayload) => {
    return instance.post(`${endpoint.SCHEDULES}`, payload);
  },
  scheduleRegistration: (scheduleId: string, payload: RegisterPayload) => {
    return instance.patch(
      `${endpoint.SCHEDULES}/${scheduleId}/register`,
      payload
    );
  },
  inputScore: (params: InputParams, payload: InputPayload) => {
    return instance.patch(
      `${endpoint.SCHEDULES}/${params.scheduleId}/registrants/${params.participantId}`,
      payload
    );
  },
  getRegistrants: () => {
    return instance.get(`${endpoint.REGISTRANTS}`);
  },
  getHistory: () => {
    return instance.get(`${endpoint.PARTICIPANTS}/history`);
  },
};

export default schedulesService;
