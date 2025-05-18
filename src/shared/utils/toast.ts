/**
 * Centralized toast utility for using toast notifications throughout the app
 */
import { toast as hookToast } from '@app/hooks/use-toast';

/**
 * Show a toast notification
 */
export const toast = (options: {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}) => {
  return hookToast(options);
};

/**
 * Show a success toast notification
 */
export const toastSuccess = (title: string, description?: string) => {
  return toast({ title, description, variant: 'default' });
};

/**
 * Show an error toast notification
 */
export const toastError = (title: string, description?: string) => {
  return toast({ title, description, variant: 'destructive' });
}; 