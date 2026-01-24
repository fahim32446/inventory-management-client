import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import themeReducer from './slice/themeSlice';
import authReducer from './slice/authSlice';
import storage from 'redux-persist/lib/storage';
import drawerSlice from './slice/drawerSlice';
import modalSlice from './slice/modalSlice';

import { baseApi } from './api/baseApi';

const authPersistConfig = {
  key: '360_erp_admin',
  storage,
  version: 1,
};
const themePersistConfig = {
  key: '360_theme_admin',
  storage,
  version: 1,
};

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  theme: persistReducer(themePersistConfig, themeReducer),
  auth: persistReducer(authPersistConfig, authReducer),
  drawer: drawerSlice,
  modal: modalSlice,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
