import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { AuthState } from '../../types';

// Type-safe version of useDispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Type-safe version of useSelector hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Helper selector specifically for auth state to handle redux-persist typing
export function useAuth(): AuthState {
  // Cast the state.auth to AuthState, since we know the structure
  return useAppSelector((state) => state.auth);
} 