import { useEffect, useMemo, useState } from 'react';
import certificateApi from '@features/certificate/services/certificate.api';
import { useRouter } from 'next/router';
import blockchainService from '@/domain/blockchain.services';

type ParticipantInfo = {
  nama_lengkap?: string;
  jenis_kelamin?: string;
  tanggal_lahir?: string;
  nomor_induk_mahasiswa?: string;
  fakultas?: string;
  program_studi?: string;
  sesi_tes?: string;
  tanggal_tes?: string;
};

type ScoreInfo = {
  nilai_listening?: number;
  nilai_structure?: number;
  nilai_reading?: number;
  nilai_total?: number;
};

const initialParticipant: ParticipantInfo = {
  nama_lengkap: '-',
  jenis_kelamin: '-',
  tanggal_lahir: '-',
  nomor_induk_mahasiswa: '-',
  fakultas: '-',
  program_studi: '-',
  sesi_tes: '-',
  tanggal_tes: '-',
};

const initialScore: ScoreInfo = {
  nilai_listening: 0,
  nilai_structure: 0,
  nilai_reading: 0,
  nilai_total: 0,
};

const useVerificationResult = () => {
  const router = useRouter();
  const [isPeserta, setIsPeserta] =
    useState<ParticipantInfo>(initialParticipant);
  const [isScorePeserta, setIsScorePeserta] = useState<ScoreInfo>(initialScore);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const { hash: queryHash } = router.query;
  const hash = queryHash as string | undefined;

  useEffect(() => {
    const fetchData = async () => {
      if (!hash) return; // Wait for hash query param

      try {
        setIsLoading(true);
        setIsError('');
        setIsVerified(false);

        // 1. Get CID from Blockchain
        const cid = await blockchainService.get(hash);

        // 2. Get Data from IPFS
        const ipfsResponse = await certificateApi.getDataFromIpfs(cid);
        const payload = ipfsResponse.content;
        console.log(payload);

        // 3. Map Data
        const biodataPeserta = {
          nama_lengkap: payload.fullName,
          jenis_kelamin: payload.gender || '-',
          tanggal_lahir: payload.birthDate || '-', // Add if available in payload, otherwise '-'
          nomor_induk_mahasiswa: payload.nim || '-',
          fakultas: payload.faculty || '-',
          program_studi: payload.major || '-',
          layanan: payload.serviceName || '-', // Not in current certificate payload, keep default or update if schema changes
          tanggal_tes: payload.scheduleDate || '-',
        };

        const scorePeserta = {
          nilai_listening: payload.listening,
          nilai_structure: payload.structure,
          nilai_reading: payload.reading,
          nilai_total: payload.totalScore,
        };

        setIsPeserta(biodataPeserta);
        setIsScorePeserta(scorePeserta);
        setIsVerified(true);
      } catch (error) {
        const err = error as Error;
        setIsError(err.message || 'Gagal memverifikasi sertifikat.');
        setIsVerified(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (router.isReady) {
      fetchData();
    }
  }, [hash, router.isReady]);

  return { isPeserta, isScorePeserta, isLoading, isError, isVerified };
};

export default useVerificationResult;
