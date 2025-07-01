// src/features/api/developmentApiSlice.js
import { apiSlice } from "../apiSlice";

const DEVELOPMENT_URL = '/development-needs';

export const developmentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new development need
    createDevelopmentNeed: builder.mutation({
      query: (data) => ({
        url: DEVELOPMENT_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['DevelopmentNeeds'],
    }),

    // Get all development needs
    getDevelopmentNeeds: builder.query({
      query: () => ({
        url: DEVELOPMENT_URL,
        method: 'GET',
      }),
      providesTags: ['DevelopmentNeeds'],
    }),

    // Get current user's development needs
    getMyDevelopmentNeeds: builder.query({
      query: () => ({
        url: `${DEVELOPMENT_URL}/mine`,
        method: 'GET',
      }),
      providesTags: ['DevelopmentNeeds'],
    }),

    // Review a development need
    reviewDevelopmentNeed: builder.mutation({
      query: ({ id, ...reviewData }) => ({
        url: `${DEVELOPMENT_URL}/${id}/review`,
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: ['DevelopmentNeeds'],
    }),

    // Partially update a development need
    partialUpdateDevelopmentNeed: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `${DEVELOPMENT_URL}/${id}`,
        method: 'PATCH',
        body: updateData,
      }),
      invalidatesTags: ['DevelopmentNeeds'],
    }),

    // Fully update a development need
    updateDevelopmentNeed: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `${DEVELOPMENT_URL}/${id}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: ['DevelopmentNeeds'],
    }),

    // Delete a development need
    deleteDevelopmentNeed: builder.mutation({
      query: (id) => ({
        url: `${DEVELOPMENT_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DevelopmentNeeds'],
    }),
  }),
});

export const {
  useCreateDevelopmentNeedMutation,
  useGetDevelopmentNeedsQuery,
  useGetMyDevelopmentNeedsQuery,
  useReviewDevelopmentNeedMutation,
  usePartialUpdateDevelopmentNeedMutation,
  useUpdateDevelopmentNeedMutation,
  useDeleteDevelopmentNeedMutation,
} = developmentApiSlice;