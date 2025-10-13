import { Link } from '@heroui/react';
import ServiceCard from '@/components/ui/Card/ServiceCard';
import MainNavbar from '@/components/ui/Navbar/MainNavbar';
import useTOEFLPage from './useTOEFLPage';

export default function TOEFLPage() {
  const { user, isAuthenticated } = useTOEFLPage();
  return (
    <div className="bg-default-100">
      <MainNavbar user={user} isAuthenticated={isAuthenticated}>
        <section className="mt-[4rem] flex h-[45vh] flex-col items-center-safe justify-center-safe px-[5%]">
          <h1 className="text-primary-800 text-[3rem] font-extrabold">
            Layanan Kami
          </h1>
          <p className="text-default-500 text-center">
            Jelajahi beragam layanan kebahasan yang dirancang untuk mendukung
            <span className="block">
              keberhasilan akademik dan profesional anda
            </span>
          </p>
        </section>
        <section className="mb-6 flex scale-95 flex-wrap justify-between gap-6">
          <ServiceCard />
          <ServiceCard />
          <ServiceCard />
          <ServiceCard />
          <ServiceCard />
          <ServiceCard />
        </section>
        <footer className="bg-primary-800 pt-16 pb-8 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 grid grid-cols-1 gap-8 text-center md:grid-cols-3 md:text-left">
              <div>
                <h4 className="text-text-light dark:text-text-dark mb-3 text-lg font-semibold">
                  OFFICE HOURS
                </h4>
                <div className="dark:border-border-dark mb-3 border-t border-gray-300"></div>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  08:00 am - 03.00 pm (weekdays)
                </p>
              </div>

              <div>
                <h4 className="text-text-light dark:text-text-dark mb-3 text-lg font-semibold">
                  ADDRESS
                </h4>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Kampus Bumi Tri Dharma Universitas Halu Oleo
                  <br />
                  Jln. H.E.A. Mokodompit, Anduonohu, Kendari, Sulawesi Tenggara
                </p>
              </div>

              <div>
                <h4 className="text-text-light dark:text-text-dark mb-3 text-lg font-semibold">
                  CONTACT US
                </h4>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Phone: 0401-3195241
                </p>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Whatsapp: 0813-9295-5256
                </p>
                <Link
                  isExternal
                  href="mailto:uptbahasa.unhalu@gmail.com"
                  className="text-text-secondary-light dark:text-text-secondary-dark hover:underline"
                >
                  E-mail: uptbahasa.unhalu@gmail.com
                </Link>
              </div>
            </div>

            <div className="text-text-secondary-light dark:text-text-secondary-dark text-center text-sm">
              <p>
                Copyright © 2025 SIMPEKA - UPT Bahasa UHO. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </MainNavbar>
    </div>
  );
}
