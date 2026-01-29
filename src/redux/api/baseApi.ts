import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { message } from 'antd';
import { authApi } from '../../features/auth/api/authApi';
import { baseUrl } from '../../utils/request';
import { logout, setAuth } from '../slice/authSlice';
import { RootState } from '../store';

import { Mutex } from 'async-mutex';
import { ILoginResponse } from '../../features/auth/auth.interface';

const mutex = new Mutex();

const isAuthEndpoint = (url?: string) =>
  url?.includes('/public/auth/login') ||
  url?.includes('/auth/refresh') ||
  url?.includes('/public/auth/logout');

const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth?.accessToken;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  const url = typeof args === 'string' ? args : args.url;
  const method = (result?.meta as any)?.request?.method;
  const res_message = (result?.data as any)?.message;
  const errorMsg = (result?.error as any)?.data?.message;

  // Global success message for non-GET requests
  if (result?.data && method !== 'GET' && method !== 'HEAD' && !isAuthEndpoint(url)) {
    if (res_message) {
      message.success(res_message);
    }
  }

  // Global error message (excluding 401 which is handled below)
  if (result?.error && errorMsg && result.error.status !== 401) {
    message.error(errorMsg);
  }

  if (result.error && result.error.status === 401 && !isAuthEndpoint(url)) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const state = api.getState() as RootState;
        const refreshToken = state?.auth?.accessToken;

        if (refreshToken) {
          const refreshResult = await baseQuery(
            {
              url: '/public/auth/refresh-token',
              method: 'GET',
            },
            api,
            extraOptions,
          );

          if (refreshResult?.data) {
            const data = refreshResult?.data as ILoginResponse;

            // store the new token
            api.dispatch(
              setAuth({
                data: data?.data,
                message: data?.message,
                success: data?.success,
                accessToken: data?.accessToken,
              }),
            );

            // retry the initial query
            result = await baseQuery(args, api, extraOptions);
          } else {
            api.dispatch(logout());
            api.dispatch(authApi.endpoints.logOut.initiate());
          }
        } else {
          api.dispatch(logout());
          api.dispatch(authApi.endpoints.logOut.initiate());
        }
      } finally {
        release();
      }
    } else {
      // wait until the mutex is available
      await mutex.waitForUnlock();

      // Check if we have a token now. If not, the refresh failed.
      const state = api.getState() as RootState;
      if (state.auth?.accessToken) {
        result = await baseQuery(args, api, extraOptions);
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  baseQuery: baseQueryWithReauth,
  refetchOnFocus: true,

  endpoints: () => ({}),
  tagTypes: [
    'USER',
    'SESSIONS',
    'EMPLOYEE',
    'PRODUCT',
    'CATEGORY',
    'WAREHOUSE',
    'SUPPLIER',
    'PURCHASE',
    'SALES',
    'USER',
    'ROLE',
    'ADMINISTRATION',
  ],
});
