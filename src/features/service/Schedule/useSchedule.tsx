import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { schedulesService } from '@features/admin';
import { ScheduleItem } from '@features/admin';
import { ScheduleData } from '@/hooks/useCalendar';

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
        _id: item.scheduleId,
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
