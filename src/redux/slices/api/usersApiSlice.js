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
        body: userData,
      }),
      invalidatesTags: ['Users'],
    }),
    // New mutation to toggle user activation status
    toggleUserStatus: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}/toggle-status`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Users'],
    }),
    // New mutation to assign staff details to a user
    assignUserDetails: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${USERS_URL}/${id}/assign`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useUpdateUserMutation,
  useToggleUserStatusMutation,
  useAssignUserDetailsMutation,
} = usersApiSlice;