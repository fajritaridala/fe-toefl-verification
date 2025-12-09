"use client";

import { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  XCircle, 
  SkipForward,
  FileText,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import Image from 'next/image';

type ParticipantData = {
  _id: string;
  fullName: string;
  nim: string;
  email?: string;
  phoneNumber?: string;
  faculty?: string;
  major?: string;
  scheduleId?: string;
  scheduleName?: string;
  scheduleDate?: string;
  paymentProof?: string;
  paymentDate?: string;
};

type QuickPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  participant: ParticipantData | null;
  currentIndex: number;
  totalParticipants: number;
  onNext: () => void;
  onPrevious: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewDetail: () => void;
  isProcessing?: boolean;
};

export default function QuickPreviewModal({
  isOpen,
  onClose,
  participant,
  currentIndex,
  totalParticipants,
  onNext,
  onPrevious,
  onApprove,
  onReject,
  onViewDetail,
  isProcessing = false,
}: QuickPreviewModalProps) {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Reset zoom when modal closes or participant changes
  useEffect(() => {
    if (!isOpen) {
      setZoom(1);
      setIsFullscreen(false);
    }
  }, [isOpen, participant?._id]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen || !participant) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'a':
          e.preventDefault();
          onApprove(participant._id);
          break;
        case 'r':
          e.preventDefault();
          onReject(participant._id);
          break;
        case 'arrowright':
          e.preventDefault();
          onNext();
          break;
        case 'arrowleft':
          e.preventDefault();
          onPrevious();
          break;
        case 'escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, participant, onApprove, onReject, onNext, onPrevious, onClose]);

  if (!participant) return null;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="5xl"
      scrollBehavior="inside"
      isDismissable={!isProcessing}
      hideCloseButton
      classNames={{
        base: 'bg-white',
        body: 'p-0',
      }}
    >
      <ModalContent>
        {/* Custom Header with Navigation */}
        <ModalHeader className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Preview Peserta</h2>
            <span className="text-sm text-gray-500">
              {currentIndex + 1} dari {totalParticipants}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="light"
              isIconOnly
              onPress={onPrevious}
              isDisabled={currentIndex === 0 || isProcessing}
              className="text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <Button
              size="sm"
              variant="light"
              isIconOnly
              onPress={onNext}
              isDisabled={currentIndex >= totalParticipants - 1 || isProcessing}
              className="text-gray-600 hover:text-gray-900"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
            
            <div className="w-px h-6 bg-gray-300 mx-2" />
            
            <Button
              size="sm"
              variant="light"
              isIconOnly
              onPress={onClose}
              isDisabled={isProcessing}
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </ModalHeader>
        
        <ModalBody>
          <div className="grid grid-cols-2 gap-6 p-6">
            {/* Left: Payment Proof Image */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Bukti Pembayaran</h3>
                
                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <Button
                    size="sm"
                    variant="light"
                    isIconOnly
                    onPress={handleZoomOut}
                    isDisabled={zoom <= 0.5}
                    className="h-8 w-8 min-w-8"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  
                  <span className="text-xs font-medium text-gray-700 px-2 min-w-12 text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  
                  <Button
                    size="sm"
                    variant="light"
                    isIconOnly
                    onPress={handleZoomIn}
                    isDisabled={zoom >= 3}
                    className="h-8 w-8 min-w-8"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  
                  <Button
                    size="sm"
                    variant="light"
                    isIconOnly
                    onPress={() => setIsFullscreen(!isFullscreen)}
                    className="h-8 w-8 min-w-8"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Image Container */}
              <div 
                className={`relative bg-gray-100 rounded-lg overflow-auto border border-gray-200 ${
                  isFullscreen ? 'h-[600px]' : 'h-[500px]'
                }`}
              >
                {participant.paymentProof ? (
                  <div 
                    className="min-w-full min-h-full flex items-center justify-center p-4"
                    style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.2s' }}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={participant.paymentProof}
                        alt="Bukti Pembayaran"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400 text-sm">Tidak ada bukti pembayaran</p>
                  </div>
                )}
              </div>
              
              {participant.paymentProof && (
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <Button
                    size="sm"
                    variant="light"
                    onPress={handleResetZoom}
                    className="text-xs h-8"
                  >
                    Reset Zoom
                  </Button>
                  <a 
                    href={participant.paymentProof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-600 font-medium"
                  >
                    Buka di tab baru →
                  </a>
                </div>
              )}
            </div>
            
            {/* Right: Participant Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-semibold text-gray-900">Detail Peserta</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium">Nama Lengkap</label>
                  <p className="text-base text-gray-900 font-semibold mt-1">{participant.fullName}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 font-medium">NIM</label>
                    <p className="text-sm text-gray-900 font-medium mt-1">{participant.nim}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-500 font-medium">No. Telepon</label>
                    <p className="text-sm text-gray-900 mt-1">{participant.phoneNumber || '-'}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-gray-500 font-medium">Email</label>
                  <p className="text-sm text-gray-900 mt-1">{participant.email || '-'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 font-medium">Fakultas</label>
                    <p className="text-sm text-gray-900 mt-1">{participant.faculty || '-'}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-500 font-medium">Program Studi</label>
                    <p className="text-sm text-gray-900 mt-1">{participant.major || '-'}</p>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-100">
                  <label className="text-xs text-gray-500 font-medium">Jadwal</label>
                  <p className="text-sm text-gray-900 font-semibold mt-1">
                    {participant.scheduleName || participant.scheduleId || '-'}
                  </p>
                  {participant.scheduleDate && (
                    <p className="text-xs text-gray-500 mt-0.5">{participant.scheduleDate}</p>
                  )}
                </div>
                
                {participant.paymentDate && (
                  <div>
                    <label className="text-xs text-gray-500 font-medium">Tanggal Pembayaran</label>
                    <p className="text-sm text-gray-900 mt-1">{participant.paymentDate}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ModalBody>
        
        {/* Action Footer */}
        <ModalFooter className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            {/* Keyboard hints */}
            <div className="text-xs text-gray-500">
              <span className="font-mono bg-gray-200 px-2 py-1 rounded">A</span> Approve • 
              <span className="font-mono bg-gray-200 px-2 py-1 rounded mx-2">R</span> Reject • 
              <span className="font-mono bg-gray-200 px-2 py-1 rounded mx-2">←→</span> Navigate
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="bordered"
                onPress={onViewDetail}
                isDisabled={isProcessing}
                startContent={<FileText className="w-4 h-4" />}
                className="border-gray-300"
              >
                Detail Lengkap
              </Button>
              
              <Button
                color="danger"
                variant="flat"
                onPress={() => onReject(participant._id)}
                isDisabled={isProcessing}
                isLoading={isProcessing}
                startContent={!isProcessing && <XCircle className="w-4 h-4" />}
                className="bg-danger-50 text-danger-700 hover:bg-danger-100 font-semibold"
              >
                Reject (R)
              </Button>
              
              <Button
                color="success"
                onPress={() => onApprove(participant._id)}
                isDisabled={isProcessing}
                isLoading={isProcessing}
                startContent={!isProcessing && <Check className="w-4 h-4" />}
                className="bg-success text-white font-semibold"
              >
                Approve (A)
              </Button>
              
              <Button
                variant="light"
                onPress={onNext}
                isDisabled={currentIndex >= totalParticipants - 1 || isProcessing}
                startContent={<SkipForward className="w-4 h-4" />}
                className="text-gray-600"
              >
                Skip
              </Button>
            </div>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
