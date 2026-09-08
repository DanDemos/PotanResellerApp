type DateInput = string | number | Date | null | undefined;

/**
 * Parse an API UTC timestamp into a Date in the device local timezone.
 * Strings without a timezone (e.g. "2026-08-26 13:55:05") are treated as UTC.
 */
export function parseUtcToLocalDate(dateInput: DateInput): Date | null {
  if (dateInput == null || dateInput === '') {
    return null;
  }

  if (dateInput instanceof Date) {
    return Number.isNaN(dateInput.getTime()) ? null : dateInput;
  }

  if (typeof dateInput === 'number') {
    const date = new Date(dateInput);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const raw = dateInput.trim();
  if (!raw) {
    return null;
  }

  const hasTimezone = /([zZ]|[+-]\d{2}:?\d{2})$/.test(raw);
  let normalized = raw.includes('T') ? raw : raw.replace(' ', 'T');

  // JS Date only reliably handles up to milliseconds
  normalized = normalized.replace(/(\.\d{3})\d+/, '$1');

  if (!hasTimezone) {
    normalized = `${normalized}Z`;
  }

  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatLocalTime(
  dateInput: DateInput,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = parseUtcToLocalDate(dateInput);
  if (!date) {
    return typeof dateInput === 'string' ? dateInput : '';
  }

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  });
}

export function formatLocalDate(
  dateInput: DateInput,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = parseUtcToLocalDate(dateInput);
  if (!date) {
    return typeof dateInput === 'string' ? dateInput : '';
  }

  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    ...options,
  });
}

export function formatLocalDateTime(
  dateInput: DateInput,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = parseUtcToLocalDate(dateInput);
  if (!date) {
    return typeof dateInput === 'string' ? dateInput : '';
  }

  return date.toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  });
}

export function formatHistoryDate(dateStr: string): string {
  try {
    const date = parseUtcToLocalDate(dateStr);
    if (!date) {
      return dateStr;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const targetDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    let prefix = '';
    if (targetDate.getTime() === today.getTime()) {
      prefix = 'Today, ';
    } else if (targetDate.getTime() === yesterday.getTime()) {
      prefix = 'Yesterday, ';
    } else {
      prefix = date.toLocaleDateString('en-US', { weekday: 'short' }) + ', ';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();

    return `${prefix}${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
}

export function formatFullDate(dateStr: string): string {
  const formatted = formatLocalDateTime(dateStr, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
  return formatted || dateStr;
}
