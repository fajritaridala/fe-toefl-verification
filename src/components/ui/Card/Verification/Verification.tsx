"use client";

import { LuCircleCheckBig } from 'react-icons/lu';
import { Card, CardBody, CardFooter, CardHeader, Divider } from '@heroui/react';

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

type Props = {
  isPeserta: ParticipantInfo;
  isScorePeserta: ScoreInfo;
};

export default function VerificationCard(props: Props) {
  const { isPeserta, isScorePeserta } = props;

  const biodataPeserta = [
    { label: 'Nama', value: isPeserta.nama_lengkap },
    { label: 'Jenis Kelamin', value: isPeserta.jenis_kelamin },
    { label: 'Tanggal Lahir', value: isPeserta.tanggal_lahir },
    { label: 'NIM', value: isPeserta.nomor_induk_mahasiswa },
    { label: 'Program Studi', value: isPeserta.program_studi },
    { label: 'Fakultas', value: isPeserta.fakultas },
    { label: 'Sesi Tes', value: isPeserta.sesi_tes },
    { label: 'Tanggal Tes', value: isPeserta.tanggal_tes },
  ];

  const scorePeserta = [
    { label: 'Listening Comprehension', value: isScorePeserta.nilai_listening },
    { label: 'Reading Comprehension', value: isScorePeserta.nilai_reading },
    { label: 'Structure Comprehension', value: isScorePeserta.nilai_structure },
  ];
  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <div className="my-8 flex w-full flex-col">
            <div className="mx-auto mb-6 rounded-full bg-green-500 p-6">
              <LuCircleCheckBig className="stroke-3 text-[3rem] text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-primary-800 mb-3 text-5xl font-extrabold">
                Sertifikat Terverifikasi
              </h1>
              <p className="text-default-500 text-lg">
                Sertifikat ini telah diverifikasi dan valid secara resmi
              </p>
            </div>
          </div>
        </CardHeader>
        {/*<Divider className="mx-auto mb-6 w-[90%]" />*/}
        <CardBody>
          <div className="w-full">
            {/*<h2 className="mx-auto mb-4 w-[80%] text-xl font-bold">
              Informasi Peserta
            </h2>*/}
            <div className="mx-auto flex w-[80%] flex-wrap justify-around">
              {biodataPeserta.map((item) => (
                <div
                  key={item.label}
                  className="mb-6 flex w-[40%] flex-col text-xl font-medium"
                >
                  <div className="text-medium font-light uppercase">
                    <p>{item.label}</p>
                  </div>
                  <div className="">
                    <p>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardBody>
        <Divider className="mx-auto mb-6 w-[90%]" />
        <CardFooter>
          <div className="mx-auto mb-14 w-[90%]">
            {/*<h2 className="mb-4 text-xl font-bold">Nilai Tes</h2>*/}
            <div className="mb-4 flex justify-between">
              {scorePeserta.map((item) => (
                <div
                  key={item.label}
                  className="border-primary-800 h-[8rem] w-[32%] content-center rounded-lg border-3"
                >
                  <div className="flex flex-col text-center">
                    <h3 className="mb-2 text-lg font-semibold">{item.label}</h3>
                    <p className="text-4xl font-extrabold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex h-[8rem] rounded-lg border text-center">
              <div className="bg-primary-800 w-full content-center text-white">
                <h3 className="mb-2 text-xl font-semibold">Total</h3>
                <p className="text-6xl font-extrabold">
                  {isScorePeserta.nilai_total}
                </p>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
