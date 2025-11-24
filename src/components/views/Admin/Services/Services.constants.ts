export type ServiceTableColumn = {
  key: 'name' | 'price' | 'duration' | 'notes' | 'description' | 'actions';
  label: string;
  className?: string;
};

export const SERVICE_TABLE_COLUMNS: ServiceTableColumn[] = [
  { key: 'name', label: 'Nama' },
  { key: 'price', label: 'Harga' },
  { key: 'duration', label: 'Durasi' },
  { key: 'notes', label: 'Catatan', className: 'w-36' },
  { key: 'description', label: 'Deskripsi' },
  { key: 'actions', label: 'Aksi', className: 'w-20 text-right' },
];
