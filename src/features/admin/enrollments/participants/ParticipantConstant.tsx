import { Button } from '@heroui/react';
import { Eye } from 'lucide-react';
import { type Variants } from 'framer-motion';

// Utils & Components
import { formatDate } from '@/utils/common';
import { EnrollmentStatusChip } from '@/components/ui/Chip/EnrollmentStatusChip';
import { ColumnConfig } from '@/components/ui/Table/Enrollments/GenericEnrollmentTable';
import { EnrollmentItem } from '../enrollment.types';

// --- Animations ---
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

// --- Column Generator ---
// Kita menggunakan fungsi karena kolom 'actions' membutuhkan fungsi handler (onOpenDetail)
interface GetColumnsProps {
  onOpenDetail: (item: EnrollmentItem) => void;
}

export const getParticipantColumns = ({
  onOpenDetail,
}: GetColumnsProps): ColumnConfig[] => [
  { uid: 'fullName', name: 'Nama Lengkap', align: 'start' },
  { uid: 'nim', name: 'NIM', align: 'center' },
  { uid: 'serviceName', name: 'Layanan', align: 'center' },
  {
    uid: 'scheduleDate',
    name: 'Jadwal',
    align: 'center',
    render: (item) => (
      <p className="text-center text-sm text-gray-700">
        {formatDate(item.scheduleDate)}
      </p>
    ),
  },
  {
    uid: 'status',
    name: 'Status',
    align: 'center',
    render: (item) => <EnrollmentStatusChip status={item.status} />,
  },
  {
    uid: 'actions',
    name: 'Aksi',
    align: 'center',
    render: (item) => (
      <div className="text-center">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          radius="full"
          aria-label="Lihat detail"
          className="hover:text-primary text-gray-600"
          onPress={() => onOpenDetail(item as EnrollmentItem)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];