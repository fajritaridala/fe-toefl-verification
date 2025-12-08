"use client";

import Link from 'next/link';
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
import {
  LuArrowRight,
  LuCalendar,
  LuClock3,
  LuDock,
  LuListChecks,
  LuPlus,
  LuUsers,
} from 'react-icons/lu';
import useDashboard from './useDashboard';

const statusColorMap: Record<string, 'warning' | 'success' | 'danger'> = {
  menunggu: 'warning',
  disetujui: 'success',
  ditolak: 'danger',
};

function AdminDashboardPage() {
  const {
    summary,
    upcomingSchedules,
    recentParticipants,
    isLoadingSummary,
    isLoadingSchedules,
    isLoadingParticipants,
  } = useDashboard();

  const totalEnrolled =
    summary.pendingEnrollments + summary.approvedEnrollments + summary.rejectedEnrollments;
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
      icon: <LuDock className="text-primary text-xl" />,
      accent: 'from-primary/10 via-primary/5 to-transparent',
    },
    {
      key: 'schedules',
      label: 'Jadwal Aktif',
      value: summary.totalSchedules,
      icon: <LuCalendar className="text-success text-xl" />,
      accent: 'from-success/10 via-success/5 to-transparent',
    },
    {
      key: 'pending',
      label: 'Menunggu Validasi',
      value: summary.pendingEnrollments,
      icon: <LuClock3 className="text-warning text-xl" />,
      accent: 'from-warning/10 via-warning/5 to-transparent',
    },
    {
      key: 'participants',
      label: 'Peserta Disetujui',
      value: summary.approvedEnrollments,
      icon: <LuListChecks className="text-success text-xl" />,
      accent: 'from-success/10 via-success/5 to-transparent',
    },
  ];

  return (
    <section className="space-y-6 pt-4">
      <Card className="relative overflow-hidden border-none bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 skew-x-6 bg-primary/20 lg:block" />
        <CardBody className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-2xsmall uppercase tracking-[0.2em] text-primary">
              Dashboard Admin
            </p>
            <h2 className="text-3xl font-bold text-text">
              Selamat datang kembali di panel Simpeka
            </h2>
            <p className="text-small text-text-muted">
              Kelola layanan, jadwal, dan pendaftar secara menyeluruh melalui ringkasan interaktif ini.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Chip variant="flat" color="primary">
                {summary.totalParticipants} total peserta
              </Chip>
              <Chip variant="flat" color="success">
                {approvalRate}% approval rate
              </Chip>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              as={Link}
              href="/admin/schedules"
              color="primary"
              className="font-semibold"
              startContent={<LuPlus />}
            >
              Tambah jadwal
            </Button>
            <Button
              as={Link}
              href="/admin/participants"
              variant="bordered"
              className="border-primary text-primary font-semibold"
              endContent={<LuArrowRight />}
            >
              Kelola peserta
            </Button>
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <Card
            key={card.key}
            className="border border-border/60 shadow-sm"
          >
            <CardBody className="flex items-center justify-between gap-3">
              <div>
                <p className="text-2xsmall text-text-muted">{card.label}</p>
                {isLoadingSummary ? (
                  <Skeleton className="mt-2 h-6 w-20 rounded" />
                ) : (
                  <p className="text-3xl font-extrabold text-text">
                    {card.value}
                  </p>
                )}
              </div>
              <div className="relative">
                <div
                  className={`absolute -inset-2 rounded-full bg-gradient-to-br ${card.accent} blur-xl opacity-60`}
                />
                <div className="relative rounded-full bg-bg-light p-3 shadow-inner">
                  {card.icon}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border border-border/60 shadow-sm lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <div>
              <p className="text-2xsmall text-text-muted">Agenda Terdekat</p>
              <h3 className="text-lg font-semibold">Jadwal TOEFL</h3>
            </div>
            <Chip
              size="sm"
              variant="flat"
              color="primary"
              startContent={<LuCalendar />}
            >
              {upcomingSchedules.length} Jadwal
            </Chip>
          </CardHeader>
          <CardBody className="space-y-4">
            {isLoadingSchedules ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={`schedule-skeleton-${index}`} className="h-16 rounded-lg" />
              ))
            ) : upcomingSchedules.length ? (
              upcomingSchedules.map((schedule) => (
                <div
                  key={schedule._id}
                  className="border-border/70 flex items-center justify-between rounded-lg border px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-text">
                      {schedule.serviceName}
                    </p>
                    <p className="text-2xsmall text-text-muted">
                      {moment(schedule.scheduleDate).format('DD MMM YYYY')} ·
                      {` ${moment(schedule.startTime).format('HH:mm')} - ${moment(schedule.endTime).format('HH:mm')}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-small font-semibold text-text">
                      {schedule.registrants ?? 0}/{schedule.quota ?? '-'} Peserta
                    </p>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={schedule.status === 'aktif' ? 'success' : 'warning'}
                    >
                      {schedule.status === 'aktif' ? 'Aktif' : 'Tidak aktif'}
                    </Chip>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-text-muted">
                Belum ada jadwal aktif.
              </p>
            )}
          </CardBody>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader>
              <div>
                <p className="text-2xsmall text-text-muted">Status Pendaftaran</p>
                <h3 className="text-lg font-semibold">Ringkasan Approval</h3>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-small font-semibold">
                  <span>Approval Rate</span>
                  <span>{approvalRate}%</span>
                </div>
                <Progress
                  aria-label="Persentase approval"
                  size="sm"
                  value={approvalRate}
                  classNames={{
                    indicator: 'bg-success',
                  }}
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-small font-semibold">
                  <span>Reject Rate</span>
                  <span>{rejectionRate}%</span>
                </div>
                <Progress
                  aria-label="Persentase penolakan"
                  size="sm"
                  value={rejectionRate}
                  classNames={{ indicator: 'bg-danger' }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg border border-border/60 bg-bg-light p-3">
                  <p className="text-2xsmall text-text-muted">Pending</p>
                  <p className="text-xl font-bold">{summary.pendingEnrollments}</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-bg-light p-3">
                  <p className="text-2xsmall text-text-muted">Approved</p>
                  <p className="text-xl font-bold">{summary.approvedEnrollments}</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-bg-light p-3">
                  <p className="text-2xsmall text-text-muted">Rejected</p>
                  <p className="text-xl font-bold">{summary.rejectedEnrollments}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="border border-border/60 shadow-sm">
            <CardHeader>
              <div>
                <p className="text-2xsmall text-text-muted">Akses Cepat</p>
                <h3 className="text-lg font-semibold">Navigasi Modul</h3>
              </div>
            </CardHeader>
            <CardBody className="flex flex-col gap-3">
              <Button as={Link} href="/admin/services" variant="flat" className="justify-start gap-3">
                <LuDock className="text-primary" />
                Manajemen Layanan
              </Button>
              <Button as={Link} href="/admin/schedules" variant="flat" className="justify-start gap-3">
                <LuCalendar className="text-success" />
                Manajemen Jadwal
              </Button>
              <Button as={Link} href="/admin/participants" variant="flat" className="justify-start gap-3">
                <LuUsers className="text-warning" />
                Manajemen Peserta
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>

      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="flex items-center justify-between">
          <div>
            <p className="text-2xsmall text-text-muted">Aktivitas Peserta</p>
            <h3 className="text-lg font-semibold">Pendaftar Terbaru</h3>
          </div>
          <Chip size="sm" startContent={<LuUsers />}>
            {summary.totalParticipants}
          </Chip>
        </CardHeader>
        <CardBody className="space-y-4">
          {isLoadingParticipants ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={`participant-skeleton-${index}`} className="h-14 rounded-lg" />
            ))
          ) : recentParticipants.length ? (
            recentParticipants.map((participant) => (
              <div
                key={participant._id}
                className="border-border/70 flex items-center justify-between rounded-lg border px-3 py-2"
              >
                <div>
                  <p className="text-sm font-semibold text-text">
                    {participant.fullName}
                  </p>
                  <p className="text-2xsmall text-text-muted">
                    NIM {participant.nim}
                  </p>
                </div>
                <Chip
                  size="sm"
                  variant="flat"
                  color={statusColorMap[participant.status]}
                >
                  {participant.status}
                </Chip>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-text-muted">
              Belum ada data pendaftaran.
            </p>
          )}
        </CardBody>
      </Card>
    </section>
  );
}

export default AdminDashboardPage;
