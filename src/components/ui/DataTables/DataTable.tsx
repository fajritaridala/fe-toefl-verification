import { ChangeEvent, Key, ReactNode, useMemo, useState } from 'react';
import { BiChevronDown } from 'react-icons/bi';
import { CiSearch } from 'react-icons/ci';
import type { Selection } from '@heroui/react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { FILTER_OPTIONS, LIMIT_LISTS } from '@/constants/list.constants';

type Props = {
  buttonTopContentLabel?: string;
  columns: Record<string, unknown>[];
  currentPage: number;
  data: Record<string, unknown>[];
  emptyContent: string;
  isLoading?: boolean;
  limit: string;
  onChangeLimit: (e: ChangeEvent<HTMLSelectElement>) => void;
  onChangePage: (page: number) => void;
  onChangeSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onClickButtonTopContent?: () => void;
  renderCell: (item: Record<string, unknown>, columnKey: Key) => ReactNode;
  totalPages: number;
};

function DataTable(props: Props) {
  const {
    currentPage,
    columns,
    data,
    emptyContent,
    isLoading,
    limit,
    onChangeLimit,
    onChangePage,
    onChangeSearch,
    onClearSearch,
    renderCell,
    totalPages,
  } = props;
  const [statusFilter, setStatusFilter] = useState<Selection>('all');

  const filteredData = useMemo(() => {
    if (statusFilter === 'all') {
      return data;
    }
    const selectedKeys = Array.from(
      statusFilter instanceof Set ? statusFilter : [statusFilter]
    );
    return data.filter((item) => {
      const itemStatus = (item.status as String).toLowerCase();
      const normalized = selectedKeys.map((key) =>
        (key as string).toLowerCase()
      );
      return normalized.includes(itemStatus);
    });
  }, [data, statusFilter]);

  const TopContent = useMemo(() => {
    return (
      <div className="flex justify-between">
        <div className="flex flex-col-reverse items-start justify-between gap-y-4 lg:w-full">
          <Input
            isClearable
            className="w-full sm:max-w-[24%]"
            classNames={{
              inputWrapper: ['bg-default-100', 'shadow-sm'],
            }}
            placeholder="Search..."
            startContent={<CiSearch />}
            onClear={onClearSearch}
            onChange={onChangeSearch}
          />
        </div>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="flat" endContent={<BiChevronDown />}>
              Status
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Status Filter"
            closeOnSelect={false}
            selectedKeys={statusFilter}
            selectionMode="multiple"
            onSelectionChange={setStatusFilter}
          >
            {FILTER_OPTIONS.map((status) => (
              <DropdownItem key={status.uid}>{status.name}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }, [statusFilter, onChangeSearch]);

  const BottomContent = useMemo(() => {
    return (
      <div className="flex items-center justify-center lg:justify-between">
        <Select
          className="hidden max-w-36 lg:block"
          classNames={{
            trigger: 'bg-default-100 ',
          }}
          size="md"
          selectedKeys={[limit]}
          selectionMode="single"
          onChange={onChangeLimit}
          startContent={<p className="text-small">Show:</p>}
          disallowEmptySelection
          aria-label="Select number of items to show per page"
        >
          {LIMIT_LISTS.map((item) => (
            <SelectItem key={item.value}>{item.label}</SelectItem>
          ))}
        </Select>

        {totalPages > 1 && (
          <Pagination
            isCompact
            showControls
            color="secondary"
            page={currentPage}
            total={totalPages}
            onChange={onChangePage}
            variant="light"
            loop
          />
        )}
      </div>
    );
  }, [limit, currentPage, totalPages, onChangeLimit, onChangePage]);

  return (
    <Table
      aria-label="tabel content"
      topContent={TopContent}
      topContentPlacement="outside"
      bottomContent={BottomContent}
      bottomContentPlacement="outside"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid as Key}>
            {column.name as string}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={filteredData}
        emptyContent={emptyContent}
        isLoading={isLoading}
        loadingContent={
          <div className="bg-foreground-700/30 flex h-full w-full items-center justify-center backdrop-blur-sm">
            <Spinner color="danger" />
          </div>
        }
      >
        {(item) => (
          <TableRow key={item._id as Key}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default DataTable;
