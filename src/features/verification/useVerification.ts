import { ChangeEvent, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import readCertificatePdf from '@/lib/pdfjs-dist/readCertificatePdf';

const useVerification = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [isPreview, setIsPreview] = useState<string>('');
  const [isQrMsg, setIsQrMsg] = useState<string>('');
  const [verificationError, setVerificationError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!fileInputRef) {
    throw new Error('Gagal menginisialisasi input file');
  }

  async function processFile(file: File) {
    setIsLoading(true);
    try {
      const { qrMessage, previewUrl } = await readCertificatePdf(file);
      console.log(qrMessage);

      const certLink = process.env.NEXT_PUBLIC_CERTIFICATE_LINK || '';
      if (!qrMessage.startsWith(certLink)) {
        setVerificationError(
          'QR Code tidak valid atau tidak berasal dari sistem ini.'
        );
        setIsQrMsg(''); // Clear QR msg so user can't submit
      } else {
        setVerificationError('');
        setIsQrMsg(qrMessage);
      }

      setIsPreview(previewUrl);
    } catch (err: any) {
      console.error(err);
      setVerificationError(
        'Gagal memverifikasi file. Pastikan file adalah sertifikat yang valid.'
      );
      setIsQrMsg('');
      setIsPreview('');
    } finally {
      setIsLoading(false);
    }
  }

  function handleClick() {
    fileInputRef.current?.click();
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) {
      throw new Error('file tidak dapat dimuat');
    }
    const file = files[0];
    await processFile(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function handleFileDrop(file: File) {
    processFile(file);
  }

  const { isDragging, dragHandlers } = useDragAndDrop({
    onFileDrop: handleFileDrop,
    acceptedTypes: ['application/pdf'],
  });

  async function handleSubmit() {
    router.push(isQrMsg);
  }

  return {
    isPreview,
    verificationError,
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
