export interface ScheduleRegister {
  fullName: string;
  gender: 'laki-laki' | 'perempuan';
  birth_date: string;
  phone_number: string;
  NIM: string;
  faculty: string;
  major: string;
  payment_date: string;
  payment_receipt: File | null;
}

export interface ScheduleRegistrantSnapshot {
  participant_id: string | null;
  participant_name: string | null;
  status: string;
}

export interface ScheduleItem {
  _id: string;
  service_id?: string;
  service_name?: string;
  service_price?: number;
  service?: {
    _id: string;
    name: string;
  } | null;
  schedule_date: string;
  quota?: number | null;
  is_full?: boolean;
  registrants?: ScheduleRegistrantSnapshot[];
  register_count?: number;
  status?: string;
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
    totalPages: number;
    total: number;
  };
}

export interface SchedulePayload {
  service_id: string;
  schedule_date: string;
  quota?: number;
}
