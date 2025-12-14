'use client';

import { Card, CardBody, CardFooter, CardHeader, Button, cn } from '@heroui/react';
import { Calendar, CheckCircle, ChevronRight, History, Trophy } from 'lucide-react';
import { useRouter } from 'next/router';
import { useActivity } from './useActivity';
import { EnrollmentStatusChip } from '@/components/ui/Chip/EnrollmentStatusChip';
import { formatDate } from '@/utils/common';
import { ActivityItem } from './activity.service';

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
    <div className="min-h-screen bg-bg-light pt-24 pb-12">
      <main className="container mx-auto px-4 max-w-7xl">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-text tracking-tight">
            Aktivitas Saya
          </h1>
          <p className="mt-2 text-lg text-text-muted">
             Riwayat pendaftaran tes dan status sertifikat Anda.
          </p>
        </div>

        {isLoadingActivity ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="h-[250px] animate-pulse bg-white/50 border border-transparent shadow-none rounded-2xl" />
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((item) => (
              <Card
                key={item.enrollId}
                className={cn(
                  "bg-white rounded-2xl border-none shadow-none",
                  "transition-all duration-300 hover:-translate-y-2 group",
                  "hover:shadow-[8px_8px_16px_rgba(209,217,230,0.4),_-8px_-8px_16px_rgba(255,255,255,0.7)]"
                )}
                isPressable
                onPress={() => handlePress(item.hash)}
              >
                <CardHeader className="flex items-start justify-between px-6 pt-6 pb-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <EnrollmentStatusChip status={item.status} />
                </CardHeader>

                <CardBody className="px-6 py-4">
                  <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors mb-4 line-clamp-1">
                    {item.serviceName}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-text-muted mb-3">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {formatDate(item.scheduleDate)}
                    </span>
                  </div>

                  {item.hash && (
                    <div className="flex items-center gap-2 text-success">
                       <CheckCircle className="h-4 w-4" />
                       <span className="text-xs font-medium">
                         Terverifikasi Blockchain
                       </span>
                    </div>
                  )}
                </CardBody>

                <CardFooter className="px-6 pb-6 pt-0">
                   <div className="w-full flex items-center gap-2 text-sm font-semibold text-text-muted group-hover:text-primary transition-colors">
                      <span>Lihat Detail</span>
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                   </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center shadow-sm">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <History className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-text">
              Belum Ada Aktivitas
            </h3>
            <p className="mt-2 mb-8 max-w-md text-text-muted">
              Anda belum mendaftar layanan apapun.
            </p>
            <Button 
                className="bg-primary text-white font-bold"
                size="lg"
                radius="full"
                endContent={<ChevronRight className="h-4 w-4" />}
            >
                Lihat Layanan
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
