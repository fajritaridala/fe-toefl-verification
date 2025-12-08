// admin
interface InputPayload {
  nilai_listening: number;
  nilai_structure: number;
  nilai_reading: number;
}

// peserta
interface ToeflRegister {
  nama_lengkap: string;
  jenis_kelamin: string;
  tanggal_lahir: string;
  nomor_induk_mahasiswa: string;
  fakultas: string;
  program_studi: string;
  sesi_tes: string;
  schedule_id: string;
}

export type { InputPayload, ToeflRegister };
