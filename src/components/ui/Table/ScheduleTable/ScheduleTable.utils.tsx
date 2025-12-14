import { Key, ReactNode } from 'react';
import { ScheduleItem } from '@features/admin';
import { ALL_SERVICE_OPTION_VALUE } from '@features/admin/schedules/Schedules.constants';
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Progress,
} from '@heroui/react';
import { Calendar, PenLine, Trash2, Users, EllipsisVertical } from 'lucide-react';
import moment from 'moment';
import type { Selection } from '@heroui/react';

export const formatDateTimeRange = (
  date?: string | Date,
  start?: string,
  end?: string
) => {
  const dayLabel = date ? moment(date).format('DD MMM YYYY') : '-';
  const timeLabel =
    start && end
      ? `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`
      : '';
  return { dayLabel, timeLabel };
};

type RenderCellParams = {
  onEdit: (schedule: ScheduleItem) => void;
  onDelete: (schedule: ScheduleItem) => void;
  onViewParticipants: (schedule: ScheduleItem) => void;
};

export function createRenderCell(params: RenderCellParams) {
  const { onEdit, onDelete, onViewParticipants } = params;

  const renderCell = (schedule: ScheduleItem, columnKey: Key): ReactNode => {
    const registrants =
      typeof schedule.registrants === 'number' ? schedule.registrants : 0;
    const quota =
      typeof schedule.quota === 'number' ? Number(schedule.quota) : undefined;
    const isFull = quota ? registrants >= quota : false;
    const statusLabel =
      schedule.status === 'aktif'
        ? isFull
          ? 'Penuh'
          : 'Aktif'
        : 'Tidak aktif';
    const serviceName = schedule.serviceName || 'Tidak diketahui';

    switch (columnKey) {
      case 'scheduleDate': {
        const { dayLabel, timeLabel } = formatDateTimeRange(
          schedule.scheduleDate,
          schedule.startTime,
          schedule.endTime
        );
        return (
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-gray-900">{dayLabel}</p>
            {timeLabel && <p className="text-xs text-gray-500">{timeLabel}</p>}
          </div>
        );
      }
      case 'service':
        return (
          <div className="flex justify-center">
            <Chip
              size="sm"
              variant="flat"
              color="primary"
              startContent={<Calendar className="h-3 w-3" />}
              className="gap-1 px-2"
              classNames={{
                base: 'bg-primary-50/50 hover:bg-primary-100/50 transition-colors cursor-default border-none',
                content: 'text-xs font-semibold text-primary-600',
              }}
            >
              {serviceName}
            </Chip>
          </div>
        );
      case 'quota': {
        const ratioLabel = quota ? `${registrants}/${quota}` : `${registrants}`;
        const progressValue = quota
          ? Math.min((registrants / quota) * 100, 100)
          : registrants > 0
            ? 100
            : 0;

        return (
          <div className="mx-auto flex w-32 items-center gap-3">
            <Progress
              aria-label="Disponibilitas kuota"
              size="sm"
              value={progressValue}
              classNames={{
                base: 'flex-1',
                track: 'h-1.5 rounded-full bg-gray-100',
                indicator: `rounded-full ${isFull ? 'bg-danger-400' : 'bg-primary-400'}`,
              }}
            />
            <span className="text-xs font-medium text-gray-500">
              {ratioLabel}
            </span>
          </div>
        );
      }
      case 'status':
        return (
          <div className="flex justify-center">
            <Chip
              size="sm"
              variant="flat"
               color={
                schedule.status === 'tidak aktif'
                  ? 'default' // Changed warning to default for "inactive" (usually gray/neutral is better for inactive)
                  : isFull
                    ? 'danger'
                    : 'success'
              }
              className="px-2"
              classNames={{
                content: 'text-xs font-semibold capitalize',
                base: 'border-none', // Ensure no border
              }}
            >
              {statusLabel}
            </Chip>
          </div>
        );
      case 'actions':
        return (
          <div className="flex justify-center">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <EllipsisVertical size={18} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Aksi jadwal">
                <DropdownItem
                  key="view-participants"
                  startContent={<Users size={16} />}
                  onPress={() => onViewParticipants(schedule)}
                >
                  Daftar Pendaftar
                </DropdownItem>
                <DropdownItem
                  key="edit-schedule"
                  startContent={<PenLine size={16} />}
                  onPress={() => onEdit(schedule)}
                >
                  Ubah
                </DropdownItem>
                <DropdownItem
                  key="delete-schedule"
                  className="text-danger"
                  startContent={<Trash2 size={16} />}
                  onPress={() => onDelete(schedule)}
                >
                  Hapus
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return null;
    }
  };

  return renderCell;
}

export const handleSelectionChange = (
  keys: Selection,
  allValue: string,
  callback: (value: string) => void
) => {
  if (keys === 'all') {
    callback(allValue === ALL_SERVICE_OPTION_VALUE ? '' : allValue);
    return;
  }
  const firstKey =
    keys.size > 0 ? Array.from(keys)[0]?.toString() : undefined;
  const nextValue = firstKey ?? allValue;
  callback(nextValue === allValue ? '' : nextValue);
};
