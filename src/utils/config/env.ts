export const API_URL: string =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
export const AUTH_SECRET: string = process.env.NEXTAUTH_SECRET || '';
export const RANDOMIZE_SECRET: string = process.env.RANDOMIZE_SECRET || '';
