import { Key, ReactNode, useCallback, useEffect, useState } from 'react';
import { BiDotsVerticalRounded, BiPlus, BiTrash } from 'react-icons/bi';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';
import { useRouter } from 'next/router';
import DataTable from '@/components/ui/Table/DataTable';
import AddInputModal from './AddInputModal';
import ColumnListParticipants from './Participants.constants';
import useParticipants from './useParticipants';

function Participants() {
  const router = useRouter();
  const [selectByAddress, setSelectByAddress] = useState('');
  const {
    dataParticipants,
    isLoadingParticipants,
    isRefetchingParticipants,

    setUrl,
    currentLimit,
    currentPage,
    currentSearch,
    handleChangeLimit,
    handleChangePage,
    handleSearch,
    handleClearSearch,
  } = useParticipants();

  useEffect(() => {
    if (router.isReady) setUrl();
  }, [router.isReady]);

  const renderCell = useCallback(
    (participant: Record<string, unknown>, columnKey: Key) => {
      const cellValue = participant[columnKey as keyof typeof participant];

      switch (columnKey) {
        case 'actions':
          return (
            <Dropdown>
              <DropdownTrigger>
                <Button size="sm" variant="light">
                  <BiDotsVerticalRounded className="text-default-700 text-[1.2rem]" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {participant.status === 'belum selesai' ? (
                  <DropdownItem
                    key="input-participants-button"
                    onPress={() =>
                      setSelectByAddress(String(participant.address_peserta))
                    }
                    startContent={<BiPlus />}
                  >
                    Input
                  </DropdownItem>
                ) : null}
                <DropdownItem
                  key="detail-participants-button"
                  onPress={() =>
                    router.push(`/admin/participants/${participant._id}`)
                  }
                  startContent={<BiDotsVerticalRounded />}
                >
                  Detail Peserta
                </DropdownItem>
                <DropdownItem
                  key="delete-button"
                  className="text-danger-500"
                  startContent={<BiTrash />}
                >
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
    <section className="pt-4">
      {Object.keys(router.query).length > 0 && (
        <DataTable
          columns={ColumnListParticipants}
          currentPage={Number(currentPage)}
          data={dataParticipants?.data || []}
          emptyContent="Daftar Peserta Kosong"
          isLoading={isLoadingParticipants || isRefetchingParticipants}
          limit={String(currentLimit)}
          onChangeLimit={handleChangeLimit}
          onChangePage={handleChangePage}
          onChangeSearch={handleSearch}
          onClearSearch={handleClearSearch}
          renderCell={renderCell}
          totalPages={dataParticipants?.pagination.totalPages}
        />
      )}
      {selectByAddress && (
        <AddInputModal
          address={selectByAddress}
          isOpen
          onClose={() => setSelectByAddress('')}
        />
      )}
    </section>
  );
}

export default Participants;
