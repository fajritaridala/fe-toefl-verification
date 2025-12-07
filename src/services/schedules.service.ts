import { SchedulePayload } from '@/utils/interfaces/Schedule';
import instance from '@/utils/libs/axios/instance';
import endpoint from './endpoint';
import buildQueryString from '@/utils/helpers/queryString';

type GetQueryPayload = {
  page?: number;
  limit?: number;
  search?: string;
  serviceId?: string;
  status?: 'aktif' | 'tidak aktif';
  month?: number;
};

type GetQueryParams = string | GetQueryPayload;

const schedulesService = {
  getSchedules: (query?: GetQueryParams) => {
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
  updateSchedule: (
    scheduleId: string,
    payload: Partial<SchedulePayload>
  ) => {
    return instance.patch(`${endpoint.SCHEDULES}/${scheduleId}`, payload);
  },
  removeSchedule: (scheduleId: string) => {
    return instance.delete(`${endpoint.SCHEDULES}/${scheduleId}`);
  },
};

export default schedulesService;
