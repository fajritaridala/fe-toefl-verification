import { ScheduleRegister } from '@/utils/interfaces/Schedule';
import instance from '@/utils/libs/axios/instance';
import endpoint from './endpoint';
import buildQueryString from '@/utils/helpers/queryString';

type PaginationQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'menunggu' | 'disetujui' | 'ditolak';
};

type ScorePayload = {
  listening: number;
  reading: number;
  structure: number;
};

const enrollmentsService = {
  getEnrollments: (query?: PaginationQuery) => {
    const queryString = buildQueryString(query);
    const url = queryString
      ? `${endpoint.ENROLLMENTS}?${queryString}`
      : endpoint.ENROLLMENTS;
    return instance.get(url);
  },
  getScheduleEnrollments: (scheduleId: string, query?: PaginationQuery) => {
    const queryString = buildQueryString(query);
    const url = queryString
      ? `${endpoint.ENROLLMENTS}/${scheduleId}?${queryString}`
      : `${endpoint.ENROLLMENTS}/${scheduleId}`;
    return instance.get(url);
  },
  register: (scheduleId: string, payload: ScheduleRegister) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'file' && value instanceof File) {
        formData.append('file', value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });

    return instance.post(`${endpoint.ENROLLMENTS}/${scheduleId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  approve: (enrollId: string, status: 'disetujui' | 'ditolak') => {
    return instance.patch(
      `${endpoint.ENROLLMENTS}/${enrollId}/approval`,
      { status }
    );
  },
  submitScore: (participantId: string, payload: ScorePayload) => {
    return instance.patch(
      `${endpoint.ENROLLMENTS}/${participantId}/submit-score`,
      payload
    );
  },
};

export default enrollmentsService;
