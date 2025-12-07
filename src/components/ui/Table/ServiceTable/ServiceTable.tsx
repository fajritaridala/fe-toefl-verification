import { ReactNode } from 'react';
import { BiDotsVerticalRounded, BiPlus } from 'react-icons/bi';
import { LuPenLine, LuTrash2 } from 'react-icons/lu';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { ServiceTableColumn } from '@/components/views/Admin/Services/Services.constants';
import { ServiceItem } from '@/utils/interfaces/Service';
import toRupiah from '@/utils/toRupiah';

type Props = {
  columns: ServiceTableColumn[];
  services: ServiceItem[];
  isLoading: boolean;
  isRefetching: boolean;
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
  onAdd: () => void;
  onEdit: (service: ServiceItem) => void;
  onDelete: (service: ServiceItem) => void;
};

const ServiceTable = (props: Props) => {
  const {
    columns,
    services,
    isLoading,
    isRefetching,
    currentPage,
    totalPages,
    onChangePage,
    onAdd,
    onEdit,
    onDelete,
  } = props;

  const renderCell = (
    service: ServiceItem,
    columnKey: ServiceTableColumn['key']
  ): ReactNode => {
    switch (columnKey) {
      case 'name':
        return <p>{service.name}</p>;
      case 'price':
        return <p>{toRupiah(service.price)}</p>;
      case 'notes':
        return service.notes ? service.notes : <span>-</span>;
      case 'description':
        return <p>{service.description}</p>;
      case 'actions':
        return (
          <div className="flex justify-end">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly variant="light">
                  <BiDotsVerticalRounded size={18} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Aksi layanan">
                <DropdownItem
                  key="edit-service"
                  startContent={<LuPenLine size={16} />}
                  onPress={() => onEdit(service)}
                >
                  Ubah
                </DropdownItem>
                <DropdownItem
                  key="delete-service"
                  className="text-danger"
                  startContent={<LuTrash2 size={16} />}
                  onPress={() => onDelete(service)}
                >
                  Hapus
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return null;
    }
  };

  const topContent = (
    <div className="flex justify-end">
      <Button
        className="bg-primary text-bg-light shadow-small font-semibold transition-all duration-200 hover:-translate-y-0.5"
        startContent={<BiPlus size={18} />}
        onPress={onAdd}
      >
        Tambah Layanan
      </Button>
    </div>
  );

  const bottomContent = (
    <div className="flex w-full justify-end">
      {totalPages > 1 && (
        <Pagination
          isCompact
          showControls
          color="secondary"
          page={currentPage}
          total={totalPages}
          onChange={onChangePage}
        />
      )}
    </div>
  );

  return (
    <section>
      {isRefetching && (
        <div className="text-text flex items-center gap-2 text-base">
          <Spinner size="sm" />
          <p>Mengambil data terbaru...</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table
          aria-label="Tabel layanan"
          classNames={{ base: 'min-w-full', wrapper: 'rounded-lg shadow' }}
          topContent={topContent}
          topContentPlacement="outside"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={services}
            emptyContent="Belum ada layanan"
            isLoading={isLoading}
            loadingContent={<Spinner color="secondary" />}
          >
            {(item) => (
              <TableRow key={item._id} className="border-b border-border last:border-0">
                {columns.map((column) => (
                  <TableCell
                    align="left"
                    className="text-xsmall"
                    key={column.key}
                  >
                    {renderCell(item, column.key)}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default ServiceTable;
