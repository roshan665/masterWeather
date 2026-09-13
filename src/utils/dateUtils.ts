/**
 * Date formatting and calculation helpers
 */

export function formatDate(dateString: string, locale: 'hi' | 'en' = 'en'): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function formatTime(timeString: string, locale: 'hi' | 'en' = 'en'): string {
  try {
    const date = new Date(timeString);
    if (isNaN(date.getTime())) return timeString;
    
    return date.toLocaleTimeString(locale === 'hi' ? 'hi-IN' : 'en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return timeString;
  }
}

export function getDaysDifference(date1: string | Date, date2: string | Date): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
