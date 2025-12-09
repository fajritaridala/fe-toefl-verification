export type StatusOption = { label: string; value: string };

export type EnrollmentRow = {
  __rowKey: string;
  _id: string;
  scheduleId: string;
  participantId?: string;
  fullName: string;
  nim: string;
  status: 'menunggu' | 'disetujui' | 'ditolak' | 'selesai';
  paymentProof?: string;
  email?: string;
  phoneNumber?: string;
  faculty?: string;
  major?: string;
  registerAt?: string;
  // Optional fields that might be populated by backend
  serviceName?: string;
  scheduleName?: string;
  scheduleDate?: string;
  paymentDate?: string;
  gender?: 'laki-laki' | 'perempuan';
  // Score fields (when status is "selesai")
  listening?: number;
  structure?: number;
  reading?: number;
  totalScore?: number;
};

export type AdminEnrollmentsTableProps = {
  columns: Array<{ key: string; name: string }>;
  items: EnrollmentRow[];
  isLoading: boolean;
  isRefetching: boolean;
  currentSearch: string;
  statusFilter: string;
  statusOptions: StatusOption[];
  showStatusFilter: boolean;
  currentLimitValue: string;
  currentPageNumber: number;
  totalPages: number;
  totalItems: number;
  onSearch: (value: string) => void;
  onClearSearch: () => void;
  onChangeStatus: (value: string) => void;
  onChangeLimit: (value: string) => void;
  onChangePage: (page: number) => void;
};
