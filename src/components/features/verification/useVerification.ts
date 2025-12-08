"use client";

import { ChangeEvent, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import readCertificatePdf from '@lib/pdfjs-dist/readCertificatePdf';

const useVerification = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [isPreview, setIsPreview] = useState<string>('');
  const [isQrMsg, setIsQrMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!fileInputRef) throw new Error('Gagal menginisialisasi input file');

  // Process file function to handle both click and drag & drop
  async function processFile(file: File) {
    setIsLoading(true);
    try {
      const { qrMessage, previewUrl } = await readCertificatePdf(file);
      setIsQrMsg(qrMessage);
      setIsPreview(previewUrl);
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // onClick bisa memunculkan pemilihan file
  function handleClick() {
    fileInputRef.current?.click();
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    console.log(e);
    const files = e.target.files;
    if (!files) throw new Error('file tidak dapat dimuat');
    const file = files[0];
    await processFile(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  // Handle file drop
  function handleFileDrop(file: File) {
    processFile(file);
  }

  // Use drag and drop hook
  const { isDragging, dragHandlers } = useDragAndDrop({
    onFileDrop: handleFileDrop,
    acceptedTypes: ['application/pdf'],
  });

  async function handleSubmit() {
    router.push(isQrMsg);
  }

  return {
    isPreview,
    handleSubmit,
    handleClick,
    handleFile,
    isLoading,
    isDragging,
    dragHandlers,
    fileInputRef,
  };
};

export default useVerification;
