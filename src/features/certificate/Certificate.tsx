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
    <div className="min-h-screen bg-bg-light pt-24 pb-12">
      <main className="container mx-auto px-4 max-w-7xl">
        <div className="mb-10 text-left">
          <h1 className="text-3xl font-extrabold text-text tracking-tight">
            Sertifikat Hasil Tes
          </h1>
          <p className="mt-2 text-lg text-text-muted">
             {showSkeleton 
            ? "Memproses pratinjau dokumen..." 
            : "Pratinjau dokumen resmi (PDF)."}
          </p>
        </div>

      <Card className="w-full max-w-4xl shadow-lg" radius="lg"> {/* Changed to max-w-5xl to not be too small, or 4xl. User said 'kecilin'. Let's try max-w-4xl as intended, but centered? No, if I use mx-auto it centers. I'll keep default left align for card? No, distinct card usually centered. But Activity is a grid. Let's assume left aligned to match 'posisi sama'? No, title is same. Card is content. I will use max-w-4xl and NO mx-auto to align with title? Or mx-auto? The uploaded image shows title centered effectively because of the container constraint. Now title will be left. Card should probably be left too? Let's try left aligned card to be safe with 'samakan' vibe, or maybe just max-w-4xl. Let's stick to 'mx-auto' for card because it looks better, but DEFINITELY fix the title alignment. Actually, previously I set max-w-4xl on main. I will change main to max-w-7xl. And Card to max-w-4xl. I'll remove mx-auto from Card to align it with the title on the left. */}

        {/* Tambahkan padding (p-6) dan ubah background jadi putih (bg-white) */}
        <CardBody className="p-6 overflow-hidden bg-white">
          
          <div className="w-full">
             {/* Aspect Ratio A4 Landscape */}
             <div className="relative mx-auto w-full" style={{ aspectRatio: '1.414/1', minHeight: '400px' }}> {/* Reduced min-height slightly */}
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
      </main>
    </div>
  );
};

export default Certificate;