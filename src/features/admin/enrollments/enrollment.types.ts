import { Gender } from '@/types/registration.types';

export enum EnrollmentStatus {
  PENDING = 'menunggu',
  APPROVED = 'disetujui',
  REJECTED = 'ditolak',
  COMPLETED = 'selesai',
}

export interface EnrollmentItem {
  enrollId: string;
  scheduleId: string;
  participantId: string;
  fullName: string;
  nim: string;
  status: EnrollmentStatus;
  paymentProof?: string;
  email?: string;
  phoneNumber?: string;
  faculty?: string;
  major?: string;
  registerAt?: string;
  // Optional fields that might be populated by backend
  serviceName: string;
  scheduleDate?: string;
  paymentDate?: string;
  gender?: Gender;
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
