/**
 * Formats a number as currency with the specified locale and currency code
 * @param amount - The amount to format
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @param currencyCode - The currency code to use (default: 'USD')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number, 
  locale: string = 'en-US', 
  currencyCode: string = 'USD'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formats a date string to a localized date format
 * @param dateString - The date string to format
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string,
  locale: string = 'en-US'
): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Truncates text to the specified length and adds an ellipsis if needed
 * @param text - The text to truncate
 * @param maxLength - The maximum length of the text (default: 100)
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (
  text: string,
  maxLength: number = 100
): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}; 