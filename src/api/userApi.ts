import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ChangePasswordRequest, User } from 'types/user';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://master.dev.solvatech.kz/lab-api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ['User', 'Tasks'],
  endpoints: (builder) => ({
    getUserProfile: builder.query<User, string>({
      query: (userId) => `/users/${userId}`,
      providesTags: ['User'],
    }),
    changePassword: builder.mutation<{ message: string }, { userId: string; body: ChangePasswordRequest }>({
      query: ({ userId, body }) => ({
        url: `/users/${userId}/password`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useChangePasswordMutation,
} = userApi;
