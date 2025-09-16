import DataTable from '@/components/ui/DataTables';
import ColumnListParticipants from './Participants.constants';
import { useRouter } from 'next/router';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';
import { CiMenuKebab } from 'react-icons/ci';
import { Key, ReactNode, useCallback } from 'react';

const dataDummy = [
  { _id: '123', name: 'aku', email: 'aku@gmail.com', status: 'aktif' },
];

function ParticipantsPage() {
  const router = useRouter();
  const renderCell = useCallback(
    (participant: Record<string, unknown>, columnKey: Key) => {
      const cellValue = participant[columnKey as keyof typeof participant];

      switch (columnKey) {
        case 'actions':
          return (
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <CiMenuKebab className="text-default-700" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {participant.status === 'aktif' ? (
                  <DropdownItem
                    key="input-participants-button"
                    onPress={() => router.push(`/admin/participants/create`)}
                  >
                    Input
                  </DropdownItem>
                ) : null}
                <DropdownItem
                  key="detail-participants-button"
                  onPress={() =>
                    router.push(`/admin/participants/${participant._id}`)
                  }
                >
                  Detail Peserta
                </DropdownItem>
                <DropdownItem key="delete-button" className="text-danger-500">
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return cellValue as ReactNode;
      }
    },
    [router.push]
  );

  return (
    <section>
      <DataTable
        renderCell={renderCell}
        columns={ColumnListParticipants}
        data={dataDummy}
      ></DataTable>
    </section>
  );
}

export default ParticipantsPage;
