export interface ServiceItem {
  _id: string;
  name: string;
  description: string;
  price?: number;
}

export interface ServiceListResponse {
  data: ServiceItem[];
  pagination?: {
    current: number;
    total: number;
    totalPages: number;
  };
}

export interface ServicePayload {
  name: string;
  description: string;
  price: number;
}

export interface ScheduleRegister {
  paymentDate: string;
  fullName: string;
  birthDate: string;
  gender: "laki-laki" | "perempuan";
  email: string;
  phoneNumber: number;
  nim: string;
  faculty: string;
  major: string;
  file: File | null;
}

export interface ScheduleItem {
  scheduleId: string;
  serviceId: string;
  serviceName: string;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  status: "aktif" | "penuh" | "tidak aktif";
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

export interface EnrollmentItem {
  enrollId: string;
  scheduleId: string;
  participantId: string;
  fullName: string;
  nim: string;
  status: "menunggu" | "disetujui" | "ditolak" | "selesai";
  paymentProof?: string;
  email?: string;
  phoneNumber?: string;
  faculty?: string;
  major?: string;
  registerAt?: string;
  // Optional fields that might be populated by backend
  serviceName?: string;
  scheduleName?: string;
  scheduleDate?: string;
  paymentDate?: string;
  gender?: "laki-laki" | "perempuan";
  // Score fields (when status is "selesai")
  listening?: number;
  structure?: number;
  reading?: number;
  totalScore?: number;
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
