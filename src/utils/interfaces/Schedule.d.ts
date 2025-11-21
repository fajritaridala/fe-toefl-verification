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
