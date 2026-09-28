import { configureStore } from '@reduxjs/toolkit';
import financeReducer from './financeSlice';
import themeReducer from './themeSlice';
import { localStorageMiddleware } from './localStorageMiddleware';

export const store = configureStore({
  reducer: {
    finance: financeReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
});