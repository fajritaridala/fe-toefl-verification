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
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly size="sm" variant="light">
          <BiDotsVerticalRounded className="text-default-300" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Actions" onAction={handleAction}>
        {row.status === 'menunggu' ? (
          <>
            <DropdownItem
              key="approve"
              startContent={<LuCheck />}
              color="success"
            >
              Setujui
            </DropdownItem>
            <DropdownItem key="reject" startContent={<LuX />} color="danger">
              Tolak
            </DropdownItem>
          </>
        ) : row.status === 'disetujui' ? (
          <DropdownItem
            key="score"
            startContent={<LuListChecks />}
            color="primary"
          >
            Input Nilai
          </DropdownItem>
        ) : null}
      </DropdownMenu>
    </Dropdown>
  );
}
