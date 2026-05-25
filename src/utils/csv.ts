import type { SelectedItem } from '../features/selectedItems/selectedItemsSlice';

function escapeCsvValue(value: string | number) {
  const stringValue = String(value);

  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n')
  ) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }

  return stringValue;
}

export function createSelectedItemsCsv(items: SelectedItem[]) {
  const headers = ['id', 'name', 'description', 'details_url'];

  const rows = items.map((item) => [
    item.id,
    item.name,
    item.description,
    new URL(item.detailsPath, window.location.origin).href,
  ]);

  return [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(','))
    .join('\n');
}

export function downloadSelectedItemsCsv(items: SelectedItem[]) {
  const csvContent = createSelectedItemsCsv(items);
  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `${items.length}_items.csv`;

  document.body.append(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}
