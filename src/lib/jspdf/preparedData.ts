import moment from 'moment';
import {
  ICertificatePayload,
  ICertificateRender,
} from '@features/verification/certificate.types';

export function preparedData(data: ICertificatePayload) {
  const {
    tanggal_tes,
    tanggal_lahir,
    nilai_listening,
    nilai_reading,
    nilai_structure,
    nilai_total,
  } = data;

  const tanggalTes = Number(tanggal_tes);
  const tanggalLahir = Number(tanggal_lahir);
  const nilaiListening = Number(nilai_listening);
  const nilaiReading = Number(nilai_reading);
  const nilaiStructure = Number(nilai_structure);
  const nilaiTotal = Number(nilai_total);

  const tanggal_valid = moment(tanggalTes * 1000)
    .add(2, 'years')
    .locale('id')
    .format('D MMMM YYYY');
  const _tanggal_tes = moment
    .unix(tanggalTes)
    .locale('id')
    .format('D MMMM YYYY');
  const _tanggal_lahir = moment
    .unix(tanggalLahir)
    .locale('id')
    .format('D MMMM YYYY');

  const nomor_serial = 'S0034405';

  return {
    nama_lengkap: data.nama_lengkap,
    jenis_kelamin: data.jenis_kelamin,
    tanggal_lahir: _tanggal_lahir,
    nomor_induk_mahasiswa: data.nomor_induk_mahasiswa,
    fakultas: data.fakultas,
    program_studi: data.program_studi,
    sesi_tes: data.sesi_tes,
    tanggal_tes: _tanggal_tes,
    nilai_listening: nilaiListening,
    nilai_structure: nilaiStructure,
    nilai_reading: nilaiReading,
    nilai_total: nilaiTotal,
    tanggal_valid: tanggal_valid,
    nomor_serial: nomor_serial,
  } as ICertificateRender;
}
