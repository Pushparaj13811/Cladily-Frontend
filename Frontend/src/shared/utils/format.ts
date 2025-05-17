/**
 * Format a number as currency (USD by default)
 */
export const formatCurrency = (
  amount: number, 
  currencyCode = 'INR', 
  locale = 'en-IN'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
};

/**
 * Format a date to a readable string
 */
export const formatDate = (
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  },
  locale = 'en-US'
): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;
    
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

/**
 * Truncate a string to a specified length and add ellipsis
 */
export const truncateText = (
  text: string,
  maxLength: number,
  ellipsis = '...'
): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}${ellipsis}`;
}; 