'use client';

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import {
  Building2,
  Calendar,
  Check,
  CreditCard,
  FileText,
  GraduationCap,
  Mail,
  Phone,
  User,
  X,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { formatDate } from '@/utils/common';
import { EnrollmentItem } from '@/features/admin/types/admin.types';

// Extend EnrollmentItem or create a compatible type that covers all fields from both previous modals
// EnrollmentItem usually has: enrollId, fullName, nim, email, phoneNumber, serviceName, scheduleDate, etc.
// We'll define a robust interface here or use a mapped type. For now, let's allow optional fields to support both contexts.

type ParticipantDetail = {
  enrollId?: string;
  fullName: string;
  nim: string;
  email?: string;
  phoneNumber?: string;
  faculty?: string;
  major?: string;
  serviceName?: string;
  scheduleDate?: string;
  registerAt?: string;
  paymentProof?: string;
  paymentDate?: string;
  paymentAmount?: string;
  status?: string;
};

interface EnrollmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  participant: ParticipantDetail | null;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  isProcessing?: boolean;
}

export default function EnrollmentDetailModal({
  isOpen,
  onClose,
  participant,
  onApprove,
  onReject,
  isProcessing = false,
}: EnrollmentDetailModalProps) {
  if (!participant) return null;

  const showActions = !!onApprove && !!onReject && !!participant.enrollId;

  const handleApprove = () => {
    if (onApprove && participant.enrollId) {
      onApprove(participant.enrollId);
    }
  };

  const handleReject = () => {
    if (onReject && participant.enrollId) {
      onReject(participant.enrollId);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      backdrop="blur"
      scrollBehavior="inside"
      classNames={{
        base: 'bg-white',
        header: 'border-b border-gray-200 px-6 py-4',
        body: 'py-6 px-6',
        footer: 'border-t border-gray-200 px-6 py-4',
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-gray-900">
            {showActions ? 'Validasi Pendaftaran' : 'Detail Peserta'}
          </h2>
          <p className="text-sm font-normal text-gray-500">
            {participant.fullName} • {participant.nim}
          </p>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-6">
            {/* Data Pribadi */}
            <div className="space-y-3">
              <div className="mb-3 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold text-gray-900">
                  Data Pribadi
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 pl-7 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Nama Lengkap
                  </label>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {participant.fullName}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500">
                    NIM
                  </label>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {participant.nim}
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <Mail className="h-3 w-3" /> Email
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {participant.email || '-'}
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <Phone className="h-3 w-3" /> No. Telepon
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {participant.phoneNumber || '-'}
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <Building2 className="h-3 w-3" /> Fakultas
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {participant.faculty || '-'}
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <GraduationCap className="h-3 w-3" /> Program Studi
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {participant.major || '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Data Pendaftaran */}
            <div className="space-y-3 border-t border-gray-100 pt-4">
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold text-gray-900">
                  Data Pendaftaran
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 pl-7 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Layanan
                  </label>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {participant.serviceName || '-'}
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <Calendar className="h-3 w-3" /> Tanggal Jadwal
                  </label>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {formatDate(participant.scheduleDate)}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Tanggal Daftar
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(participant.registerAt)}
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <CreditCard className="h-3 w-3" /> Tanggal Bayar
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(participant.paymentDate)}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Nominal Pembayaran
                  </label>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {participant.paymentAmount || '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bukti Pembayaran */}
            <div className="space-y-3 border-t border-gray-100 pt-4">
              <div className="mb-3 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold text-gray-900">
                  Bukti Pembayaran
                </h3>
              </div>

              <div className="pl-7">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                  {participant.paymentProof ? (
                    <Image
                      src={participant.paymentProof}
                      alt="Bukti Pembayaran"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <p className="text-sm">Tidak ada bukti pembayaran</p>
                    </div>
                  )}
                </div>
                {participant.paymentProof && (
                  <a
                    href={participant.paymentProof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-600"
                  >
                    Buka di tab baru →
                  </a>
                )}
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          {showActions ? (
            <div className="flex w-full items-center justify-end gap-3">
              <Button
                variant="flat"
                color="danger"
                onPress={handleReject}
                isDisabled={isProcessing}
                startContent={<XCircle className="h-4 w-4" />}
                className="font-medium"
              >
                Tolak
              </Button>
              <Button
                color="success"
                className="text-white font-medium"
                onPress={handleApprove}
                isDisabled={isProcessing}
                startContent={<Check className="h-4 w-4" />}
                isLoading={isProcessing}
              >
                Setujui
              </Button>
            </div>
          ) : (
            <Button
              variant="light"
              radius="full"
              onPress={onClose}
              startContent={<X className="h-4 w-4" />}
            >
              Tutup
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
