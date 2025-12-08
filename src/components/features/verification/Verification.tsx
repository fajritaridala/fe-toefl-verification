"use client";

import UploaderCard from '@/components/ui/Card/Uploader';
import useVerification from './useVerification';

const Verification = () => {
  const {
    isPreview,
    handleClick,
    handleFile,
    handleSubmit,
    isLoading,
    isDragging,
    dragHandlers,
    fileInputRef,
  } = useVerification();

  return (
    <div className="bg-bg min-h-screen">
      <section className="mb-20 flex flex-col">
          <div className="mt-24 text-center">
            <h1 className="text-text mx-auto mb-4 text-4xl font-extrabold">
              Verifikasi Keaslian Sertifikat
            </h1>
            <p className="text-text-muted mx-auto mt-2 lg:max-w-2xl">
              Unggah sertifikat Anda untuk memeriksa keasliannya pada sistem
              blockchain kami. Pastikan sertifikat yang Anda unggah adalah file
              resmi dari SIMPEKA.
            </p>
          </div>
          <div className="mx-auto animate-fade-bottom mt-12 w-xl">
            <UploaderCard
              handleSubmit={handleSubmit}
              fileInputRef={fileInputRef}
              handleClick={handleClick}
              handleFile={handleFile}
              isPreview={isPreview}
              loading={isLoading}
              isDragging={isDragging}
              dragHandlers={dragHandlers}
            />
          </div>
        </section>
    </div>
  );
};

export default Verification;
