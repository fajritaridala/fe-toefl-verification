"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { X, User, Mail, Phone, Building2, GraduationCap, Calendar, CreditCard, FileText } from 'lucide-react';
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
            <h2 className="text-xl font-semibold text-gray-900">Detail Peserta</h2>
            <p className="text-sm text-gray-500 mt-1">{participant.fullName}</p>
          </div>
        </ModalHeader>
        
        <ModalBody>
          <div className="space-y-6">
            {/* Data Pribadi */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-primary" />
                <h3 className="text-base font-semibold text-gray-900">Data Pribadi</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pl-7">
                <div>
                  <label className="text-xs text-gray-500 font-medium">Nama Lengkap</label>
                  <p className="text-sm text-gray-900 font-medium mt-1">{participant.fullName}</p>
                </div>
                
                <div>
                  <label className="text-xs text-gray-500 font-medium">NIM</label>
                  <p className="text-sm text-gray-900 font-medium mt-1">{participant.nim}</p>
                </div>
                
                <div>
                  <label className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email
                  </label>
                  <p className="text-sm text-gray-900 mt-1">{participant.email || '-'}</p>
                </div>
                
                <div>
                  <label className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <Phone className="w-3 h-3" /> No. Telepon
                  </label>
                  <p className="text-sm text-gray-900 mt-1">{participant.phoneNumber || '-'}</p>
                </div>
                
                <div>
                  <label className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> Fakultas
                  </label>
                  <p className="text-sm text-gray-900 mt-1">{participant.faculty || '-'}</p>
                </div>
                
                <div>
                  <label className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" /> Program Studi
                  </label>
                  <p className="text-sm text-gray-900 mt-1">{participant.major || '-'}</p>
                </div>
              </div>
            </div>

            {/* Data Pendaftaran */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-base font-semibold text-gray-900">Data Pendaftaran</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pl-7">
                <div>
                  <label className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Tanggal Jadwal
                  </label>
                  <p className="text-sm text-gray-900 font-medium mt-1">
                    {formatDate(participant.scheduleDate)}
                  </p>
                </div>
                
                <div>
                  <label className="text-xs text-gray-500 font-medium">Tanggal Daftar</label>
                  <p className="text-sm text-gray-900 mt-1">{formatDate(participant.registerAt)}</p>
                </div>
                
                <div>
                  <label className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <CreditCard className="w-3 h-3" /> Tanggal Bayar
                  </label>
                  <p className="text-sm text-gray-900 mt-1">{formatDate(participant.paymentDate)}</p>
                </div>
                
                <div>
                  <label className="text-xs text-gray-500 font-medium">Nominal Pembayaran</label>
                  <p className="text-sm text-gray-900 font-semibold mt-1">{participant.paymentAmount || '-'}</p>
                </div>
              </div>
            </div>

            {/* Bukti Pembayaran */}
            {participant.paymentProof && (
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h3 className="text-base font-semibold text-gray-900">Bukti Pembayaran</h3>
                </div>
                
                <div className="pl-7">
                  <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
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
                    className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-600 font-medium mt-3"
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
            onPress={onClose}
            startContent={<X className="w-4 h-4" />}
          >
            Tutup
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
