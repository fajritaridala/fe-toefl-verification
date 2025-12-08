"use client";

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import verificationService from '@features/verification/verification.service';
import { VerificationResponse } from '@features/verification/verification.types';

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
  const [isPeserta, setIsPeserta] = useState<ParticipantInfo>(
    initialParticipant
  );
  const [isScorePeserta, setIsScorePeserta] = useState<ScoreInfo>(initialScore);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState('');

  const params = useParams<{ hash?: string }>();
  const hash = useMemo(() => params.hash ?? null, [params.hash]);

  useEffect(() => {
    const fetchData = async () => {
      if (typeof hash !== 'string') return;
      try {
        setIsLoading(true);
        const response = await verificationService.getVerification(hash);
        const payload = (response.data as VerificationResponse).data;

        const biodataPeserta = {
          nama_lengkap: payload.fullName,
          jenis_kelamin: payload.gender || '-',
          tanggal_lahir: '-',
          nomor_induk_mahasiswa: payload.nim || '-',
          fakultas: payload.faculty || '-',
          program_studi: payload.major || '-',
          sesi_tes: '-',
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
      } catch (error) {
        const err = error as Error;
        setIsError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [hash]);

  return { isPeserta, isScorePeserta, isLoading, isError };
};

export default useVerificationResult;
