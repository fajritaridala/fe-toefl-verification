export const API_URL: string =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
export const AUTH_SECRET: string = process.env.NEXTAUTH_SECRET || '';
export const RANDOMIZE_SECRET: string = process.env.RANDOMIZE_SECRET || '';
export const CONTRACT_ADDRESS: string =
  process.env.CONTRACT_ADDRESS || '0xb7f8bc63bbcad18155201308c8f3540b07f84f5e';
