import moment from 'moment';
import {
  ICertificatePayload,
  ICertificateRender,
} from '@/utils/interfaces/Certificate';

export function preparedData(data: ICertificatePayload) {
  const { tanggal_tes, tanggal_lahir } = data;
  const tanggal_valid = moment(tanggal_tes * 1000)
    .add(2, 'years')
    .locale('id')
    .format('D MMMM YYYY');
  const _tanggal_tes = moment
    .unix(tanggal_tes)
    .locale('id')
    .format('D MMMM YYYY');
  const _tanggal_lahir = moment
    .unix(tanggal_lahir)
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
    nilai_listening: data.nilai_listening,
    nilai_structure: data.nilai_structure,
    nilai_reading: data.nilai_reading,
    nilai_total: data.nilai_total,
    tanggal_valid: tanggal_valid,
    nomor_serial: nomor_serial,
  } as ICertificateRender;
}
