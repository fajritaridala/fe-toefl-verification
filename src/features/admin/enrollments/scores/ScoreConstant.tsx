import { PenSquare } from 'lucide-react';
import { EnrollmentStatusChip } from '@/components/ui/Chip/EnrollmentStatusChip';
import { ColumnConfig } from '@/components/ui/Table/Enrollments/GenericEnrollmentTable';
import { EnrollmentItem } from '@/features/admin/enrollments/enrollment.types';
import { formatDate } from '@/utils/common';

export const getScoreColumns = (
  handleOpenScoreModal: (item: EnrollmentItem) => void
): ColumnConfig[] => [
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
    name: 'Actions',
    align: 'center',
    render: (item: EnrollmentItem) => (
      <div className="text-center">
        <button
          onClick={() => handleOpenScoreModal(item)}
          className="hover:shadow-box inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-all hover:bg-blue-100"
        >
          <PenSquare className="h-3.5 w-3.5" />
          Input Nilai
        </button>
      </div>
    ),
  },
];
