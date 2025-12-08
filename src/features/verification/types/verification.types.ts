export interface VerificationData {
  fullName: string;
  totalScore: number;
  listening: number;
  structure: number;
  reading: number;
  nim?: string;
  faculty?: string;
  major?: string;
  gender?: string;
  scheduleDate?: string;
}

export interface VerificationResponse {
  meta: {
    status: number;
    message: string;
  };
  data: VerificationData;
}
