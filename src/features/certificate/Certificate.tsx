'use client';

import { Card, CardBody, CardFooter, Skeleton, Button } from '@heroui/react';
import { Download } from 'lucide-react';
import { useCertificate } from './useCertificate';

const Certificate = () => {
  const { 
    isLoading, 
    error, 
    pdfBlobUrl, 
    handleDownload 
  } = useCertificate();

  const showSkeleton = isLoading || error || !pdfBlobUrl;

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Sertifikat Hasil Tes
        </h1>
        <p className="mt-2 text-gray-500">
          {showSkeleton 
            ? "Memproses pratinjau dokumen..." 
            : "Pratinjau dokumen resmi (PDF)."}
        </p>
      </div>

      <Card className="mx-auto w-full shadow-lg" radius="lg">
        {/* Tambahkan padding (p-6) dan ubah background jadi putih (bg-white) */}
        <CardBody className="p-6 overflow-hidden bg-white">
          
          <div className="w-full">
             {/* Aspect Ratio A4 Landscape */}
             <div className="relative mx-auto w-full" style={{ aspectRatio: '1.414/1', minHeight: '500px' }}>
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
    </section>
  );
};

export default Certificate;