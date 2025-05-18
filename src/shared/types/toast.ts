/**
 * Type definitions for toast functionality
 */
import { ReactNode } from "react";
import { ToastActionElement } from "@app/components/ui/toast";

/**
 * Data structure for toast messages
 */
export interface ToastData {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: ToastActionElement;
  open?: boolean;
  variant?: "default" | "destructive";
  onOpenChange?: (open: boolean) => void;
}

/**
 * Toast hook return type
 */
export interface ToastHookReturn {
  toasts: ToastData[];
  toast: (props: Omit<ToastData, "id">) => { id: string; dismiss: () => void; update: (props: ToastData) => void };
  dismiss: (toastId?: string) => void;
}

/**
 * Simplified toast options
 */
export interface ToastOptions {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
} 