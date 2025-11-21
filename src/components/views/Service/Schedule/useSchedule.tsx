import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import schedulesService from '@/services/schedules.service';

const useSchedule = (service_id: string) => {
  const { data } = useQuery({
    queryKey: ['schedule', service_id],
    queryFn: async () => await schedulesService.getSchedules({ service_id }),
    enabled: !!service_id,
  });
  const scheduleData = data?.data.data || [];

  return { scheduleData };
};

export default useSchedule;
