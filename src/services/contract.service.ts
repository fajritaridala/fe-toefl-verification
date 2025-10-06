import * as yup from 'yup';
import { IRecord } from '@/utils/interfaces/Contract';
import {
  getContract,
  getContractWithSigner,
} from '@/utils/libs/ethers/contract';

const StoredRecord = yup.object().shape({
  address_peserta: yup.string().required(),
  nama_lengkap: yup.string().required(),
  email: yup.string().email().required(),
  jurusan: yup.string().required(),
  sesi_tes: yup.string().required(),
  tanggal_tes: yup.number().required(),
  nilai_listening: yup.number().min(0).max(100).required(),
  nilai_structure: yup.number().min(0).max(100).required(),
  nilai_reading: yup.number().min(0).max(100).required(),
  tanggal_terbit: yup.number().required(),
  address_admin: yup.string().required(),
});

const getRecordSchema = yup.object().shape({
  toefl_hash: yup.string().required(),
});

// const hari = new Date().getDate();
// const bulan = new Date().getMonth() + 1;
// const tahun = new Date().getFullYear();
// const tanggal = `${hari}/${bulan}/${tahun}`;

const contractService = {
  async storedRecord(toefl_hash: string, peserta: IRecord) {
    try {
      const { contract, signer } = await getContractWithSigner();
      if (!contract) throw new Error('Contract not available');

      const record = {
        address_peserta: peserta.address_peserta,
        nama_lengkap: peserta.nama_lengkap,
        email: peserta.email,
        nomor_induk_mahasiswa: peserta.nomor_induk_mahasiswa,
        jurusan: peserta.jurusan,
        sesi_tes: peserta.sesi_tes,
        tanggal_tes: peserta.tanggal_tes,
        nilai_listening: peserta.nilai_listening,
        nilai_structure: peserta.nilai_structure,
        nilai_reading: peserta.nilai_reading,
        tanggal_terbit: Math.floor(Date.now() / 1000),
        address_admin: signer.address,
      };

      await StoredRecord.validate(record);

      console.log('hit');
      console.log(record);

      const tx = await contract.storedRecord(toefl_hash, record);
      await tx.wait();

      return 'success store record';
    } catch (error) {
      console.error('Error storing record:', error);
      throw error;
    }
  },
  async getRecord(toefl_hash: string) {
    try {
      console.log(toefl_hash);
      const { contract } = await getContract();
      if (!contract) throw new Error('Contract not available');

      await getRecordSchema.validate({ toefl_hash });

      const record = await contract.getRecord(toefl_hash);
      return record;
    } catch (error) {
      console.error('Error getting record:', error);
      throw error;
    }
  },
};

export default contractService;
