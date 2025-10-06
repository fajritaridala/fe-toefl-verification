// admin
interface InputPayload {
  nilai_listening: number;
  nilai_structure: number;
  nilai_reading: number;
}

// peserta
interface ToeflRegister {
  nama_lengkap: string;
  email: string;
  nomor_induk_mahasiswa: string;
  jurusan: string;
  sesi_tes: string;
}

export type { InputPayload, ToeflRegister };
