export type ScheduleTableColumnKey =
  | 'schedule_date'
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

export const SCHEDULE_TABLE_COLUMNS: ScheduleTableColumn[] = [
  {
    key: 'schedule_date',
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
