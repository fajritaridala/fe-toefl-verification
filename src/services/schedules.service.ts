import { ScheduleRegister } from '@/utils/interfaces/Schedule';
import instance from '@/utils/libs/axios/instance';
import endpoint from './endpoint';

type GetQueryPayload = {
  page?: number;
  limit?: number;
  search?: string;
  service_id?: string;
};

type GetQueryParams = string | GetQueryPayload;

type CreatePayload = {
  service_id: string;
  schedule_date: string;
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

const buildQueryString = (query?: GetQueryParams) => {
  if (!query) return '';
  if (typeof query === 'string') return query;

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });

  return params.toString();
};

const schedulesService = {
  getSchedules: (query?: GetQueryParams) => {
    const queryString = buildQueryString(query);
    const url = queryString
      ? `${endpoint.SCHEDULES}?${queryString}`
      : endpoint.SCHEDULES;
    return instance.get(url);
  },
  getSchedule: (scheduleId: string) => {
    return instance.get(`${endpoint.SCHEDULES}/${scheduleId}/participants`);
  },
  createSchedule: (payload: CreatePayload) => {
    return instance.post(`${endpoint.SCHEDULES}`, payload);
  },
  registerParticipant: async (
    scheduleId: string,
    payload: ScheduleRegister
  ) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'payment_receipt' && value instanceof File) {
        formData.append('file', value);
      } else if (value) {
        formData.append(key, value);
      }
    });

    return instance.patch(
      `${endpoint.SCHEDULES}/${scheduleId}/participants`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
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
