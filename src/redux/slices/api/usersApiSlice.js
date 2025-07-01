// src/features/api/usersApiSlice.js
import { apiSlice } from "../apiSlice";

const USERS_URL = '/user';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
        method: 'GET',
      }),
      providesTags: ['Users'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `${USERS_URL}/${id}`,
        method: 'PUT',
        body: userData,      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const { useGetUsersQuery, useUpdateUserMutation } = usersApiSlice;