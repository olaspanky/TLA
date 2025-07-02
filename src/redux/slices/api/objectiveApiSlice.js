import { apiSlice } from "../apiSlice";

const OBJECTIVES_URL = "/objectives";
const USERS_URL = "/user";

export const objectivesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Query to fetch all objectives
    getObjectives: builder.query({
      query: () => ({
        url: OBJECTIVES_URL,
        method: "GET",
      }),
      providesTags: ["Objectives"],
    }),
    // Mutation to create a new objective
    createObjective: builder.mutation({
      query: (objectiveData) => ({
        url: OBJECTIVES_URL,
        method: "POST",
        body: objectiveData,
      }),
      invalidatesTags: ["Objectives"],
    }),
    // Mutation to add a comment to an objective
    addObjectiveComment: builder.mutation({
      query: ({ id, text }) => ({
        url: `${OBJECTIVES_URL}/${id}/comments`,
        method: "POST",
        body: { text },
      }),
      invalidatesTags: ["Objectives"],
    }),
    // Mutation to update an objective
    updateObjective: builder.mutation({
      query: ({ id, ...objectiveData }) => ({
        url: `${OBJECTIVES_URL}/${id}`,
        method: "PATCH",
        body: objectiveData,
      }),
      invalidatesTags: ["Objectives"],
    }),
    // Mutation to accept an objective via email token
    acceptObjective: builder.mutation({
      query: ({ token, objectiveId }) => ({
        url: `${OBJECTIVES_URL}/accept`,
        method: "GET",
        params: { token, objectiveId },
      }),
      invalidatesTags: ["Objectives"],
    }),
    // Mutation to decline an objective via email token
    declineObjective: builder.mutation({
      query: ({ token, objectiveId }) => ({
        url: `${OBJECTIVES_URL}/decline`,
        method: "GET",
        params: { token, objectiveId },
      }),
      invalidatesTags: ["Objectives"],
    }),
    // Query to fetch all users (Super Admin only)
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
    // Mutation to update user role or department (Super Admin only)
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `${USERS_URL}/${id}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),
    // Query to fetch quarterly performance review
    getPerformanceReview: builder.query({
      query: (quarter) => ({
        url: `${OBJECTIVES_URL}/performance-review`,
        method: "GET",
        params: { quarter },
      }),
      providesTags: ["PerformanceReview"],
    }),
    // Mutation to approve objective completion
    approveObjectiveCompletion: builder.mutation({
      query: (id) => ({
        url: `${OBJECTIVES_URL}/${id}/approve-completion`,
        method: "GET",
      }),
      invalidatesTags: ["Objectives", "PerformanceReview"],
    }),
    // Mutation to reject objective completion
    rejectObjectiveCompletion: builder.mutation({
      query: (id) => ({
        url: `${OBJECTIVES_URL}/${id}/reject-completion`,
        method: "GET",
      }),
      invalidatesTags: ["Objectives", "PerformanceReview"],
    }),
    // Query to fetch department objectives
    getDepartmentObjectives: builder.query({
      query: ({ departmentId, search = '', status = '', priorityLevel = '', sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 }) => ({
        url: `${OBJECTIVES_URL}/department/${departmentId}`,
        method: "GET",
        params: { search, status, priorityLevel, sortBy, order, page, limit },
      }),
      providesTags: ["Objectives"],
    }),
    // Query to fetch upcoming objectives
    getUpcomingObjectives: builder.query({
      query: (days = 7) => ({
        url: `${OBJECTIVES_URL}/upcoming`,
        method: "GET",
        params: { days },
      }),
      providesTags: ["Objectives"],
    }),
    // Mutation to add a progress note to an objective
    addObjectiveProgressNote: builder.mutation({
      query: ({ id, note }) => ({
        url: `${OBJECTIVES_URL}/${id}/progress-notes`,
        method: "POST",
        body: { note },
      }),
      invalidatesTags: ["Objectives"],
    }),
    // Mutation to update objective progress
    updateObjectiveProgress: builder.mutation({
      query: ({ id, progress }) => ({
        url: `${OBJECTIVES_URL}/${id}/progress`,
        method: "PATCH",
        body: { progress },
      }),
      invalidatesTags: ["Objectives", "PerformanceReview"],
    }),
    // Mutation to delete an objective
    deleteObjective: builder.mutation({
      query: (id) => ({
        url: `${OBJECTIVES_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Objectives", "PerformanceReview"],
    }),
  }),
});

export const {
  useGetObjectivesQuery,
  useCreateObjectiveMutation,
  useAddObjectiveCommentMutation,
  useUpdateObjectiveMutation,
  useAcceptObjectiveMutation,
  useDeclineObjectiveMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useGetPerformanceReviewQuery,
  useApproveObjectiveCompletionMutation,
  useRejectObjectiveCompletionMutation,
  useGetDepartmentObjectivesQuery,
  useGetUpcomingObjectivesQuery,
  useAddObjectiveProgressNoteMutation,
  useUpdateObjectiveProgressMutation,
  useDeleteObjectiveMutation,
} = objectivesApiSlice;