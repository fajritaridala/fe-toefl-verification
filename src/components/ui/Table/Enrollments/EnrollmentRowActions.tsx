"use client";

import { Key } from 'react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { LuCheck, LuListChecks, LuX } from 'react-icons/lu';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Button,
} from '@heroui/react';
import type { EnrollmentRow } from './EnrollmentsTable.types';

type EnrollmentRowActionsProps = {
  row: EnrollmentRow;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onScore: (row: EnrollmentRow) => void;
};

export default function EnrollmentRowActions({
  row,
  onApprove,
  onReject,
  onScore,
}: EnrollmentRowActionsProps) {
  const handleAction = (key: Key) => {
    switch (key) {
      case 'approve':
        onApprove(row._id);
        break;
      case 'reject':
        onReject(row._id);
        break;
      case 'score':
        onScore(row);
        break;
    }
  };

  return (
    <Dropdown
      classNames={{
        content: 'rounded-lg shadow-xl border border-gray-200 p-1 min-w-[180px]',
      }}
    >
      <DropdownTrigger>
        <Button 
          isIconOnly 
          size="sm" 
          variant="light"
          className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors rounded-lg"
        >
          <BiDotsVerticalRounded className="text-lg" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="Actions" 
        onAction={handleAction}
        itemClasses={{
          base: [
            'rounded-md',
            'data-[hover=true]:bg-gray-50',
            'transition-colors',
            'gap-3',
            'py-2.5 px-3',
          ].join(' '),
          title: 'text-sm font-medium',
          description: 'text-xs',
        }}
      >
        {row.status === 'menunggu' ? (
          <>
            <DropdownItem
              key="approve"
              description="Setujui pendaftaran peserta"
              startContent={
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success-50 text-success-600">
                  <LuCheck className="text-lg" />
                </div>
              }
              classNames={{
                base: 'data-[hover=true]:bg-success-50/50',
                title: 'text-success-700 font-semibold',
                description: 'text-success-600/70',
              }}
            >
              Setujui
            </DropdownItem>
            <DropdownItem
              key="reject"
              description="Tolak pendaftaran peserta"
              startContent={
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-danger-50 text-danger-600">
                  <LuX className="text-lg" />
                </div>
              }
              classNames={{
                base: 'data-[hover=true]:bg-danger-50/50',
                title: 'text-danger-700 font-semibold',
                description: 'text-danger-600/70',
              }}
            >
              Tolak
            </DropdownItem>
          </>
        ) : row.status === 'disetujui' ? (
          <DropdownItem
            key="score"
            description="Masukkan nilai peserta"
            startContent={
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 text-primary-600">
                <LuListChecks className="text-lg" />
              </div>
            }
            classNames={{
              base: 'data-[hover=true]:bg-primary-50/50',
              title: 'text-primary-700 font-semibold',
              description: 'text-primary-600/70',
            }}
          >
            Input Nilai
          </DropdownItem>
        ) : null}
      </DropdownMenu>
    </Dropdown>
  );
}
