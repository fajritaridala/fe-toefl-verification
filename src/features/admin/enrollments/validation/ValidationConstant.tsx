import { Check, Eye, X } from 'lucide-react';
import { type Variants } from 'framer-motion';
import { formatDate } from '@/utils/common';
import { ColumnConfig } from '@/components/ui/Table/Enrollments/GenericEnrollmentTable';
import { EnrollmentItem } from '@/features/admin/enrollments/enrollment.types';

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
// Kita butuh fungsi ini karena kolom membutuhkan akses ke fungsi handler (approve, reject, dll)
interface GetColumnsProps {
  participants: EnrollmentItem[];
  isProcessing: boolean;
  onOpenPreview: (index: number) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const getValidationColumns = ({
  participants,
  isProcessing,
  onOpenPreview,
  onApprove,
  onReject,
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
    uid: 'paymentProof',
    name: 'Bukti Bayar',
    align: 'center',
    render: (item) => (
      <div className="flex justify-center-safe">
        <button
          onClick={() => {
            // Mencari index peserta saat ini untuk keperluan modal preview
            const index = participants.findIndex(
              (p) => p.enrollId === item.enrollId
            );
            onOpenPreview(index >= 0 ? index : 0);
          }}
          className="border-info text-info hover:shadow-box inline-flex items-center gap-1.5 rounded-full border bg-transparent px-3 py-1.5 text-xs font-medium transition-all"
        >
          <Eye className="h-3.5 w-3.5" />
          Lihat Bukti
        </button>
      </div>
    ),
  },
  {
    uid: 'actions',
    name: 'Actions',
    align: 'center',
    render: (item) => (
      <div className="flex w-full items-center justify-center-safe gap-2">
        <button
          onClick={() => onApprove(item.enrollId)}
          disabled={isProcessing}
          title="Approve"
          className="border-success text-success hover:shadow-box inline-flex items-center gap-1.5 rounded-full border bg-transparent px-3 py-1.5 text-xs font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Check className="h-3.5 w-3.5" />
          Approve
        </button>
        <button
          onClick={() => onReject(item.enrollId)}
          disabled={isProcessing}
          title="Reject"
          className="border-danger text-danger hover:shadow-box inline-flex items-center gap-1.5 rounded-full border bg-transparent px-3 py-1.5 text-xs font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X className="h-3.5 w-3.5" />
          Reject
        </button>
      </div>
    ),
  },
];