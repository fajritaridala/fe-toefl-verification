import { Button, Spinner } from "@heroui/react";
import { motion } from "framer-motion";
import {  ArrowLeft, CheckCircle2, Home, ShieldAlert } from "lucide-react";
import Link from 'next/link';
import VerificationCard from "@/components/ui/Card/Verification";
import useVerificationResult from "./useVerificationResult";

const VerificationResult = () => {
  const { isPeserta, isScorePeserta, isLoading, isError, isVerified } = useVerificationResult();

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex min-h-[60vh] flex-col items-center justify-center gap-4"
      >
        <Spinner size="lg" color="primary" classNames={{ wrapper: "w-16 h-16" }} />
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
        className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center"
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-danger-50 text-danger shadow-sm">
          <ShieldAlert className="h-12 w-12" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Verifikasi Gagal</h2>
          <p className="text-gray-500">
            {isError || "Maaf, kami tidak dapat menemukan data sertifikat yang valid untuk ID tersebut."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            as={Link}
            href="/"
            variant="flat"
            radius="full"
            startContent={<Home className="h-4 w-4" />}
          >
            Beranda
          </Button>
          <Button
            as={Link}
            href="/verification"
            color="primary"
            radius="full"
            startContent={<ArrowLeft className="h-4 w-4" />}
          >
            Cari Lagi
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-bg-dark w-full flex flex-col items-center gap-6 py-8"
    >
      {isVerified && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex w-full max-w-2xl items-center gap-3 rounded-2xl border border-success-200 bg-success-50 px-6 py-4 text-success-700 shadow-sm mx-4"
        >
           <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0" />
           <div className="flex-1">
             <h3 className="font-bold text-success">Verifikasi Berhasil</h3>
             <p className="text-sm text-success">Data sertifikat valid dan terverifikasi di Blockchain.</p>
           </div>
        </motion.div>
      )}

      <div className="w-full max-w-3xl md:scale-100 transition-transform">
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
