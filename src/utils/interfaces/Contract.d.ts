interface IRecord {
  address_peserta: string;
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
}

export { IRecord };
