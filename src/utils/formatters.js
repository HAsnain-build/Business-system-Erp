const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('en-US');

export function formatCurrency(amount) {
  return currencyFormatter.format(amount);
}

export function formatNumber(value) {
  return numberFormatter.format(value);
}

export function getInitials(fullName) {
  const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

const STATUS_VARIANT_MAP = new Map([
  ['Paid', 'success'],
  ['Done', 'success'],
  ['In Stock', 'success'],
  ['Active', 'success'],
  ['Unpaid', 'danger'],
  ['Low Stock', 'danger'],
]);

export function getStatusVariant(status) {
  return STATUS_VARIANT_MAP.get(status) ?? 'info';
}

export function exportToCsv(filename, rows) {
  if (!rows || rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const escapeCell = (val) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const csvLines = [
    headers.map((h) => escapeCell(h)).join(','),
    ...rows.map((row) => headers.map((h) => escapeCell(row[h])).join(',')),
  ];
  const blob = new Blob([csvLines.join('\n')], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}