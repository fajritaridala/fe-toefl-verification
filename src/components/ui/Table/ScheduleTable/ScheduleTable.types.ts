import { Key, ReactNode } from 'react';
import { ScheduleItem } from '@features/admin';
import {
  MonthOption,
  ScheduleTableColumn,
  ServiceOption,
} from '@features/admin/schedules/Schedules.constants';

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

export type RenderCellFn = (schedule: ScheduleItem, columnKey: Key) => ReactNode;
