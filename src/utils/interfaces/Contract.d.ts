interface IRecord {
  address_peserta: string;
  nama_lengkap: string;
  email: string;
  nomor_induk_mahasiswa: string;
  jurusan: string;
  sesi_tes: string;
  tanggal_tes: number;
  nilai_listening: number;
  nilai_structure: number;
  nilai_reading: number;
}

export { IRecord };
