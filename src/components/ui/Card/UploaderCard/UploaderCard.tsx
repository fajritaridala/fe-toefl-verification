'use client';

import { Card, CardBody, CardHeader } from '@heroui/react';
import { LuUploadCloud } from 'react-icons/lu';
import { FaFilePdf, FaCheckCircle } from 'react-icons/fa';
import { MdError } from 'react-icons/md';

type UploaderCardProps = {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragging: boolean;
  isLoading: boolean;
  preview: string | null;
  fileName: string | undefined;
  error: string | null;
  isVerifying: boolean;
  verificationResult: any | null;
  verificationError: string | null;
};

export default function UploaderCard({
  onFileChange,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  isDragging,
  isLoading,
  preview,
  fileName,
  error,
  isVerifying,
  verificationResult,
  verificationError,
}: UploaderCardProps) {
  const renderVerificationResult = () => {
    if (isVerifying) {
      return <p className="text-sm text-gray-500">Verifying on blockchain...</p>;
    }
    if (verificationError) {
      return (
        <div className="mt-4 flex items-center text-red-500">
          <MdError className="mr-2" />
          <p>{verificationError}</p>
        </div>
      );
    }
    if (verificationResult) {
      return (
        <div className="mt-4 text-green-500">
          <div className="flex items-center">
            <FaCheckCircle className="mr-2" />
            <p className="font-semibold">Certificate Verified!</p>
          </div>
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
            <p>Nama: {verificationResult.nama_lengkap}</p>
            <p>NIM: {verificationResult.nomor_induk_mahasiswa}</p>
            <p>Fakultas: {verificationResult.fakultas}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      className={`max-w-3xl ${isDragging ? 'border-blue-500' : ''}`}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <CardHeader>Unggah Sertifikat</CardHeader>
      <CardBody>
        {isLoading ? (
          <div className="flex h-64 w-full flex-col items-center justify-center">
            <p>Processing PDF...</p>
          </div>
        ) : preview ? (
          <div className="flex flex-col items-center justify-center">
            <img
              src={preview}
              alt="PDF Preview"
              className="h-48 w-auto rounded-lg border"
            />
            <p className="mt-2 text-sm text-gray-500">{fileName}</p>
            {renderVerificationResult()}
          </div>
        ) : (
          <div className="flex w-full items-center justify-center">
            <label
              htmlFor="dropzone-file"
              className={`dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600 ${
                isDragging ? 'bg-blue-100 border-blue-500' : ''
              }`}
            >
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <LuUploadCloud className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF only
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={onFileChange}
                accept="application/pdf"
              />
            </label>
          </div>
        )}
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </CardBody>
    </Card>
  );
}
