import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { Key, ReactNode } from 'react';

type Props = {
  data: Record<string, unknown>[];
  columns: Record<string, unknown>[];
  renderCell: (item: Record<string, unknown>, columnKey: Key) => ReactNode;
};

function DataTable(props: Props) {
  const { data, columns, renderCell } = props;

  return (
      <Table>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid as Key}>
              {column.name as string}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={data}>
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
