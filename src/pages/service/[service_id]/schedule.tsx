import BaseLayout from "@/components/layouts/Base";
import { Schedule } from "@features/service";

export const dynamic = 'force-dynamic';

export default function SchedulePage() {
  return (
    <>
      <BaseLayout title="Jadwal">
        <Schedule />
      </BaseLayout>
    </>
  );
}
