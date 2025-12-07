export type ScheduleTableColumnKey =
  | 'scheduleDate'
  | 'service'
  | 'quota'
  | 'status'
  | 'actions';

export type ScheduleTableColumn = {
  key: ScheduleTableColumnKey;
  label: string;
  className?: string;
};

export type ServiceOption = {
  label: string;
  value: string;
};

export const ALL_SERVICE_OPTION_VALUE = '__all__';
export const ALL_MONTH_OPTION_VALUE = '__all_month__';

export type MonthOption = {
  label: string;
  value: string;
};

export const MONTH_FILTER_OPTIONS: MonthOption[] = [
  { label: 'Bulan', value: ALL_MONTH_OPTION_VALUE },
  { label: 'Januari', value: '01' },
  { label: 'Februari', value: '02' },
  { label: 'Maret', value: '03' },
  { label: 'April', value: '04' },
  { label: 'Mei', value: '05' },
  { label: 'Juni', value: '06' },
  { label: 'Juli', value: '07' },
  { label: 'Agustus', value: '08' },
  { label: 'September', value: '09' },
  { label: 'Oktober', value: '10' },
  { label: 'November', value: '11' },
  { label: 'Desember', value: '12' },
];

export const SCHEDULE_TABLE_COLUMNS: ScheduleTableColumn[] = [
  {
    key: 'scheduleDate',
    label: 'Tanggal',
    className: 'w-36',
  },
  {
    key: 'service',
    label: 'Layanan',
    className: 'w-44 text-center',
  },
  { key: 'quota', label: 'Kuota', className: 'w-48 text-center' },
  {
    key: 'status',
    label: 'Status',
    className: 'w-36 text-center',
  },
  {
    key: 'actions',
    label: 'Aksi',
    className: 'w-20 text-center',
  },
];
