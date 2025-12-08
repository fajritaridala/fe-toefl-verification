export type StatusOption = { label: string; value: string };

export type EnrollmentRow = {
  __rowKey: string;
  _id: string;
  participantId?: string;
  fullName: string;
  email?: string;
  nim?: string;
  scheduleId?: string;
  scheduleName?: string;
  scheduleDate?: string;
  status: 'menunggu' | 'disetujui' | 'ditolak';
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
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onScore: (row: EnrollmentRow) => void;
};
