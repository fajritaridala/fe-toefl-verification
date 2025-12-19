'use client';

import { EnrollmentStatus } from '@/types/admin.types';

interface EnrollmentStatusChipProps {
  status: EnrollmentStatus | string; // Allow string for flexibility or legacy
}

const statusConfig: Record<
  string,
  {
    bgColor: string;
    borderColor: string;
    textColor: string;
    dotColor: string;
    label: string;
  }
> = {
  [EnrollmentStatus.APPROVED]: {
    bgColor: 'bg-transparent',
    borderColor: 'border-green-600',
    textColor: 'text-green-700',
    dotColor: 'bg-green-600',
    label: 'Disetujui',
  },
  [EnrollmentStatus.REJECTED]: {
    bgColor: 'bg-transparent',
    borderColor: 'border-red-600',
    textColor: 'text-red-700',
    dotColor: 'bg-red-600',
    label: 'Ditolak',
  },
  [EnrollmentStatus.PENDING]: {
    bgColor: 'bg-transparent',
    borderColor: 'border-yellow-600',
    textColor: 'text-yellow-700',
    dotColor: 'bg-yellow-600',
    label: 'Menunggu',
  },
  [EnrollmentStatus.COMPLETED]: {
    bgColor: 'bg-transparent',
    borderColor: 'border-green-600',
    textColor: 'text-green-700',
    dotColor: 'bg-green-600',
    label: 'Selesai',
  },
};

export function EnrollmentStatusChip({ status }: EnrollmentStatusChipProps) {
  // Normalize status case just in case
  const normalizedStatus = status as string; // or status.toLowerCase() if needed
  
  const style = statusConfig[normalizedStatus] || {
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-700',
    dotColor: 'bg-gray-400',
    label: status,
  };

  return (
    <div className="text-center">
      <span
        className={`inline-flex items-center gap-2 rounded-full border-[1.5px] px-3 py-1.5 ${style.bgColor} ${style.borderColor} ${style.textColor} text-sm font-medium`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${style.dotColor}`}></span>
        {style.label}
      </span>
    </div>
  );
}
