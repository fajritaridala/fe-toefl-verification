import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import moment from 'moment';
import { enrollmentsService } from '@features/admin/admin.service';
import {
  EnrollmentItem,
  EnrollmentListResponse,
  ScheduleItem,
} from '@features/admin/admin.types';

type Props = {
  isOpen: boolean;
  schedule: ScheduleItem | null;
  onClose: () => void;
};

const ScheduleParticipantsModal = ({ isOpen, schedule, onClose }: Props) => {
  const scheduleId = schedule?._id;

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
          <p className="text-2xsmall uppercase tracking-[0.4em] text-text-muted">
            Jadwal
          </p>
          <h1 className="text-2xl font-bold text-text">Daftar Peserta</h1>
          <p className="text-sm text-text-muted">
            {serviceName} — {scheduleDate}
          </p>
        </ModalHeader>
        <ModalBody>
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Spinner label="Memuat peserta..." color="primary" />
            </div>
          ) : participants.length === 0 ? (
            <p className="text-center text-sm text-text-muted">
              Belum ada peserta terdaftar untuk jadwal ini.
            </p>
          ) : (
            <ScrollShadow className="max-h-80 space-y-3">
              {participants.map((registrant) => (
                <div
                  key={registrant._id}
                  className="rounded-lg border border-border bg-bg-light p-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-text">
                        {registrant.fullName || 'Peserta tanpa nama'}
                      </p>
                      <p className="text-2xsmall uppercase tracking-[0.3em] text-text-muted">
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
