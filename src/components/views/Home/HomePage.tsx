'use client';

import { useState } from 'react';
import UploaderCard from '@/components/ui/Card/UploaderCard';
import jsQR from 'jsqr';
import * as pdfjsLib from 'pdfjs-dist';
import { getContract } from '@/utils/libs/ethers/contract';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.mjs`;

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );

  const handleFileChange = async (selectedFile: File) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
      setVerificationResult(null);
      setVerificationError(null);
      setIsLoading(true);
      await processPDF(selectedFile);
      setIsLoading(false);
    } else {
      setError('Please upload a valid PDF file.');
      setFile(null);
      setPreview(null);
      setQrCode(null);
    }
  };

  const processPDF = async (pdfFile: File) => {
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const typedarray = new Uint8Array(fileReader.result as ArrayBuffer);
      const pdf = await pdfjsLib.getDocument(typedarray).promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 1 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      if (context) {
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        setPreview(canvas.toDataURL());

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          setQrCode(code.data);
          await verifyOnBlockchain(code.data);
        } else {
          setQrCode(null);
          setError('No QR code found in the PDF.');
        }
      }
    };
    fileReader.readAsArrayBuffer(pdfFile);
  };

  const verifyOnBlockchain = async (hash: string) => {
    setIsVerifying(true);
    setVerificationError(null);
    setVerificationResult(null);
    try {
      const { contract } = await getContract();
      const result = await contract.getRecord(hash);
      if (result && result.address_peserta !== '0x0000000000000000000000000000000000000000') {
        setVerificationResult(result);
      } else {
        setVerificationError('Certificate not found on the blockchain.');
      }
    } catch (err) {
      console.error(err);
      setVerificationError('An error occurred during blockchain verification.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  return (
    <UploaderCard
      onFileChange={(e) => {
        if (e.target.files) {
          handleFileChange(e.target.files[0]);
        }
      }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      isDragging={isDragging}
      isLoading={isLoading}
      preview={preview}
      fileName={file?.name}
      error={error}
      isVerifying={isVerifying}
      verificationResult={verificationResult}
      verificationError={verificationError}
    />
  );
}
