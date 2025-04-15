
import { format, parse, isValid, parseISO } from 'date-fns';

export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Invalid date';
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatMonthYear = (dateString: string): string => {
  try {
    // Handle YYYY-MM format
    if (dateString.length === 7) {
      const date = parse(dateString, 'yyyy-MM', new Date());
      if (!isValid(date)) return 'Invalid date';
      return format(date, 'MMMM yyyy');
    }
    
    // Handle full date format
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Invalid date';
    return format(date, 'MMMM yyyy');
  } catch (error) {
    return 'Invalid date';
  }
};

export const getCurrentMonthYear = (): string => {
  return format(new Date(), 'yyyy-MM');
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};
