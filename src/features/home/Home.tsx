import { LuArrowRight } from 'react-icons/lu';
// Menghapus ikon-ikon kecil yang tidak lagi digunakan
import { Button } from '@heroui/react';
import { type Variants, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import BaseCard from '@/components/ui/Card/Base';
import TestimonyCard from '@/components/ui/Card/Testimony';
import { CONTENT_HOW, CONTENT_TESTIMONY, CONTENT_WHY } from './home.constants';

// Varian animasi untuk blob
const floatVariants: Variants = {
  float: {
    y: [0, -120, 0, 120],
    x: [120, 0, -120, 0],
    scale: [1, 1.1, 0.9, 1],
  },
};

// Transisi float yang terpisah
const floatTransition = {
  duration: 5,
  ease: 'easeInOut' as const,
  repeat: Infinity,
  repeatType: 'mirror' as const, // Gunakan 'mirror' untuk gerakan bolak-balik yang mulus
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const fadeInItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const Home = () => {
  const router = useRouter();

  const handlePress = () => {
    router.push('/verification');
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-bg-dark relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center overflow-hidden mask-b-from-100% mask-b-to-0% pt-20">
        {/* Blob background (dikembalikan sebagai tekstur halus) */}
        <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
          <motion.div
            className="bg-secondary absolute right-1/5 bottom-1/4 -z-10 h-72 w-72 rounded-full blur-3xl"
            variants={floatVariants}
            animate="float"
            transition={floatTransition}
          />
          <motion.div
            className="bg-primary absolute top-1/4 left-1/6 -z-20 h-96 w-96 rounded-full opacity-40 blur-3xl"
            variants={floatVariants}
            animate="float"
            transition={{
              ...floatTransition,
              duration: 8, // Sedikit berbeda durasinya agar tidak sinkron
              delay: 1,
            }}
          />
        </div>

        {/* Elemen-elemen kecil tersebar di Hero Section - DIHAPUS */}
        {/* Konten Hero - Layout Satu Kolom Rata Tengah */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-[5%] py-16 text-center"
        >
          {' '}
          {/* Mengubah layout menjadi satu kolom rata tengah */}
          <h1 className="text-text text-5xl leading-tight font-extrabold md:text-6xl">
            Platform Tes TOEFL Terpercaya dengan Keamanan{' '}
            <span className="text-primary">Blockchain</span>
          </h1>
          <p className="text-text-muted my-6 text-lg">
            Menyediakan platform tes TOEFL yang mudah diakses dan terjamin
            keaslian sertifikatnya melalui teknologi smart contract.
          </p>
          <Button
            endContent={<LuArrowRight strokeWidth={3} className="mt-1" />}
            data-hover="false"
            onPress={handlePress}
            className="bg-primary relative h-12 rounded-full px-10 text-lg font-bold text-white transition-all duration-100 hover:-translate-y-1 active:translate-y-0"
          >
            Verifikasi Sertifikat Sekarang
          </Button>
        </motion.div>
      </section>

      {/* Section Mengapa Memilih Simpeka? */}
      <section className="bg-bg-light px-[5%] py-20">
        <div className="mb-16 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
          >
            <h2 className="text-text text-3xl font-extrabold">
              Mengapa Memilih Simpeka?
            </h2>
            <p className="text-text-muted mx-auto mt-3 text-lg lg:max-w-[60%]">
              Simpeka adalah platform tes TOEFL terpercaya yang memastikan
              keaslian sertifikatnya melalui teknologi smart contract.
            </p>
          </motion.div>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="mx-auto flex max-w-7xl justify-center gap-8"
        >
          {CONTENT_WHY.map((item, index) => (
            <motion.div key={index} variants={fadeInItem} className="w-full">
              <BaseCard
                icon={item.icon}
                title={item.title}
                description={item.description}
                className="bg-bg-light"
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Section Bagaimana Cara Kerjanya? */}
      <section className="bg-bg px-[5%] py-20">
        <div className="mb-16 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
          >
            <h1 className="text-text text-3xl font-extrabold">
              Bagaimana Cara Kerjanya?
            </h1>
            <p className="text-text-muted mx-auto mt-3 text-lg lg:max-w-[60%]">
              Tiga langkah mudah untuk mendapatkan sertifikat TOEFL Anda yang
              terverifikasi.
            </p>
          </motion.div>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="mx-auto flex max-w-7xl justify-center gap-8"
        >
          {CONTENT_HOW.map((item, idx) => (
            <motion.div key={idx} variants={fadeInItem} className="w-full">
              <BaseCard
                index={idx + 1}
                title={item.title}
                description={item.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Section Apa Kata Mereka? */}
      <section className="bg-secondary px-[5%] py-20">
        <div className="mb-16 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
          >
            <h1 className="text-3xl font-extrabold text-white">
              Apa Kata Mereka?
            </h1>
            <p className="mx-auto mt-3 text-lg text-white/80 lg:max-w-[60%]">
              Cerita sukses dari pengguna yang telah mempercayai SIMPEKA.
            </p>
          </motion.div>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="mx-auto flex max-w-7xl justify-center gap-8"
        >
          {CONTENT_TESTIMONY.map((item, index) => (
            <motion.div key={index} variants={fadeInItem} className="w-full">
              <TestimonyCard
                name={item.name}
                job={item.job}
                testimony={item.testimony}
                className="bg-transparent border-[3px] border-bg-light hover:shadow-none [&>p]:text-bg-light [&>h1]:text-bg-light [&>h2]:text-bg-light/80 hover:-translate-y-2 hover:bg-white/5"
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Terakhir */}
      <section className="text-text bg-bg-dark px-[5%] py-20 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
        >
          <h1 className="mb-4 text-3xl font-bold">
            Siap Meningkatkan Skor TOEFL Anda?
          </h1>
          <p className="text-text-muted mx-auto lg:max-w-[60%]">
            Bergabunglah dengan ribuan pengguna lain dan raih tujuan akademik
            serta profesional Anda bersama SIMPEKA
          </p>
          <Button
            onPress={() => router.push('/service')}
            radius="full"
            data-hover="false"
            className="bg-primary mt-8 h-12 px-10 text-lg font-bold text-white transition-all duration-100 hover:-translate-y-1 active:translate-y-0"
          >
            Lihat Pilihan Tes
          </Button>
        </motion.div>
      </section>
    </>
  );
};

export default Home;
