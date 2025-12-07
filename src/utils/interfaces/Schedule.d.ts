export interface ScheduleRegister {
  paymentDate: string;
  fullName: string;
  gender: 'laki-laki' | 'perempuan';
  email: string;
  phoneNumber: string;
  nim: string;
  faculty: string;
  major: string;
  file: File | null;
}

export interface ScheduleItem {
  _id: string;
  serviceId: string;
  serviceName: string;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  status: 'aktif' | 'tidak aktif';
  quota?: number;
  registrants?: number;
  createdAt?: string;
  updatedAt?: string;
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

export interface EnrollmentItem {
  _id: string;
  scheduleId: string;
  participantId?: string;
  fullName: string;
  nim: string;
  status: 'menunggu' | 'disetujui' | 'ditolak';
  paymentProof?: string;
  email?: string;
  phoneNumber?: string;
  faculty?: string;
  major?: string;
  registerAt?: string;
}

export interface EnrollmentListResponse {
  meta: {
    status: number;
    message: string;
  };
  data: EnrollmentItem[];
  pagination?: {
    current: number;
    total: number;
    totalPages: number;
  };
}
