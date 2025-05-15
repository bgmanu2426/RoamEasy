
import { format, parseISO } from 'date-fns';

export function formatDate(dateString?: string, dateFormat: string = 'MMM d, yyyy'): string {
  if (!dateString) return 'N/A';
  try {
    const date = parseISO(dateString);
    return format(date, dateFormat);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}
