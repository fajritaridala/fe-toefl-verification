import { LuArrowRight } from 'react-icons/lu';
import { Button } from '@heroui/react';
import { usePathname, useRouter } from 'next/navigation';
import BaseCard from '@/components/ui/Card/Base';
import TestimonyCard from '@/components/ui/Card/Testimony';
import BaseFooter from '@/components/ui/Footer/Base';
import BaseNavbar from '@/components/ui/Navbar/BaseNavbar';
import useUserSession from '@/hooks/useUserSession';
import { CONTENT_HOW, CONTENT_TESTIMONY, CONTENT_WHY } from './Home.constants';

const Home = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isAuthenticated } = useUserSession();

  const handlePress = () => {
    router.push('/toefl/verification');
  };

  return (
    <BaseNavbar
      isAuthenticated={isAuthenticated}
      user={data}
      pathname={pathname}
    >
      <section className="relative flex flex-col mask-b-from-100% mask-b-to-0%">
        <div className="absolute inset-0 -z-10 h-[100vh] w-full overflow-hidden">
          <div className="bg-secondary absolute right-50 bottom-70 -z-10 h-72 w-72 rounded-full blur-[10rem]" />
          <div className="bg-primary absolute top-0 left-40 -z-20 h-96 w-96 rounded-full border blur-[10rem]" />
        </div>
        <div className="z-10 flex h-[80vh] flex-col">
          <div className="fixed left-0 mt-30 mb-6 px-[10%] text-center">
            <h1 className="text-text mx-auto text-6xl font-extrabold">
              Platform Tes TOEFL Terpercaya dengan Keamanan{' '}
              <span className="text-primary">Blockchain</span>
            </h1>
            <p className="mx-auto my-6 max-w-150 text-lg text-black/60">
              Menyediakan platform tes TOEFL yang mudah diakses dan terjamin
              keaslian sertifikatnya melalui teknologi smart contract.
            </p>
          </div>
          <div className="fixed left-0 mt-90 flex w-full justify-center">
            <Button
              endContent={<LuArrowRight strokeWidth={3} className="mt-1" />}
              data-hover="false"
              onPress={handlePress}
              className="bg-primary relative rounded-full px-10 !py-6 font-bold text-white transition-all delay-75 duration-100 hover:-translate-y-1 active:translate-y-1"
            >
              <p>Verifikasi Sertifikat Sekarang</p>
            </Button>
          </div>
        </div>
      </section>
      <section className="bg-bg-light px-[10%] py-20">
        <div className="mb-16 text-center">
          <h2 className="text-text text-3xl font-extrabold">
            Mengapa Memilih Simpeka?
          </h2>
          <p className="text-text-muted mx-auto mt-3 text-lg lg:max-w-[60%]">
            Simpeka adalah platform tes TOEFL terpercaya yang memastikan
            keaslian sertifikatnya melalui teknologi smart contract.
          </p>
        </div>
        <div className="grid grid-flow-col grid-rows-1 gap-8">
          {CONTENT_WHY.map((item) => (
            <BaseCard
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </section>
      <section className="bg-bg px-[10%] py-20">
        <div className="mb-16 text-center">
          <h1 className="text-text text-3xl font-extrabold">
            Bagaimana Cara Kerjanya?
          </h1>
          <p className="text-text-muted mx-auto mt-3 text-lg lg:max-w-[60%]">
            Tiga langkah mudah untuk mendapatkan sertifikat TOEFL Anda yang
            terverifikasi.
          </p>
        </div>
        <div className="grid grid-flow-col grid-rows-1 gap-8">
          {CONTENT_HOW.map((item, idx) => (
            <BaseCard
              index={idx + 1}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </section>
      <section className="bg-bg-light px-[10%] py-20">
        <div className="mb-16 text-center">
          <h1 className="text-text text-3xl font-extrabold">
            Apa Kata Mereka?
          </h1>
          <p className="text-text-muted mx-auto mt-3 text-lg lg:max-w-[60%]">
            Cerita sukses dari pengguna yang telah mempercayai SIMPEKA.
          </p>
        </div>
        <div className="grid grid-flow-col grid-rows-1 gap-8">
          {CONTENT_TESTIMONY.map((item) => (
            <TestimonyCard
              name={item.name}
              job={item.job}
              testimony={item.testimony}
            />
          ))}
        </div>
      </section>
      <section className="bg-secondary text-bg-light px-[10%] py-20 text-center">
        <h1 className="mb-4 text-3xl font-bold">
          Siap Meningkatkan Skor TOEFL Anda?
        </h1>
        <p className="mx-auto lg:max-w-[60%]">
          Bergabunglah dengan ribuan pengguna lain dan raih tujuan akademik
          serta profesional Anda bersama SIMPEKA
        </p>
        <Button
          onPress={() => router.push('/toefl')}
          radius="full"
          data-hover="false"
          className="bg-primary mt-8 px-10 !py-6 font-bold text-white transition-all delay-75 duration-100 hover:-translate-y-1 active:translate-y-1"
        >
          Lihat Pilihan Tes
        </Button>
      </section>
      <BaseFooter />
    </BaseNavbar>
  );
};

export default Home;
