const FILTER_OPTIONS = [
  { name: 'Selesai', uid: 'selesai' },
  { name: 'Belum Selesai', uid: 'belum selesai' },
];

const LIMIT_LISTS = [
  { label: '8', value: 8 },
  { label: '12', value: 12 },
  { label: '16', value: 16 },
];

const PAGINATION_OPTIONS = {
  pageDefault: 1,
  limitDefault: LIMIT_LISTS[0].value,
  delay: 500,
};

export { FILTER_OPTIONS, LIMIT_LISTS, PAGINATION_OPTIONS };
