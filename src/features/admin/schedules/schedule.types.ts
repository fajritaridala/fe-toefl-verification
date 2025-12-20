export enum ScheduleStatus {
  ACTIVE = 'aktif',
  FULL = 'penuh',
  INACTIVE = 'tidak aktif',
}

export interface ScheduleItem {
  scheduleId: string;
  serviceId: string;
  serviceName: string;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  status: ScheduleStatus;
  capacity: number;
  quota: number;
  registrants: number;
  deletedAt?: string | null;
}

export interface ScheduleListResponse {
  meta: {
    status: number;
    message: string;
  };
  data: ScheduleItem[];
  pagination?: {
    current: number;
    total: number;
    totalPages: number;
  };
}

export interface SchedulePayload {
  serviceId: string;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  capacity?: number;
}
