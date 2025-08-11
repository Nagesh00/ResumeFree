import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, createMigrate } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import resumeReducer from './slices/resumeSlice';
import jobTailoringReducer from './jobTailoringSlice';

// Redux persist configuration
const migrations = {
  0: (state: any) => {
    // Initial migration
    return {
      ...state,
    };
  },
  1: (state: any) => {
    // Migration for version 1
    return {
      ...state,
      resume: {
        ...state.resume,
        // Add any new fields with defaults
      },
    };
  },
};

const persistConfig = {
  key: 'resumeai-root',
  version: 1,
  storage,
  migrate: createMigrate(migrations, { debug: false }),
  whitelist: ['resume'], // Only persist resume state, not job tailoring
};

const jobTailoringPersistConfig = {
  key: 'resumeai-job-tailoring',
  version: 1,
  storage,
  whitelist: ['analysisHistory'], // Only persist history
};

// Root reducer
const rootReducer = combineReducers({
  resume: resumeReducer,
  jobTailoring: persistReducer(jobTailoringPersistConfig, jobTailoringReducer),
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
          'persist/FLUSH',
        ],
        ignoredPaths: ['register'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export { useDispatch, useSelector } from 'react-redux';
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) => useSelector(selector);
