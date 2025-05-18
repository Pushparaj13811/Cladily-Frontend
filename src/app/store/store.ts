import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../../features/auth/authSlice';
import { RootState as RootStateType } from '@shared/types';

// Combine all reducers
export const rootReducer = combineReducers({
  auth: authReducer,
  // Add other reducers here as needed
});

// Configure persist options
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'] // Only persist auth state
};

// Create persisted reducer
const persistedRootReducer = persistReducer(persistConfig, rootReducer);

// Create the store
export const store = configureStore({
  reducer: persistedRootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = RootStateType;
export type AppDispatch = typeof store.dispatch; 