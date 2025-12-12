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
  CreditCard,
  FileText,
  GraduationCap,
  Mail,
  Phone,
  User,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

type ParticipantData = {
  fullName: string;
  nim: string;
  email?: string;
  phoneNumber?: string;
  faculty?: string;
  major?: string;
  scheduleId?: string;
  scheduleName?: string;
  scheduleDate?: string;
  registerAt?: string;
  paymentProof?: string;
  paymentDate?: string;
  paymentAmount?: string;
};

type ParticipantDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  participant: ParticipantData | null;
};

export default function ParticipantDetailModal({
  isOpen,
  onClose,
  participant,
}: ParticipantDetailModalProps) {
  if (!participant) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      backdrop="blur"
      scrollBehavior="inside"
      classNames={{
        base: 'bg-white',
        header: 'border-b border-gray-200',
        body: 'py-6',
        footer: 'border-t border-gray-200',
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Detail Peserta
            </h2>
            <p className="mt-1 text-sm text-gray-500">{participant.fullName}</p>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-6">
            {/* Data Pribadi */}
            <div className="space-y-3">
              <div className="mb-3 flex items-center gap-2">
                <User className="text-primary h-5 w-5" />
                <h3 className="text-base font-semibold text-gray-900">
                  Data Pribadi
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 pl-7">
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
                <FileText className="text-primary h-5 w-5" />
                <h3 className="text-base font-semibold text-gray-900">
                  Data Pendaftaran
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 pl-7">
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
            {participant.paymentProof && (
              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="mb-3 flex items-center gap-2">
                  <CreditCard className="text-primary h-5 w-5" />
                  <h3 className="text-base font-semibold text-gray-900">
                    Bukti Pembayaran
                  </h3>
                </div>

                <div className="pl-7">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                    <Image
                      src={participant.paymentProof}
                      alt="Bukti Pembayaran"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                  </div>
                  <a
                    href={participant.paymentProof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-600 mt-3 inline-flex items-center gap-2 text-sm font-medium"
                  >
                    Buka di tab baru →
                  </a>
                </div>
              </div>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="light"
            radius="full"
            onPress={onClose}
            startContent={<X className="h-4 w-4" />}
          >
            Tutup
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
