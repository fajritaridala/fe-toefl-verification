import Head from 'next/head';
import Activity from '@/features/activity/Activity';
import BaseLayout from '@/components/layouts/Base';

export default function ActivityPage() {
  return (
    <BaseLayout title="Aktivitas Saya">
      <Head>
        <title>Aktivitas Saya | UPT Bahasa</title>
        <meta name="description" content="Riwayat aktivitas dan pendaftaran sertifikat TOEFL" />
      </Head>
      <Activity />
    </BaseLayout>
  );
}
