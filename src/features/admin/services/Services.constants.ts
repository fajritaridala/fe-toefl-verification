export type ServiceTableColumn = {
  key: 'name' | 'price' | 'notes' | 'description' | 'actions';
  label: string;
  className?: string;
};

export const SERVICE_TABLE_COLUMNS: ServiceTableColumn[] = [
  { key: 'name', label: 'Nama' },
  { key: 'price', label: 'Harga' },

  { key: 'description', label: 'Deskripsi' },
  { key: 'actions', label: 'Aksi', className: 'w-20 text-right' },
];
