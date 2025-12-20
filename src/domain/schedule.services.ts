import {
  SchedulePayload,
  ScheduleStatus,
} from '@features/admin/types/admin.types';
import endpoints from '@/constants/endpoints';
import instance from '@/lib/axios/instance';
import buildQueryString from '@/utils/helpers/queryString';

type GetScheduleQuery = {
  page?: number;
  limit?: number;
  search?: string;
  serviceId?: string;
  status?: ScheduleStatus;
  month?: string;
  includeDeleted?: boolean;
};

type GetScheduleParams = string | GetScheduleQuery;

export const schedulesService = {
  // Public
  getSchedules: (query?: GetScheduleParams) => {
    const queryString = buildQueryString(query);
    const url = queryString
      ? `${endpoints.SCHEDULES}?${queryString}`
      : endpoints.SCHEDULES;
    return instance.get(url);
  },
  // Admin
  getAdminSchedules: (query?: GetScheduleParams) => {
    const queryString = buildQueryString(query);
    const url = queryString
      ? `${endpoints.SCHEDULES}/admin?${queryString}`
      : `${endpoints.SCHEDULES}/admin`;
    return instance.get(url);
  },
  // Admin
  createSchedule: (payload: SchedulePayload) => {
    const { serviceId, ...rest } = payload;
    if (!serviceId) {
      throw new Error('serviceId is required to create schedule');
    }
    const queryString = buildQueryString({ serviceId });
    return instance.post(`${endpoints.SCHEDULES}?${queryString}`, rest);
  },
  // Admin
  updateSchedule: (scheduleId: string, payload: Partial<SchedulePayload>) => {
    return instance.patch(
      `${endpoints.SCHEDULES}/${scheduleId}/update`,
      payload
    );
  },
  // Admin
  removeSchedule: (scheduleId: string) => {
    return instance.patch(`${endpoints.SCHEDULES}/${scheduleId}/delete`);
  },
};
