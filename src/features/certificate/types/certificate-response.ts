export interface ICertificateData {
  // Field disesuaikan dengan isi JSON di Pinata/IPFS
  // Sesuai dengan ICertificatePayload yang sudah ada di src/types/certificate.ts
  nama_lengkap: string;
  jenis_kelamin: string;
  tanggal_lahir: number;
  nomor_induk_mahasiswa: string;
  fakultas: string;
  program_studi: string;
  sesi_tes: string;
  tanggal_tes: number;
  nilai_listening: number;
  nilai_structure: number;
  nilai_reading: number;
  nilai_total: number;
  // Metadata tambahan dari IPFS jika ada
}
