export function formatHistoryDate(dateStr: string) {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
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
  } catch (e) {
    return dateStr;
  }
}

export function formatFullDate(dateStr: string) {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr;
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return dateStr;
  }
}
