export enum Gender {
  MALE = 'laki-laki',
  FEMALE = 'perempuan',
}

export interface ScheduleRegister {
  paymentDate: string;
  fullName: string;
  birthDate: string;
  gender: Gender;
  email: string;
  phoneNumber: number;
  nim: string;
  faculty: string;
  major: string;
  paymentProof: File | null;
}
