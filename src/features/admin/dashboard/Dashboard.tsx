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
      icon: <Package className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      key: 'schedules',
      label: 'Jadwal Aktif',
      value: summary.totalSchedules,
      icon: <Calendar className="h-5 w-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      key: 'pending',
      label: 'Menunggu Validasi',
      value: summary.pendingEnrollments,
      icon: <Clock3 className="h-5 w-5" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    {
      key: 'participants',
      label: 'Peserta Disetujui',
      value: summary.approvedEnrollments,
      icon: <ListChecks className="h-5 w-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
  ];

  return (
    <section className="space-y-6 pt-4">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.key} className="shadow-box rounded-2xl bg-white">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="mb-1 text-xs font-medium tracking-wide text-gray-500 uppercase">
                    {card.label}
                  </p>
                  {isLoadingSummary ? (
                    <Skeleton className="mt-2 h-8 w-20 rounded" />
                  ) : (
                    <p className="text-3xl font-bold text-gray-900">
                      {card.value}
                    </p>
                  )}
                </div>
                <div
                  className={`${card.bgColor} ${card.color} ${card.borderColor} rounded-2xl border-2 p-3`}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Schedules */}
        <div className="shadow-box rounded-2xl bg-white lg:col-span-2">
          <div className="border-b border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                  Agenda Terdekat
                </p>
                <h3 className="mt-1 text-lg font-semibold text-gray-900">
                  Jadwal TOEFL
                </h3>
              </div>
              <Chip
                size="sm"
                variant="flat"
                startContent={<Calendar className="h-3 w-3" />}
                classNames={{
                  base: 'bg-primary/10 border border-primary/20',
                  content: 'text-primary text-xs font-semibold',
                }}
              >
                {upcomingSchedules.length} Jadwal
              </Chip>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {isLoadingSchedules ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton
                    key={`schedule-skeleton-${index}`}
                    className="h-16 rounded-lg"
                  />
                ))
              ) : upcomingSchedules.length ? (
                upcomingSchedules.map((schedule) => (
                  <div
                    key={schedule._id}
                    className="hover:border-primary/30 hover:bg-primary/5 flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3 transition-all"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {schedule.serviceName}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {moment(schedule.scheduleDate).format('DD MMM YYYY')} ·
                        {` ${moment(schedule.startTime).format('HH:mm')} - ${moment(schedule.endTime).format('HH:mm')}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {schedule.registrants ?? 0}/{schedule.quota ?? '-'}
                        </p>
                        <p className="text-xs text-gray-500">Peserta</p>
                      </div>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={
                          schedule.status === 'aktif' ? 'success' : 'warning'
                        }
                        classNames={{
                          base:
                            schedule.status === 'aktif'
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-yellow-50 border border-yellow-200',
                          content:
                            schedule.status === 'aktif'
                              ? 'text-green-700 text-xs font-semibold'
                              : 'text-yellow-700 text-xs font-semibold',
                        }}
                      >
                        {schedule.status === 'aktif' ? 'Aktif' : 'Tidak aktif'}
                      </Chip>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-base font-medium text-gray-900">
                    Tidak ada jadwal aktif
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Jadwal akan muncul di sini setelah dibuat
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Approval Summary */}
          <div className="shadow-box rounded-2xl bg-white">
            <div className="border-b border-gray-100 px-6 py-4">
              <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                Status Pendaftaran
              </p>
              <h3 className="mt-1 text-lg font-semibold text-gray-900">
                Ringkasan Approval
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                    <span className="text-gray-700">Approval Rate</span>
                    <span className="text-green-600">{approvalRate}%</span>
                  </div>
                  <Progress
                    aria-label="Persentase approval"
                    size="sm"
                    value={approvalRate}
                    classNames={{
                      indicator: 'bg-green-500',
                      track: 'bg-gray-100',
                    }}
                  />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                    <span className="text-gray-700">Reject Rate</span>
                    <span className="text-red-600">{rejectionRate}%</span>
                  </div>
                  <Progress
                    aria-label="Persentase penolakan"
                    size="sm"
                    value={rejectionRate}
                    classNames={{
                      indicator: 'bg-red-500',
                      track: 'bg-gray-100',
                    }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-3 text-center">
                    <p className="mb-1 text-xs font-medium text-yellow-600">
                      Pending
                    </p>
                    <p className="text-xl font-bold text-yellow-700">
                      {summary.pendingEnrollments}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-green-200 bg-green-50 p-3 text-center">
                    <p className="mb-1 text-xs font-medium text-green-600">
                      Approved
                    </p>
                    <p className="text-xl font-bold text-green-700">
                      {summary.approvedEnrollments}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-center">
                    <p className="mb-1 text-xs font-medium text-red-600">
                      Rejected
                    </p>
                    <p className="text-xl font-bold text-red-700">
                      {summary.rejectedEnrollments}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access */}
          <div className="shadow-box rounded-2xl bg-white">
            <div className="border-b border-gray-100 px-6 py-4">
              <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                Akses Cepat
              </p>
              <h3 className="mt-1 text-lg font-semibold text-gray-900">
                Navigasi Modul
              </h3>
            </div>
            <div className="p-6">
              <div className="flex flex-col gap-2">
                <Button
                  as={Link}
                  href="/admin/services"
                  variant="flat"
                  radius="full"
                  className="justify-start gap-3 border border-blue-200 bg-blue-50 font-semibold text-blue-700 hover:bg-blue-100"
                >
                  <Package className="h-4 w-4" />
                  Manajemen Layanan
                </Button>
                <Button
                  as={Link}
                  href="/admin/schedules"
                  variant="flat"
                  radius="full"
                  className="justify-start gap-3 border border-green-200 bg-green-50 font-semibold text-green-700 hover:bg-green-100"
                >
                  <Calendar className="h-4 w-4" />
                  Manajemen Jadwal
                </Button>
                <Button
                  as={Link}
                  href="/admin/participants"
                  variant="flat"
                  radius="full"
                  className="justify-start gap-3 border border-purple-200 bg-purple-50 font-semibold text-purple-700 hover:bg-purple-100"
                >
                  <Users className="h-4 w-4" />
                  Manajemen Peserta
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Participants */}
      <div className="shadow-box rounded-xl bg-white">
        <div className="border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                Aktivitas Peserta
              </p>
              <h3 className="mt-1 text-lg font-semibold text-gray-900">
                Pendaftar Terbaru
              </h3>
            </div>
            <Chip
              size="sm"
              startContent={<Users className="h-3 w-3" />}
              classNames={{
                base: 'bg-primary/10 border border-primary/20',
                content: 'text-primary text-xs font-semibold',
              }}
            >
              {summary.totalParticipants}
            </Chip>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {isLoadingParticipants ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={`participant-skeleton-${index}`}
                  className="h-14 rounded-lg"
                />
              ))
            ) : recentParticipants.length ? (
              recentParticipants.map((participant) => (
                <div
                  key={participant.enrollId}
                  className="hover:border-primary/30 hover:bg-primary/5 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/50 px-4 py-3 transition-all"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {participant.fullName}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      NIM {participant.nim}
                    </p>
                  </div>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={statusColorMap[participant.status]}
                    classNames={{
                      base:
                        participant.status === 'disetujui'
                          ? 'bg-green-50 border border-green-200'
                          : participant.status === 'ditolak'
                            ? 'bg-red-50 border border-red-200'
                            : 'bg-yellow-50 border border-yellow-200',
                      content:
                        participant.status === 'disetujui'
                          ? 'text-green-700 text-xs font-semibold capitalize'
                          : participant.status === 'ditolak'
                            ? 'text-red-700 text-xs font-semibold capitalize'
                            : 'text-yellow-700 text-xs font-semibold capitalize',
                    }}
                  >
                    {participant.status}
                  </Chip>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-base font-medium text-gray-900">
                  Tidak ada data pendaftaran
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Pendaftar baru akan muncul di sini
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
