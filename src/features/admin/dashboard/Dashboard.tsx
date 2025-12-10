import {
  ArrowRight,
  Calendar,
  Clock3,
  Package,
  ListChecks,
  Plus,
  Users,
} from 'lucide-react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Progress,
  Skeleton,
} from '@heroui/react';
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
      {/* Hero Card */}
      <div className="bg-white rounded-xl drop-shadow overflow-hidden">
        <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
          <div className="hidden lg:block pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-primary/10 skew-x-6" />
          <div className="relative px-6 py-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <p className="text-xs font-semibold text-primary tracking-wider uppercase mb-2">
                  Dashboard Admin
                </p>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Selamat datang kembali di panel Simpeka
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Kelola layanan, jadwal, dan pendaftar secara menyeluruh melalui
                  ringkasan interaktif ini.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Chip 
                    variant="flat" 
                    color="primary"
                    classNames={{
                      base: 'bg-primary/10 border border-primary/20',
                      content: 'text-primary font-semibold'
                    }}
                  >
                    {summary.totalParticipants} total peserta
                  </Chip>
                  <Chip 
                    variant="flat" 
                    color="success"
                    classNames={{
                      base: 'bg-green-50 border border-green-200',
                      content: 'text-green-700 font-semibold'
                    }}
                  >
                    {approvalRate}% approval rate
                  </Chip>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  as={Link}
                  href="/admin/schedules"
                  color="primary"
                  className="font-semibold shadow-small"
                  startContent={<Plus className="h-4 w-4" />}
                >
                  Tambah jadwal
                </Button>
                <Button
                  as={Link}
                  href="/admin/participants"
                  variant="bordered"
                  className="border-primary text-primary font-semibold hover:bg-primary/5"
                  endContent={<ArrowRight className="h-4 w-4" />}
                >
                  Kelola peserta
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.key} className="bg-white rounded-xl drop-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
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
                <div className={`${card.bgColor} ${card.color} ${card.borderColor} border-2 rounded-lg p-3`}>
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
        <div className="bg-white rounded-xl drop-shadow lg:col-span-2">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Agenda Terdekat
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mt-1">Jadwal TOEFL</h3>
              </div>
              <Chip
                size="sm"
                variant="flat"
                startContent={<Calendar className="h-3 w-3" />}
                classNames={{
                  base: 'bg-primary/10 border border-primary/20',
                  content: 'text-primary text-xs font-semibold'
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
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/50 px-4 py-3 hover:border-primary/30 hover:bg-primary/5 transition-all"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {schedule.serviceName}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
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
                          base: schedule.status === 'aktif' ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200',
                          content: schedule.status === 'aktif' ? 'text-green-700 text-xs font-semibold' : 'text-yellow-700 text-xs font-semibold'
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
          <div className="bg-white rounded-xl drop-shadow">
            <div className="px-6 py-4 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Status Pendaftaran
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mt-1">Ringkasan Approval</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm font-semibold mb-2">
                    <span className="text-gray-700">Approval Rate</span>
                    <span className="text-green-600">{approvalRate}%</span>
                  </div>
                  <Progress
                    aria-label="Persentase approval"
                    size="sm"
                    value={approvalRate}
                    classNames={{
                      indicator: 'bg-green-500',
                      track: 'bg-gray-100'
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm font-semibold mb-2">
                    <span className="text-gray-700">Reject Rate</span>
                    <span className="text-red-600">{rejectionRate}%</span>
                  </div>
                  <Progress
                    aria-label="Persentase penolakan"
                    size="sm"
                    value={rejectionRate}
                    classNames={{ 
                      indicator: 'bg-red-500',
                      track: 'bg-gray-100'
                    }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-yellow-600 font-medium mb-1">Pending</p>
                    <p className="text-xl font-bold text-yellow-700">
                      {summary.pendingEnrollments}
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-green-600 font-medium mb-1">Approved</p>
                    <p className="text-xl font-bold text-green-700">
                      {summary.approvedEnrollments}
                    </p>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-red-600 font-medium mb-1">Rejected</p>
                    <p className="text-xl font-bold text-red-700">
                      {summary.rejectedEnrollments}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access */}
          <div className="bg-white rounded-xl drop-shadow">
            <div className="px-6 py-4 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Akses Cepat
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mt-1">Navigasi Modul</h3>
            </div>
            <div className="p-6">
              <div className="flex flex-col gap-2">
                <Button
                  as={Link}
                  href="/admin/services"
                  variant="flat"
                  className="justify-start gap-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-semibold"
                >
                  <Package className="h-4 w-4" />
                  Manajemen Layanan
                </Button>
                <Button
                  as={Link}
                  href="/admin/schedules"
                  variant="flat"
                  className="justify-start gap-3 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 font-semibold"
                >
                  <Calendar className="h-4 w-4" />
                  Manajemen Jadwal
                </Button>
                <Button
                  as={Link}
                  href="/admin/participants"
                  variant="flat"
                  className="justify-start gap-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-semibold"
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
      <div className="bg-white rounded-xl drop-shadow">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Aktivitas Peserta
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mt-1">Pendaftar Terbaru</h3>
            </div>
            <Chip 
              size="sm" 
              startContent={<Users className="h-3 w-3" />}
              classNames={{
                base: 'bg-primary/10 border border-primary/20',
                content: 'text-primary text-xs font-semibold'
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
                  key={participant._id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/50 px-4 py-3 hover:border-primary/30 hover:bg-primary/5 transition-all"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {participant.fullName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      NIM {participant.nim}
                    </p>
                  </div>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={statusColorMap[participant.status]}
                    classNames={{
                      base: participant.status === 'disetujui' 
                        ? 'bg-green-50 border border-green-200'
                        : participant.status === 'ditolak'
                        ? 'bg-red-50 border border-red-200'
                        : 'bg-yellow-50 border border-yellow-200',
                      content: participant.status === 'disetujui'
                        ? 'text-green-700 text-xs font-semibold capitalize'
                        : participant.status === 'ditolak'
                        ? 'text-red-700 text-xs font-semibold capitalize'
                        : 'text-yellow-700 text-xs font-semibold capitalize'
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
