/**
 * Type definitions for UI components
 */
import { ReactNode } from "react";

/**
 * Common props for layout components
 */
export interface LayoutProps {
  children: ReactNode;
}

/**
 * Button component props
 */
export interface ButtonProps {
  children: ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  asChild?: boolean;
}

/**
 * Input component props
 */
export interface InputProps {
  id?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  autoComplete?: string;
}

/**
 * Checkbox component props
 */
export interface CheckboxProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  required?: boolean;
  disabled?: boolean;
}

/**
 * Select component props
 */
export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  children: ReactNode;
} 