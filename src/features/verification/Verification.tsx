import { motion, type Variants } from 'framer-motion';
import UploaderCard from "@/components/ui/Card/Uploader";
import useVerification from "./useVerification";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

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
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mt-24 text-center"
        >
          <h1 className="text-text mx-auto mb-4 text-4xl font-extrabold">
            Verifikasi Keaslian Sertifikat
          </h1>
          <p className="text-text-muted mx-auto mt-2 lg:max-w-2xl">
            Unggah sertifikat Anda untuk memeriksa keasliannya pada sistem
            blockchain kami. Pastikan sertifikat yang Anda unggah adalah file
            resmi dari SIMPEKA.
          </p>
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-12 w-xl"
        >
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
        </motion.div>
      </section>
    </div>
  );
};

export default Verification;
