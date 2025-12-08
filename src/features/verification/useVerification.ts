import { ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import readCertificatePdf from "@/lib/pdfjs-dist/readCertificatePdf";

const useVerification = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [isPreview, setIsPreview] = useState<string>("");
  const [isQrMsg, setIsQrMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!fileInputRef) {
    throw new Error("Gagal menginisialisasi input file");
  }

  async function processFile(file: File) {
    setIsLoading(true);
    try {
      const { qrMessage, previewUrl } = await readCertificatePdf(file);
      setIsQrMsg(qrMessage);
      setIsPreview(previewUrl);
    } catch {
      throw new Error("Error processing file");
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
      throw new Error("file tidak dapat dimuat");
    }
    const file = files[0];
    await processFile(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleFileDrop(file: File) {
    processFile(file);
  }

  const { isDragging, dragHandlers } = useDragAndDrop({
    onFileDrop: handleFileDrop,
    acceptedTypes: ["application/pdf"],
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
