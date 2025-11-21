import { useRouter } from 'next/router';
import CalendarCard from '@/components/ui/Card/Calendar';
import useSchedule from './useSchedule';

const Schedule = () => {
  const router = useRouter();
  const { service_id } = router.query;
  const { scheduleData } = useSchedule(service_id as string);
  return (
    <section className="flex justify-center">
      <div className="animate-fade-bottom my-18 w-3xl">
        <CalendarCard data={scheduleData} />
      </div>
    </section>
  );
};

export default Schedule;
