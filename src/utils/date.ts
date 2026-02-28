export function formatDateToDotted(value?: string): string {
  if (!value) {
    return '';
  }

  const isoDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/;
  const isoMatch = value.match(isoDatePattern);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${day}.${month}.${year}`;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  const day = String(parsed.getDate()).padStart(2, '0');
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const year = String(parsed.getFullYear());

  return `${day}.${month}.${year}`;
}