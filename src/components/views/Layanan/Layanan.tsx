import Image from 'next/image';
import { useRouter } from 'next/router';
import ServiceCard from '@/components/ui/Card/Service';
import BaseFooter from '@/components/ui/Footer/Base';
import BaseNavbar from '@/components/ui/Navbar/BaseNavbar';
import useUserSession from '@/hooks/useUserSession';
import toRupiah from '@/utils/toRupiah';
import useLayanan from './useLayanan';

const Layanan = () => {
  const router = useRouter();
  const pathname = router.pathname;
  const { data, isAuthenticated } = useUserSession();
  const { layanan, isErrorLayanan, isPendingLayanan, handleRedirect } =
    useLayanan();
  console.log(layanan)

  return (
    <div className="bg-bg-light">
      <BaseNavbar
        user={data}
        isAuthenticated={isAuthenticated}
        pathname={pathname}
      >
        <section className="relative mx-auto my-32 flex flex-row lg:max-w-5xl">
          <div className="bg-secondary absolute -top-50 -left-20 h-[30rem] w-[30rem] rounded-full blur-[12rem]" />
          <div className="bg-primary absolute right-30 bottom-20 h-[10rem] w-[10rem] rounded-full blur-[9rem]" />
          <div className="animate-fade-left relative z-0 flex flex-col justify-center text-left">
            <h1 className="text-primary mb-4 text-6xl font-extrabold">
              Bahasa menghubungkan <br /> kita semua
            </h1>
            <p className="text-text-muted w-lg text-lg">
              Melalui kemampuan bahasa, setiap individu dapat saling terhubung
              dan memahami satu sama lain
            </p>
          </div>
          <Image
            src="/img/our-services.webp"
            alt="our services images"
            width={1580}
            height={1580}
            priority
            className="!shadow-main animate-fade-right relative z-0 w-[30vw] rounded-lg border-black"
          />
        </section>
        <section className="relative overflow-hidden">
          <div className="bg-secondary absolute -right-30 bottom-0 h-72 w-72 rounded-full blur-[10rem]" />
          <div className="relative mx-auto bg-transparent lg:max-w-5xl">
            <div className="pt-12 text-center">
              <h1 className="text-text text-3xl font-extrabold">
                Layanan Kami
              </h1>
              <p className="text-text-muted mx-auto mt-3 text-lg lg:max-w-[50%]">
                Kami menyediakan berbagai pilihan tes TOEFL yang dapat
                disesuaikan dengan kebutuhan Anda
              </p>
            </div>
            <div className="mx-auto grid w-full grid-flow-col justify-between gap-8 py-14">
              {layanan?.map((item) => (
                <ServiceCard
                  key={item._id}
                  title={item.name}
                  schedule={String(item.duration)}
                  description={item.description}
                  price={toRupiah(item.price)}
                  notes={item.notes}
                  redirect={() => handleRedirect(item._id)}
                />
              ))}
            </div>
          </div>
        </section>
        <BaseFooter />
      </BaseNavbar>
    </div>
  );
};

export default Layanan;
