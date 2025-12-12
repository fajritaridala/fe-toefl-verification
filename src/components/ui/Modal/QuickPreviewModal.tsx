'use client';

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { Check, X, XCircle } from 'lucide-react';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

type ParticipantData = {
  enrollId: string;
  fullName: string;
  nim: string;
  email?: string;
  phoneNumber?: string;
  serviceName?: string;
  scheduleDate?: string;
  paymentProof?: string;
  paymentDate?: string;
  registerAt?: string;
};

interface QuickPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  participant: ParticipantData | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isProcessing: boolean;
}

export default function QuickPreviewModal({
  isOpen,
  onClose,
  participant,
  onApprove,
  onReject,
  isProcessing,
}: QuickPreviewModalProps) {
  if (!participant) return null;

  const handleApprove = () => {
    if (participant?.enrollId) {
      onApprove(participant.enrollId);
    }
  };

  const handleReject = () => {
    if (participant?.enrollId) {
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
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Data pendaftaran
            </h3>
          </div>
        </ModalHeader>

        <ModalBody className="px-6">
          <div className="space-y-2">
            {/* Participant Info */}
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
              <div>
                <p className="mb-1 text-xs text-gray-500">Nama Lengkap</p>
                <p className="text-sm font-semibold text-gray-900">
                  {participant?.fullName || '-'}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-gray-500">NIM</p>
                <p className="text-sm font-semibold text-gray-900">
                  {participant?.nim || '-'}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">
                  {participant?.email || '-'}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-gray-500">No. Telepon</p>
                <p className="text-sm font-medium text-gray-900">
                  {participant?.phoneNumber || '-'}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-gray-500">Layanan</p>
                <p className="text-sm font-medium text-gray-900">
                  {participant?.serviceName || '-'}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-gray-500">Tanggal Jadwal</p>
                <p className="text-sm font-medium text-gray-900">
                  {participant?.scheduleDate
                    ? formatDate(participant.scheduleDate)
                    : '-'}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-gray-500">Tanggal Pembayaran</p>
                <p className="text-sm font-medium text-gray-900">
                  {participant?.paymentDate
                    ? formatDate(participant.paymentDate)
                    : '-'}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-gray-500">Tanggal Daftar</p>
                <p className="text-sm font-medium text-gray-900">
                  {participant?.registerAt
                    ? formatDate(participant.registerAt)
                    : '-'}
                </p>
              </div>
            </div>

            {/* Image Preview */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">
                Bukti Pembayaran
              </h4>

              {/* Image Container */}
              <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                {participant?.paymentProof ? (
                  <div className="relative w-full">
                    <Image
                      src={participant.paymentProof}
                      alt="Bukti Pembayaran"
                      width={800}
                      height={1000}
                      className="h-auto w-full object-contain"
                      priority
                    />
                  </div>
                ) : (
                  <div className="flex h-[400px] items-center justify-center">
                    <p className="text-sm text-gray-500">
                      Tidak ada bukti pembayaran
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="border-t border-gray-200 px-6 py-4">
          <div className="flex w-full items-center justify-end gap-3">
            <Button
              variant="flat"
              onPress={handleReject}
              isDisabled={isProcessing}
              startContent={<XCircle className="h-4 w-4" />}
              className="border-danger text-danger border-2 bg-white font-semibold"
            >
              Reject
            </Button>
            <Button
              onPress={handleApprove}
              isDisabled={isProcessing}
              startContent={<Check className="h-4 w-4" />}
              className="border-success text-success border-2 bg-white font-semibold"
            >
              Approve
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
