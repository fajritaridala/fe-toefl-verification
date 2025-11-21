import { useEffect, useState } from 'react';
import moment from 'moment';
import { useRouter } from 'next/router';
import contractService from '@/services/contract.service';

const useVerificationResult = () => {
  const [isPeserta, setIsPeserta] = useState<Record<string, any>>({});
  const [isScorePeserta, setIsScorePeserta] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState('');

  // get peserta dari blockchain
  const router = useRouter();
  const hash = router.asPath ? router.asPath.split('/').pop() : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (typeof hash == 'string') {
          const peserta = await contractService.getRecord(hash);

          const tanggalLahir = moment.unix(Number(peserta.tanggal_lahir));
          const tanggalTes = moment.unix(Number(peserta.tanggal_tes));

          const biodataPeserta = {
            nama_lengkap: peserta.nama_lengkap,
            jenis_kelamin: peserta.jenis_kelamin,
            tanggal_lahir: tanggalLahir.locale('id').format('DD-MMMM-YYYY'),
            nomor_induk_mahasiswa: peserta.nomor_induk_mahasiswa,
            fakultas: peserta.fakultas,
            program_studi: peserta.program_studi,
            sesi_tes: peserta.sesi_tes,
            tanggal_tes: tanggalTes.locale('id-ID').format('DD-MMMM-YYYY'),
          };
          const scorePeserta = {
            nilai_listening: Number(peserta.nilai_listening),
            nilai_structure: Number(peserta.nilai_structure),
            nilai_reading: Number(peserta.nilai_reading),
            nilai_total: Number(peserta.nilai_total),
          };

          setIsPeserta(biodataPeserta);
          setIsScorePeserta(scorePeserta);
        }
      } catch (error) {
        const err = error as unknown as Error;
        setIsError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [hash]);

  console.log(isPeserta, isScorePeserta);

  return { isPeserta, isScorePeserta, isLoading, isError };
};

export default useVerificationResult;
