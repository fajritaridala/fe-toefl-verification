"use client";

import { useParams } from 'next/navigation';
import Calendar from '@/components/ui/Card/Calendar';
import useSchedule from './useSchedule';

const Schedule = () => {
  const params = useParams<{ service_id?: string }>();
  const { scheduleData } = useSchedule(params?.service_id ?? '');
  return (
    <section className="flex justify-center">
      <div className="animate-fade-bottom my-18 w-3xl">
        <Calendar data={scheduleData} />
      </div>
    </section>
  );
};

export default Schedule;
