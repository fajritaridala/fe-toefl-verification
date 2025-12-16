import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Skeleton,
  cn,
} from '@heroui/react';
import { type Variants, motion } from 'framer-motion';
import { ArrowLeft, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCertificate } from './useCertificate';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const Certificate = () => {
  const router = useRouter();
  const { isLoading, error, pdfBlobUrl, handleDownload } = useCertificate();

  const showSkeleton = isLoading || error || !pdfBlobUrl;

  return (
    <div className="bg-bg-light min-h-screen pt-24 pb-12">
      <main className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-8"
        >
          {/* Left Column: Header & Description */}
          <div className="flex flex-col items-start lg:w-1/3">
            <Button
              variant="light"
              className="text-secondary hover:text-secondary/80 group -ml-3 h-auto p-2 font-medium data-[hover=true]:bg-transparent"
              startContent={
                <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
              }
              onPress={() => router.back()}
              disableRipple
            >
              Kembali
            </Button>

            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-black">
                Sertifikat Hasil Tes
              </h1>
              <p className="text-text-muted">
                {showSkeleton
                  ? 'Sedang memproses dokumen sertifikat Anda...'
                  : 'Berikut adalah pratinjau sertifikat resmi SIMPEKA Anda. Silakan unduh file PDF untuk keperluan administratif.'}
              </p>
            </div>
          </div>

          {/* Right Column: Certificate Card */}
          <div className="w-full lg:w-2/3 lg:pt-8">
            <Card
              className="shadow-neo w-full border border-gray-200"
              radius="lg"
            >
              <CardBody className="overflow-hidden bg-white p-0">
                <div className="w-full">
                  {/* Aspect Ratio A4 Landscape */}
                  <div
                    className="relative mx-auto w-full bg-gray-50"
                    style={{ aspectRatio: '1.414/1' }}
                  >
                    {showSkeleton ? (
                      <Skeleton className="h-full w-full" />
                    ) : (
                      <iframe
                        src={`${pdfBlobUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                        className="h-full w-full border-0"
                        title="Certificate Preview"
                      />
                    )}
                  </div>
                </div>
              </CardBody>

              <CardFooter className="border-border justify-end gap-3 border-t bg-white p-6">
                {showSkeleton ? (
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-32 rounded-lg" />
                  </div>
                ) : (
                  <Button
                    color="primary"
                    size="lg"
                    radius="full"
                    className="font-semibold shadow-md"
                    startContent={<Download size={20} />}
                    onPress={handleDownload}
                  >
                    Unduh PDF
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Certificate;
