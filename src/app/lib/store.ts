// This file is now replaced by the store.ts file in the app/store directory.
// It's being kept to maintain compatibility with any imports that might exist.
// Please import from '../store/store' instead.

import { store, persistor } from '../store/store';
import type { AppDispatch, RootState } from '../store/store';

export { store, persistor };
export type { AppDispatch, RootState }; 