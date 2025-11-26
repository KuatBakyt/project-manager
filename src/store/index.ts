import { configureStore } from '@reduxjs/toolkit';
import { authApi } from 'api/authApi';
import { projectsApi } from 'api/projectsApi';
import { userApi } from 'api/userApi';

import userSlice from 'store/slices/userSlice';

const preloadedState = {
  user: {
    token: localStorage.getItem('token') || null,
    user: localStorage.getItem('profile')
      ? JSON.parse(localStorage.getItem('profile')!)
      : null,
  },
};

export const store = configureStore({
  reducer: {
    user: userSlice,
    [projectsApi.reducerPath]: projectsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(authApi.middleware)
    .concat(projectsApi.middleware)
    .concat(userApi.middleware),
  preloadedState,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
