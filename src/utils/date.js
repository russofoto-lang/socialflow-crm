import { addDays, endOfMonth, format, getDay, isSameMonth, parseISO, startOfMonth } from 'date-fns';
import { it } from 'date-fns/locale';

export const formatDate = (value) => (value ? format(parseISO(value), 'dd MMM yyyy', { locale: it }) : 'Senza data');

export const formatDateTime = (value) => (value ? format(parseISO(value), 'dd MMM yyyy HH:mm', { locale: it }) : 'Non disponibile');

export function buildMonthDays(baseDate = new Date()) {
  const start = startOfMonth(baseDate);
  const end = endOfMonth(baseDate);
  const firstGridDay = addDays(start, -((getDay(start) + 6) % 7));
  const days = [];
  let current = firstGridDay;
  while (days.length < 42) {
    days.push({ date: current, key: format(current, 'yyyy-MM-dd'), inMonth: isSameMonth(current, start) });
    current = addDays(current, 1);
  }
  return { label: format(baseDate, 'MMMM yyyy', { locale: it }), days, monthStart: start, monthEnd: end };
}
