import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Progress,
  Skeleton,
} from '@heroui/react';
import {
  ArrowRight,
  Calendar,
  Clock3,
  ListChecks,
  Package,
  Plus,
  Users,
} from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import useDashboard from './useDashboard';

const statusColorMap: Record<string, 'warning' | 'success' | 'danger'> = {
  menunggu: 'warning',
  disetujui: 'success',
  ditolak: 'danger',
};

function Dashboard() {
  const {
    summary,
    upcomingSchedules,
    recentParticipants,
    isLoadingSummary,
    isLoadingSchedules,
    isLoadingParticipants,
  } = useDashboard();

  const totalEnrolled =
    summary.pendingEnrollments +
    summary.approvedEnrollments +
    summary.rejectedEnrollments;
  const approvalRate = totalEnrolled
    ? Math.round((summary.approvedEnrollments / totalEnrolled) * 100)
    : 0;
  const rejectionRate = totalEnrolled
    ? Math.round((summary.rejectedEnrollments / totalEnrolled) * 100)
    : 0;

  const summaryCards = [
    {
      key: 'services',
      label: 'Total Layanan',
      value: summary.totalServices,
      icon: <Package className="h-6 w-6" />,
    },
    {
      key: 'schedules',
      label: 'Jadwal Aktif',
      value: summary.totalSchedules,
      icon: <Calendar className="h-6 w-6" />,
    },
    {
      key: 'pending',
      label: 'Menunggu Validasi',
      value: summary.pendingEnrollments,
      icon: <Clock3 className="h-6 w-6" />,
    },
    {
      key: 'participants',
      label: 'Peserta Disetujui',
      value: summary.approvedEnrollments,
      icon: <ListChecks className="h-6 w-6" />,
    },
  ];

  return (
    <section className="space-y-8 pt-2">
      {/* Minimalist Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.key}
            className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-primary-100 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.label}</p>
                {isLoadingSummary ? (
                  <Skeleton className="mt-2 h-8 w-24 rounded-lg" />
                ) : (
                  <p className="mt-1 text-3xl font-bold text-gray-900 tracking-tight">
                    {card.value}
                  </p>
                )}
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                {card.icon}
              </div>
            </div>
            {/* Decorative background blur */}
            <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-primary-50/50 blur-2xl transition-all group-hover:bg-primary-100/50" />
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content Area: Schedules */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Jadwal Terdekat
                </h3>
                <p className="text-sm text-gray-500">
                  Sesi tes TOEFL yang akan datang
                </p>
              </div>
              <Button
                as={Link}
                href="/admin/schedules"
                size="sm"
                variant="light"
                color="primary"
                className="font-semibold"
                endContent={<ArrowRight className="h-4 w-4" />}
              >
                Lihat Semua
              </Button>
            </div>
            
            <div className="space-y-4">
                {isLoadingSchedules ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-xl" />
                  ))
                ) : upcomingSchedules.length ? (
                  upcomingSchedules.map((schedule) => (
                    <div
                      key={schedule.scheduleId}
                      className="group flex items-center gap-6 rounded-lg border border-gray-100 bg-white p-4 transition-all hover:border-primary-100 hover:bg-gray-50/50"
                    >
                      {/* Date Block */}
                      <div className="flex h-20 w-20 min-w-[5rem] flex-col items-center justify-center rounded-lg bg-primary-50 text-center transition-colors group-hover:bg-primary group-hover:text-white">
                        <span className="text-xs font-bold uppercase opacity-80">
                          {moment(schedule.scheduleDate).format('MMM')}
                        </span>
                        <span className="text-2xl font-bold">
                          {moment(schedule.scheduleDate).format('DD')}
                        </span>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0 py-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="truncate text-lg font-bold text-gray-900">
                            {schedule.serviceName}
                          </h4>
                          <Chip
                            size="sm"
                            variant="flat"
                            color={schedule.status === 'aktif' ? 'success' : 'default'}
                            classNames={{ content: "font-semibold" }}
                          >
                            {schedule.status === 'aktif' ? 'Aktif' : 'Non-aktif'}
                          </Chip>
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Clock3 className="h-4 w-4 text-primary" />
                            <span className="font-medium">
                              {moment(schedule.startTime).format('HH:mm')} - {moment(schedule.endTime).format('HH:mm')}
                            </span>
                          </div>
                          <div className="h-1 w-1 rounded-full bg-gray-300" />
                          <div className="flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-primary" />
                            <span className="font-medium">
                              <b className="text-gray-900">{schedule.registrants}</b>/{schedule.quota} Peserta
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="hidden sm:block pr-4">
                         <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-400 opacity-0 transition-all group-hover:border-primary-200 group-hover:text-primary group-hover:opacity-100">
                            <ArrowRight className="h-5 w-5" />
                         </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                      <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="font-semibold text-gray-900">Tidak ada jadwal</p>
                  </div>
                )}
            </div>
          </div>

          {/* Recent Participants */}
          <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Pendaftar Terbaru</h3>
                <p className="text-sm text-gray-500">
                  Update pendaftaran real-time
                </p>
              </div>
              <Button
                as={Link}
                href="/admin/participants"
                size="sm"
                variant="light"
                color="primary"
                className="font-semibold"
              >
                Lihat Semua
              </Button>
            </div>

            <div className="space-y-4">
              {isLoadingParticipants ? (
                 Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                       <Skeleton className="h-4 w-1/3 rounded" />
                       <Skeleton className="h-3 w-1/4 rounded" />
                    </div>
                  </div>
                 ))
              ) : recentParticipants.length ? (
                recentParticipants.map((p) => {
                   const initials = p.fullName
                     .split(' ')
                     .slice(0, 2)
                     .map(n => n[0])
                     .join('')
                     .toUpperCase();
                     
                   return (
                    <div key={p.enrollId} className="group flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600 transition-colors group-hover:bg-white group-hover:shadow-sm">
                          {initials}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{p.fullName}</p>
                          <p className="text-xs font-medium text-gray-500">NIM: {p.nim}</p>
                        </div>
                      </div>
                      <Chip
                        size="sm"
                        variant="dot"
                        color={statusColorMap[p.status]}
                        classNames={{
                          content: "capitalize font-bold text-xs",
                          base: "border-0"
                        }}
                      >
                        {p.status}
                      </Chip>
                    </div>
                   );
                })
              ) : (
                <p className="text-center text-sm text-gray-500 py-4">Belum ada pendaftar baru</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Approval Stats */}
          <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900">Ringkasan Validasi</h3>
            <p className="text-sm text-gray-500">Statistik persetujuan peserta</p>
            
            <div className="mt-8 space-y-6">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-gray-600">Approval Rate</span>
                  <span className="font-bold text-green-600">{approvalRate}%</span>
                </div>
                <Progress
                  size="sm"
                  value={approvalRate}
                  color="success"
                  classNames={{ track: "bg-gray-100" }}
                  aria-label="Approval Rate"
                />
              </div>
              
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-gray-600">Rejection Rate</span>
                  <span className="font-bold text-red-600">{rejectionRate}%</span>
                </div>
                 <Progress
                  size="sm"
                  value={rejectionRate}
                  color="danger"
                  classNames={{ track: "bg-gray-100" }}
                  aria-label="Rejection Rate"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4">
                 <div className="rounded-lg bg-gray-50 p-4 text-center">
                    <div className="text-xs font-semibold text-gray-400 uppercase">Total</div>
                    <div className="text-xl font-bold text-gray-900">{totalEnrolled}</div>
                 </div>
                 <div className="rounded-lg bg-green-50 p-4 text-center">
                    <div className="text-xs font-semibold text-green-600 uppercase">Valid</div>
                    <div className="text-xl font-bold text-green-700">{summary.approvedEnrollments}</div>
                 </div>
                 <div className="rounded-lg bg-amber-50 p-4 text-center">
                    <div className="text-xs font-semibold text-amber-600 uppercase">Wait</div>
                    <div className="text-xl font-bold text-amber-700">{summary.pendingEnrollments}</div>
                 </div>
              </div>
            </div>
          </div>

          {/* Quick Access */}
          <div className="space-y-4">
             <h4 className="px-2 text-xs font-bold uppercase tracking-wider text-gray-400">
               Quick Actions
             </h4>
             <div className="grid gap-4">
               <Link
                 href="/admin/services"
                 className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 transition-all hover:border-primary-200 hover:shadow-md hover:shadow-blue-500/5"
               >
                 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <Package className="h-6 w-6" />
                 </div>
                 <div>
                    <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">Layanan</p>
                    <p className="text-xs font-medium text-gray-500">Kelola jenis tes</p>
                 </div>
               </Link>

               <Link
                 href="/admin/schedules"
                 className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 transition-all hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-500/5"
               >
                 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                    <Calendar className="h-6 w-6" />
                 </div>
                 <div>
                    <p className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">Jadwal</p>
                    <p className="text-xs font-medium text-gray-500">Atur sesi ujian</p>
                 </div>
               </Link>

               <Link
                 href="/admin/participants"
                 className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 transition-all hover:border-violet-200 hover:shadow-md hover:shadow-violet-500/5"
               >
                 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-50 text-violet-600 transition-colors group-hover:bg-violet-600 group-hover:text-white">
                    <Users className="h-6 w-6" />
                 </div>
                 <div>
                    <p className="font-bold text-gray-900 group-hover:text-violet-600 transition-colors">Peserta</p>
                    <p className="text-xs font-medium text-gray-500">Validasi pendaftar</p>
                 </div>
               </Link>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
