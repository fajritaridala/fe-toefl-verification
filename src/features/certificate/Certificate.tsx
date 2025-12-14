import { Card, CardBody, CardFooter, Skeleton, Button } from '@heroui/react';
import { Download } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { useCertificate } from './useCertificate';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

const Certificate = () => {
  const { 
    isLoading, 
    error, 
    pdfBlobUrl, 
    handleDownload 
  } = useCertificate();

  const showSkeleton = isLoading || error || !pdfBlobUrl;

  return (
    <div className="min-h-screen bg-bg-light pt-24 pb-12">
      <main className="container mx-auto px-4 max-w-7xl">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-10 text-left"
        >
          <h1 className="text-3xl font-extrabold text-text tracking-tight">
            Sertifikat Hasil Tes
          </h1>
          <p className="mt-2 text-lg text-text-muted">
             {showSkeleton 
            ? "Memproses pratinjau dokumen..." 
            : "Pratinjau dokumen resmi (PDF)."}
          </p>
        </motion.div>

        <motion.div
           initial="hidden"
           animate="visible"
           variants={fadeInUp}
           transition={{ delay: 0.2 }}
        >
          <Card className="w-full max-w-4xl shadow-lg" radius="lg">
            {/* Tambahkan padding (p-6) dan ubah background jadi putih (bg-white) */}
            <CardBody className="p-6 overflow-hidden bg-white">
              
              <div className="w-full">
                 {/* Aspect Ratio A4 Landscape */}
                 <div className="relative mx-auto w-full" style={{ aspectRatio: '1.414/1', minHeight: '400px' }}>
                    {showSkeleton ? (
                       <Skeleton className="w-full h-full" />
                    ) : (
                       <iframe 
                         src={`${pdfBlobUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                         className="w-full h-full border-0"
                         title="Certificate Preview"
                       />
                    )}
                 </div>
              </div>

            </CardBody>

            <CardFooter className="justify-end gap-3 bg-white p-4 border-t border-gray-100">
              {showSkeleton ? (
                 <Skeleton className="h-10 w-32 rounded-lg"><div className="bg-default-300 h-full"></div></Skeleton>
              ) : (
                <Button 
                  color="primary" 
                  className="font-semibold shadow-md"
                  startContent={<Download className="h-4 w-4" />}
                  onPress={handleDownload}
                >
                  Unduh File PDF
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Certificate;