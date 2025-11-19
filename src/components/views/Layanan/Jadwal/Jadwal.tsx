import { useParams, usePathname } from 'next/navigation';
import CalendarCard from '@/components/ui/Card/Calendar';
import BaseFooter from '@/components/ui/Footer/Base';
import BaseNavbar from '@/components/ui/Navbar/BaseNavbar';
import useJadwal from './useJadwal';

const Jadwal = () => {
  const { service_id } = useParams();
  const { dataJadwal } = useJadwal(service_id as string);
  return (
    <BaseNavbar>
      <section className="flex justify-center">
        <div className="animate-fade-bottom my-18 w-3xl">
          <CalendarCard data={dataJadwal} />
        </div>
      </section>
      <BaseFooter />
    </BaseNavbar>
  );
};

export default Jadwal;
