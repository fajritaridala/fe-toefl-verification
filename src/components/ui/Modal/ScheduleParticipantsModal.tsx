import { useMemo } from 'react';
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  Spinner,
} from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { enrollmentsService } from '@/services/admin.service';
import {
  EnrollmentItem,
  EnrollmentListResponse,
  ScheduleItem,
} from '@/types/admin.types';

type Props = {
  isOpen: boolean;
  schedule: ScheduleItem | null;
  onClose: () => void;
};

const ScheduleParticipantsModal = ({ isOpen, schedule, onClose }: Props) => {
  const scheduleId = schedule?.scheduleId;

  const { data, isLoading } = useQuery({
    queryKey: ['enrollments', 'schedule', scheduleId],
    queryFn: async () => {
      if (!scheduleId) return null;
      const response = await enrollmentsService.getScheduleEnrollments(
        scheduleId,
        { limit: 100 }
      );
      return response.data as EnrollmentListResponse;
    },
    enabled: isOpen && !!scheduleId,
  });

  const participants = useMemo(() => data?.data ?? [], [data]);
  const serviceName = schedule?.serviceName || 'Layanan tidak diketahui';
  const scheduleDate = schedule?.scheduleDate
    ? moment(schedule.scheduleDate).format('DD MMM YYYY')
    : '-';

  const renderStatusChip = (registrant: EnrollmentItem) => {
    const status = registrant.status;
    const color =
      status === 'disetujui'
        ? 'success'
        : status === 'ditolak'
          ? 'danger'
          : 'warning';

    return (
      <Chip size="sm" variant="flat" color={color} className="capitalize">
        {status}
      </Chip>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop="blur"
      size="lg"
      placement="center"
    >
      <ModalContent>
        <ModalHeader className="flex-col items-start gap-1">
          <p className="text-2xsmall text-text-muted tracking-[0.4em] uppercase">
            Jadwal
          </p>
          <h1 className="text-text text-2xl font-bold">Daftar Pendaftar</h1>
          <p className="text-text-muted text-sm">
            {serviceName} — {scheduleDate}
          </p>
        </ModalHeader>
        <ModalBody>
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Spinner label="Memuat peserta..." color="primary" />
            </div>
          ) : participants.length === 0 ? (
            <p className="text-text-muted text-center text-sm">
              Belum ada peserta terdaftar untuk jadwal ini.
            </p>
          ) : (
            <ScrollShadow className="max-h-80 space-y-3">
              {participants.map((registrant) => (
                <div
                  key={registrant.enrollId}
                  className="border-border bg-bg-light rounded-lg border p-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text text-sm font-semibold">
                        {registrant.fullName || 'Peserta tanpa nama'}
                      </p>
                      <p className="text-2xsmall text-text-muted tracking-[0.3em] uppercase">
                        NIM: {registrant.nim || '-'}
                      </p>
                      <p className="text-2xsmall text-text-muted">
                        Status: {registrant.status}
                      </p>
                    </div>
                    {renderStatusChip(registrant)}
                  </div>
                </div>
              ))}
            </ScrollShadow>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} className="font-semibold">
            Tutup
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ScheduleParticipantsModal;
