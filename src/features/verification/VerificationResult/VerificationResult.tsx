import { Button, Card, CardBody, Spinner } from '@heroui/react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import VerificationCard from '@/components/ui/Card/Verification';
import useVerificationResult from './useVerificationResult';

const VerificationResult = () => {
  const { isPeserta, isScorePeserta, isLoading, isError, isVerified } =
    useVerificationResult();

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex min-h-screen flex-col items-center justify-center gap-4"
      >
        <Spinner
          size="lg"
          color="primary"
          classNames={{ wrapper: 'w-16 h-16' }}
        />
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-lg font-medium text-gray-500"
        >
          Memverifikasi Keaslian Sertifikat...
        </motion.p>
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex h-screen flex-col items-center justify-center gap-6"
      >
        <div className="w-full max-w-lg">
          <Button
            as={Link}
            href="/verification"
            variant="light"
            className="text-secondary hover:text-secondary/80 group -ml-3 h-auto p-2 text-base font-medium data-[hover=true]:bg-transparent"
            startContent={
              <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
            }
            disableRipple
          >
            Kembali
          </Button>
        </div>
        <Card className="shadow-neo w-full max-w-lg" radius="lg">
          <CardBody className="flex flex-col items-center gap-6 py-8 text-center">
            <div className="bg-danger/20 flex h-25 w-25 items-center justify-center rounded-full">
              <div className="bg-danger flex h-20 w-20 items-center justify-center rounded-full text-white">
                <ShieldAlert className="h-10 w-10" />
              </div>
            </div>

            <div className="space-y-2 p-4">
              <h2 className="text-xl font-bold text-gray-900">
                Verifikasi Gagal
              </h2>
              <p className="text-gray-500">
                {isError ||
                  'Maaf, kami tidak dapat menemukan data sertifikat yang valid untuk ID tersebut.'}
              </p>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-bg-dark flex w-full flex-col items-center gap-6 py-8"
    >
      {isVerified && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="border-success-200 bg-success-50 text-success-700 mx-4 flex w-full max-w-2xl items-center gap-3 rounded-2xl border px-6 py-4 shadow-sm"
        >
          <CheckCircle2 className="text-success h-6 w-6 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-success font-bold">Verifikasi Berhasil</h3>
            <p className="text-success text-sm">
              Data sertifikat valid dan terverifikasi di Blockchain.
            </p>
          </div>
        </motion.div>
      )}

      <div className="w-full max-w-3xl transition-transform md:scale-100">
        <VerificationCard
          isPeserta={isPeserta}
          isScorePeserta={isScorePeserta}
        />
      </div>

      <div className="mt-4 flex gap-4">
        <Button
          as={Link}
          href="/verification"
          variant="light"
          radius="full"
          className="text-gray-500 hover:text-gray-900"
          startContent={<ArrowLeft className="h-4 w-4" />}
        >
          Cek Sertifikat Lain
        </Button>
      </div>
    </motion.div>
  );
};

export default VerificationResult;
