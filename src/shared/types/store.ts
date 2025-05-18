import { AuthState } from '@shared/types';

/**
 * Root state interface for the Redux store
 */
export interface RootState {
  auth: AuthState;
  // Add other slice states here as needed
}

/**
 * Configuration for async thunks
 */
export interface AsyncThunkConfig {
  /** Value returned from the thunk if the promise is rejected */
  rejectValue: string;
  /** Type of the `state` parameter for the thunk */
  state: { auth: AuthState };
} 