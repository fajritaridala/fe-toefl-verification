import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import schedulesService from '@/services/schedules.service';
import { ScheduleItem } from '@/utils/interfaces/Schedule';
import { ScheduleData } from '@/components/ui/Card/Calendar/useCalendar';

const useSchedule = (serviceId: string) => {
  const { data } = useQuery({
    queryKey: ['schedule', serviceId],
    queryFn: async () => schedulesService.getSchedules({ serviceId }),
    enabled: !!serviceId,
  });

  const scheduleData: ScheduleData[] = useMemo(
    () => {
      const schedules = (data?.data.data as ScheduleItem[]) || [];
      return schedules.map((item) => ({
        _id: item._id,
        scheduleDate: item.scheduleDate,
        serviceName: item.serviceName,
        quota: item.quota || 0,
        registrants: item.registrants || 0,
        status: item.status,
      }));
    },
    [data]
  );

  return { scheduleData };
};

export default useSchedule;
