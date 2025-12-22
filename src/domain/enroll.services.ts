import { EnrollmentStatus } from '@features/admin/enrollments/enrollment.types';
import endpoints from '@/constants/endpoints';
import instance from '@/lib/axios/instance';
import { ScheduleRegister } from '@/types/registration.types';
import buildQueryString from '@/utils/helpers/queryString';

type EnrollmentQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: EnrollmentStatus;
  serviceId?: string;
  scheduleId?: string;
};

export const enrollmentsService = {
  // Admin
  getEnrollments: (query?: EnrollmentQuery) => {
    const queryString = buildQueryString(query);
    const url = queryString
      ? `${endpoints.ENROLLMENTS}?${queryString}`
      : endpoints.ENROLLMENTS;
    return instance.get(url);
  },
  // Admin
  getScheduleEnrollments: (scheduleId: string, query?: EnrollmentQuery) => {
    const queryString = buildQueryString(query);
    const url = queryString
      ? `${endpoints.ENROLLMENTS}/${scheduleId}?${queryString}`
      : `${endpoints.ENROLLMENTS}/${scheduleId}`;
    return instance.get(url);
  },
  // Public
  register: (scheduleId: string, payload: ScheduleRegister) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'paymentProof' && value instanceof File) {
        formData.append('file', value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });

    return instance.post(`${endpoints.ENROLLMENTS}/${scheduleId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  // Admin
  approve: (enrollId: string, status: 'disetujui' | 'ditolak') => {
    return instance.patch(`${endpoints.ENROLLMENTS}/${enrollId}/approval`, {
      status,
    });
  },
  // Admin
  submitScore: (
    enrollId: string,
    participantId: string,
    scores: { listening: number; structure: number; reading: number }
  ) => {
    return instance.patch(
      `${endpoints.ENROLLMENTS}/${enrollId}/${participantId}/submit-score`,
      scores
    );
  },
  // Admin
  blockchainSuccess: (
    enrollId: string,
    participantId: string,
    hash: string
  ) => {
    return instance.patch(
      `${endpoints.ENROLLMENTS}/${enrollId}/${participantId}/blockchain-success`,
      { hash }
    );
  },
};
