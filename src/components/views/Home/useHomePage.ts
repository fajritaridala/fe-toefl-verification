import { ChangeEvent, RefObject, useState } from 'react';
import { useRouter } from 'next/navigation';
import contractService from '@/services/contract.service';
import readCertificatePdf from '@/utils/libs/pdfjs-dist/readCertificatePdf';

export default function useHomePage(
  fileInputRef: RefObject<HTMLInputElement | null>
) {
  const router = useRouter();
  const [isPreview, setIsPreview] = useState<string>('');
  const [isQrMsg, setIsQrMsg] = useState<string>('');

  if (!fileInputRef) throw new Error('Gagal menginisialisasi input file');
  // onClick bisa memunculkan pemilihan file
  function handleClick() {
    fileInputRef.current?.click();
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) throw new Error('file tidak dapat dimuat');
    const file = files[0];

    const { qrMessage, previewUrl } = await readCertificatePdf(file);
    setIsQrMsg(qrMessage);
    setIsPreview(previewUrl);
    return {};
  }

  async function handleSubmit() {
    router.push(isQrMsg);
  }

  return {
    isPreview,
    handleSubmit,
    handleClick,
    handleFile,
  };
}
