export interface ICertificatePayload {
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
}

export interface ICertificateRender
  extends Omit<ICertificatePayload, "tanggal_lahir" | "tanggal_tes"> {
  tanggal_lahir: string;
  tanggal_tes: string;
  nomor_serial: string;
  tanggal_valid: string;
}
