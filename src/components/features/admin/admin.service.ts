import instance from '@lib/axios/instance';
import endpoint from '@lib/endpoint';
import buildQueryString from '@/utils/helpers/queryString';
import type { SchedulePayload, ScheduleRegister } from './admin.types';

// ============ Services ============
type GetServicesQuery = {
  page?: number;
  limit?: number;
  search?: string;
};

type GetServicesParams = string | GetServicesQuery;

type CreateServicePayload = {
  name: string;
  description: string;
  price: number;
  notes?: string;
};

type UpdateServicePayload = {
  name?: string;
  description?: string;
  price?: number;
  notes?: string;
};

export const servicesService = {
  getServices: (query?: GetServicesParams) => {
    const queryString = buildQueryString(query);
    const url = queryString
      ? `${endpoint.SERVICES}?${queryString}`
      : endpoint.SERVICES;
    return instance.get(url);
  },
  getService: (id: string) => {
    return instance.get(`${endpoint.SERVICES}/${id}`);
  },
  createService: (payload: CreateServicePayload) => {
    return instance.post(`${endpoint.SERVICES}`, payload);
  },
  updateService: (id: string, payload: UpdateServicePayload) => {
    return instance.patch(`${endpoint.SERVICES}/${id}`, payload);
  },
  removeService: (id: string) => {
    return instance.delete(`${endpoint.SERVICES}/${id}`);
  },
};

// ============ Schedules ============
type GetScheduleQuery = {
  page?: number;
  limit?: number;
  search?: string;
  serviceId?: string;
  status?: 'aktif' | 'tidak aktif';
  month?: number;
};

type GetScheduleParams = string | GetScheduleQuery;

export const schedulesService = {
  getSchedules: (query?: GetScheduleParams) => {
    const queryString = buildQueryString(query);
    const url = queryString
      ? `${endpoint.SCHEDULES}?${queryString}`
      : endpoint.SCHEDULES;
    return instance.get(url);
  },
  createSchedule: (payload: SchedulePayload) => {
    const { serviceId, ...rest } = payload;
    if (!serviceId) {
      throw new Error('serviceId is required to create schedule');
    }
    const queryString = buildQueryString({ serviceId });
    return instance.post(`${endpoint.SCHEDULES}?${queryString}`, rest);
  },
  updateSchedule: (scheduleId: string, payload: Partial<SchedulePayload>) => {
    return instance.patch(`${endpoint.SCHEDULES}/${scheduleId}`, payload);
  },
  removeSchedule: (scheduleId: string) => {
    return instance.delete(`${endpoint.SCHEDULES}/${scheduleId}`);
  },
};

// ============ Enrollments ============
type EnrollmentQuery = {
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

export const enrollmentsService = {
  getEnrollments: (query?: EnrollmentQuery) => {
    const queryString = buildQueryString(query);
    const url = queryString
      ? `${endpoint.ENROLLMENTS}?${queryString}`
      : endpoint.ENROLLMENTS;
    return instance.get(url);
  },
  getScheduleEnrollments: (scheduleId: string, query?: EnrollmentQuery) => {
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
    return instance.patch(`${endpoint.ENROLLMENTS}/${enrollId}/approval`, {
      status,
    });
  },
  submitScore: (participantId: string, payload: ScorePayload) => {
    return instance.patch(
      `${endpoint.ENROLLMENTS}/${participantId}/submit-score`,
      payload
    );
  },
};
