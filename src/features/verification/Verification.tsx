import { Button } from '@heroui/react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import UploaderCard from '@/components/ui/Card/Uploader';
import useVerification from './useVerification';

const Verification = () => {
  const router = useRouter();
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
    <section className="flex justify-center bg-white py-10">
      <div className="animate-fade-bottom my-10 flex w-full flex-col gap-6 px-6 lg:max-w-6xl lg:flex-row">
        {/* Header */}
        <div className="w-full space-y-2 lg:w-1/3">
          <Button
            variant="light"
            data-hover={false}
            onPress={() => router.back()}
            className="text-secondary hover:text-secondary/60 group -ml-3 w-fit p-0"
            startContent={
              <ArrowLeft
                size={18}
                className="transform duration-300 group-hover:-translate-x-1"
              />
            }
          >
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-extrabold text-black">
              Verifikasi Keaslian Sertifikat
            </h1>
            <p className="text-sm text-gray-500">
              Unggah sertifikat resmi SIMPEKA Anda untuk memverifikasi
              keasliannya.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-2/3 lg:pt-8">
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
      </div>
    </section>
  );
};

export default Verification;
