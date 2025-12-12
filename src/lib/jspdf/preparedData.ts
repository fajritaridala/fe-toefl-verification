import moment from 'moment';
import {
  CertificatePayload,
  CertificatePdfRender
} from '@/types/certificate.type';

export function preparedData(data: CertificatePayload): CertificatePdfRender {
  const {
    registerAt,
    birthDate,
    listening,
    reading,
    structure,
    totalScore,
  } = data;

  // Pastikan input number/date dihandle dengan benar
  const tanggalTesUnix = typeof registerAt === 'number' ? registerAt : new Date(registerAt).getTime() / 1000;
  const tanggalLahirUnix = birthDate instanceof Date ? birthDate.getTime() / 1000 : new Date(birthDate).getTime() / 1000;

  const tanggal_valid = moment.unix(tanggalTesUnix)
    .add(2, 'years')
    .locale('id')
    .format('D MMMM YYYY');
    
  const _tanggal_tes = moment
    .unix(tanggalTesUnix)
    .locale('id')
    .format('D MMMM YYYY');
    
  const _tanggal_lahir = moment
    .unix(tanggalLahirUnix)
    .locale('id')
    .format('D MMMM YYYY');

  // Hardcode serial number sementara atau ambil dari data jika ada
  const nomor_serial = 'S0034405';

  return {
    jenis_tes: data.serviceName,
    nama_lengkap: data.fullName,
    jenis_kelamin: data.gender,
    tanggal_lahir: _tanggal_lahir,
    nomor_induk_mahasiswa: data.nim,
    fakultas: data.faculty,
    program_studi: data.major,
    tanggal_tes: _tanggal_tes,
    nilai_listening: listening,
    nilai_structure: structure,
    nilai_reading: reading,
    nilai_total: totalScore,
    tanggal_valid: tanggal_valid,
    nomor_serial: nomor_serial,
  };
}
