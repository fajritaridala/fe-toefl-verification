import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { servicesService } from '@features/admin/admin.service';
import { schedulesService } from '@features/admin/admin.service';
import { enrollmentsService } from '@features/admin/admin.service';
import { ServiceListResponse } from '@features/admin/admin.types';
import {
  EnrollmentItem,
  EnrollmentListResponse,
  ScheduleItem,
  ScheduleListResponse,
} from '@features/admin/admin.types';

const useDashboard = () => {
  const servicesQuery = useQuery({
    queryKey: ['admin-dashboard', 'services'],
    queryFn: async () => {
      const response = await servicesService.getServices({ page: 1, limit: 5 });
      return response.data as ServiceListResponse;
    },
  });

  const schedulesQuery = useQuery({
    queryKey: ['admin-dashboard', 'schedules'],
    queryFn: async () => {
      const response = await schedulesService.getSchedules({
        page: 1,
        limit: 20,
        status: 'aktif',
      });
      return response.data as ScheduleListResponse;
    },
  });

  const pendingEnrollmentsQuery = useQuery({
    queryKey: ['admin-dashboard', 'enrollments', 'pending'],
    queryFn: async () => {
      const response = await enrollmentsService.getEnrollments({
        status: 'menunggu',
        limit: 1,
      });
      return response.data as EnrollmentListResponse;
    },
  });

  const approvedEnrollmentsQuery = useQuery({
    queryKey: ['admin-dashboard', 'enrollments', 'approved'],
    queryFn: async () => {
      const response = await enrollmentsService.getEnrollments({
        status: 'disetujui',
        limit: 1,
      });
      return response.data as EnrollmentListResponse;
    },
  });

  const rejectedEnrollmentsQuery = useQuery({
    queryKey: ['admin-dashboard', 'enrollments', 'rejected'],
    queryFn: async () => {
      const response = await enrollmentsService.getEnrollments({
        status: 'ditolak',
        limit: 1,
      });
      return response.data as EnrollmentListResponse;
    },
  });

  const recentEnrollmentsQuery = useQuery({
    queryKey: ['admin-dashboard', 'enrollments', 'recent'],
    queryFn: async () => {
      const response = await enrollmentsService.getEnrollments({
        page: 1,
        limit: 5,
      });
      return response.data as EnrollmentListResponse;
    },
  });

  const summary = useMemo(() => {
    const totalServices = servicesQuery.data?.pagination?.total;
    const totalSchedules = schedulesQuery.data?.pagination?.total;
    const totalParticipants = recentEnrollmentsQuery.data?.pagination?.total;
    const pending = pendingEnrollmentsQuery.data?.pagination?.total ?? 0;
    const approved = approvedEnrollmentsQuery.data?.pagination?.total ?? 0;
    const rejected = rejectedEnrollmentsQuery.data?.pagination?.total ?? 0;

    return {
      totalServices: totalServices ?? servicesQuery.data?.data.length ?? 0,
      totalSchedules: totalSchedules ?? schedulesQuery.data?.data.length ?? 0,
      totalParticipants: totalParticipants ?? recentEnrollmentsQuery.data?.data.length ?? 0,
      pendingEnrollments: pending,
      approvedEnrollments: approved,
      rejectedEnrollments: rejected,
    };
  }, [
    rejectedEnrollmentsQuery.data,
    approvedEnrollmentsQuery.data,
    pendingEnrollmentsQuery.data,
    recentEnrollmentsQuery.data,
    schedulesQuery.data,
    servicesQuery.data,
  ]);

  const upcomingSchedules = useMemo(() => {
    const schedules = schedulesQuery.data?.data ?? [];
    return [...schedules]
      .sort((a, b) =>
        new Date(a.scheduleDate).getTime() - new Date(b.scheduleDate).getTime()
      )
      .slice(0, 5);
  }, [schedulesQuery.data]);

  const recentParticipants = useMemo(() => {
    return (recentEnrollmentsQuery.data?.data ?? []) as EnrollmentItem[];
  }, [recentEnrollmentsQuery.data]);

  return {
    summary,
    upcomingSchedules: upcomingSchedules as ScheduleItem[],
    recentParticipants,
    isLoadingSummary:
      servicesQuery.isLoading ||
      pendingEnrollmentsQuery.isLoading ||
      approvedEnrollmentsQuery.isLoading ||
      rejectedEnrollmentsQuery.isLoading ||
      recentEnrollmentsQuery.isLoading,
    isLoadingSchedules: schedulesQuery.isLoading,
    isLoadingParticipants: recentEnrollmentsQuery.isLoading,
    refetch: () => {
      servicesQuery.refetch();
      schedulesQuery.refetch();
      pendingEnrollmentsQuery.refetch();
      approvedEnrollmentsQuery.refetch();
      rejectedEnrollmentsQuery.refetch();
      recentEnrollmentsQuery.refetch();
    },
  };
};

export default useDashboard;
