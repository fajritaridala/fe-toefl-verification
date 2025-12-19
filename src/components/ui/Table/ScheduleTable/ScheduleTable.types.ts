import { Key, ReactNode } from 'react';
import { ScheduleItem } from '@/types/admin.types';

// ============ LOCAL TYPE DEFINITIONS ============
export type MonthOption = { label: string; value: string };
export type ServiceOption = { label: string; value: string };
export type ScheduleTableColumn = { key: string; label: string };

// Extended type with __rowKey added by useSchedules
export type ScheduleItemWithRowKey = ScheduleItem & { __rowKey?: string };

export type ScheduleTableProps = {
  columns: ScheduleTableColumn[];
  schedules: ScheduleItemWithRowKey[];
  serviceOptions: ServiceOption[];
  monthOptions: MonthOption[];
  selectedMonth: string;
  selectedService: string;
  isLoading: boolean;
  isRefetching: boolean;
  currentLimit: number;
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
  onChangeLimit: (value: number) => void;
  onSelectMonth: (value: string) => void;
  onSelectService: (value: string) => void;
  onRefresh: () => void;
  onAdd: () => void;
  onEdit: (schedule: ScheduleItem) => void;
  onDelete: (schedule: ScheduleItem) => void;
  onViewParticipants: (schedule: ScheduleItem) => void;
};

export type RenderCellFn = (
  schedule: ScheduleItem,
  columnKey: Key
) => ReactNode;
