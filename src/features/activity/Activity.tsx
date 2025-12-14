'use client';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  cn,
} from '@heroui/react';
import { type Variants, motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle,
  ChevronRight,
  History,
  Trophy,
} from 'lucide-react';
import { useRouter } from 'next/router';
import { EnrollmentStatusChip } from '@/components/ui/Chip/EnrollmentStatusChip';
import { formatDate } from '@/utils/common';
import { ActivityItem } from './activity.service';
import { useActivity } from './useActivity';

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeInItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
};

export default function Activity() {
  const router = useRouter();
  const { dataActivity, isLoadingActivity } = useActivity();
  const activities = (dataActivity?.data as ActivityItem[]) || [];

  const handlePress = (hash?: string) => {
    if (hash) {
      router.push(`/certificate?hash=${hash}`);
    }
  };

  return (
    <div className="bg-bg-light min-h-screen pt-24 pb-12">
      <main className="container mx-auto max-w-7xl px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-10"
        >
          <h1 className="text-text text-3xl font-extrabold tracking-tight">
            Aktivitas Saya
          </h1>
          <p className="text-text-muted mt-2 text-lg">
            Riwayat pendaftaran tes dan status sertifikat Anda.
          </p>
        </motion.div>

        {isLoadingActivity ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card
                key={i}
                className="h-[250px] animate-pulse rounded-2xl border border-transparent bg-white/50 shadow-none"
              />
            ))}
          </div>
        ) : activities.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {activities.map((item) => (
              <motion.div key={item.enrollId} variants={fadeInItem}>
                <Card
                  className={cn(
                    'w-sm rounded-2xl bg-white shadow-none',
                    'group transition-all duration-300 hover:-translate-y-2',
                    'hover:shadow-neo'
                  )}
                  isPressable
                  onPress={() => handlePress(item.hash)}
                >
                  <CardHeader className="flex items-start justify-between px-6 pt-6 pb-0">
                    <div className="bg-primary/10 text-primary group-hover:bg-primary flex h-12 w-12 items-center justify-center rounded-2xl transition-colors group-hover:text-white">
                      <Trophy className="h-6 w-6" />
                    </div>
                    <EnrollmentStatusChip status={item.status} />
                  </CardHeader>

                  <CardBody className="px-6 py-4">
                    <h3 className="text-text group-hover:text-primary mb-4 line-clamp-1 text-lg font-bold transition-colors">
                      {item.serviceName}
                    </h3>

                    <div className="text-text-muted mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        {formatDate(item.scheduleDate)}
                      </span>
                    </div>

                    {item.hash && (
                      <div className="text-success flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">
                          Terverifikasi Blockchain
                        </span>
                      </div>
                    )}
                  </CardBody>

                  <CardFooter className="px-6 pt-0 pb-6">
                    <div className="text-text-muted group-hover:text-primary flex w-full items-center gap-2 text-sm font-semibold transition-colors">
                      <span>Lihat Detail</span>
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center shadow-sm"
          >
            <div className="bg-primary/10 text-primary mb-6 flex h-20 w-20 items-center justify-center rounded-full">
              <History className="h-10 w-10" />
            </div>
            <h3 className="text-text text-xl font-bold">Belum Ada Aktivitas</h3>
            <p className="text-text-muted mt-2 mb-8 max-w-md">
              Anda belum mendaftar layanan apapun.
            </p>
            <Button
              className="bg-primary font-bold text-white"
              size="lg"
              radius="full"
              endContent={<ChevronRight className="h-4 w-4" />}
            >
              Lihat Layanan
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
