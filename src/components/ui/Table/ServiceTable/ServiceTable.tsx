import { Key, ReactNode } from 'react';
import { RefreshCw, Search, Plus, PenLine, Trash2 } from 'lucide-react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { ServiceTableColumn } from '@features/admin/services/Services.constants';
import { ServiceItem } from '@features/admin';
import toRupiah from '@/utils/toRupiah';

type Props = {
  columns: ServiceTableColumn[];
  services: ServiceItem[];
  isLoading: boolean;
  isRefetching: boolean;
  currentPage: number;
  totalPages: number;
  currentSearch: string;
  onChangePage: (page: number) => void;
  onSearch: (value: string) => void;
  onClearSearch: () => void;
  onRefresh: () => void;
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
    currentSearch,
    onChangePage,
    onSearch,
    onClearSearch,
    onRefresh,
    onAdd,
    onEdit,
    onDelete,
  } = props;

  const renderCell = (
    service: ServiceItem,
    columnKey: Key
  ): ReactNode => {
    switch (columnKey) {
      case 'name':
        return <p className="font-semibold text-gray-900">{service.name}</p>;
      case 'price':
        return <p className="font-medium text-gray-700">{toRupiah(service.price)}</p>;
      case 'notes':
        return service.notes ? (
          <p className="text-sm text-gray-700">{service.notes}</p>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        );
      case 'description':
        return <p className="text-sm text-gray-700">{service.description}</p>;
      case 'actions':
        return (
          <div className="flex justify-center">
            <Dropdown>
              <DropdownTrigger>
                <Button 
                  isIconOnly 
                  size="sm"
                  variant="light"
                  className="hover:text-primary text-gray-600"
                >
                  <PenLine size={16} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Aksi layanan">
                <DropdownItem
                  key="edit-service"
                  startContent={<PenLine size={16} />}
                  onPress={() => onEdit(service)}
                >
                  Ubah
                </DropdownItem>
                <DropdownItem
                  key="delete-service"
                  className="text-danger"
                  startContent={<Trash2 size={16} />}
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

  return (
    <section className="space-y-4">
      {/* Refetch Indicator */}
      {isRefetching && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Spinner size="sm" color="primary" />
          <p>Mengambil data terbaru...</p>
        </div>
      )}

      {/* Table Card */}
      <div className="bg-white rounded-xl drop-shadow">
        {/* Filters Section */}
        <div className="bg-transparent px-6 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="flex flex-1 gap-2">
              <Input
                isClearable
                placeholder="Cari layanan..."
                value={currentSearch}
                onValueChange={onSearch}
                onClear={onClearSearch}
                startContent={<Search className="h-4 w-4 text-gray-400" />}
                classNames={{
                  base: 'max-w-md',
                  inputWrapper: 'bg-white border border-gray-200 hover:border-gray-300',
                }}
              />
              <Button
                isIconOnly
                variant="flat"
                className="bg-white border border-gray-200 hover:border-gray-300"
                onPress={onRefresh}
                aria-label="Refresh data"
              >
                <RefreshCw className="h-4 w-4 text-gray-600" />
              </Button>
            </div>

            {/* Add Button */}
            <Button
              className="bg-primary text-white shadow-small font-semibold transition-all duration-200 hover:-translate-y-0.5"
              startContent={<Plus size={18} />}
              onPress={onAdd}
            >
              Tambah Layanan
            </Button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-b-xl">
          <Table
            aria-label="Tabel layanan"
            selectionMode="none"
            removeWrapper
            classNames={{
              th: 'bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wide px-6 py-4 border-b text-center border-gray-200',
              td: 'px-6 py-4 text-sm text-gray-900 border-b border-gray-100',
              tr: 'hover:bg-gray-50/50 transition-colors',
              base: 'min-w-full',
            }}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={services}
              isLoading={isLoading}
              loadingContent={
                <div className="flex flex-col items-center justify-center py-12">
                  <Spinner size="lg" color="primary" />
                  <p className="mt-3 text-sm text-gray-500">
                    Memuat data layanan...
                  </p>
                </div>
              }
              emptyContent={
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <svg
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <p className="text-base font-medium text-gray-900">
                    Tidak ada data layanan
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {currentSearch
                      ? 'Coba ubah pencarian atau lakukan pencarian lain'
                      : "Klik tombol 'Tambah Layanan' untuk membuat layanan baru"}
                  </p>
                </div>
              }
            >
              {(item) => (
                <TableRow key={item._id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer - Only show if more than 1 page */}
        {!isLoading && totalPages > 1 && (
          <div className="rounded-b-xl bg-gray-50 px-6 py-3">
            <div className="flex items-center justify-end">
              <Pagination
                showShadow
                showControls
                page={currentPage}
                total={totalPages}
                onChange={onChangePage}
                variant="light"
                classNames={{
                  wrapper: 'gap-1',
                  item: 'w-8 h-8 min-w-8 bg-white',
                  cursor: 'bg-primary text-white font-semibold',
                  prev: 'bg-transparent',
                  next: 'bg-transparent',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceTable;
