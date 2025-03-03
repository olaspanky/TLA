import { apiSlice } from "../apiSlice";

const TASKS_URL = "/task";

export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: `${TASKS_URL}/dashboard`,
        method: "GET",
        credentials: "include",
      }),
    }),
    getAllTask: builder.query({
      query: ({ strQuery, isTrashed, search }) => ({
        url: `${TASKS_URL}?stage=${strQuery}&isTrashed=${isTrashed}&search=${search}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    createTask: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/create`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    duplicateTask: builder.mutation({
      query: (id) => ({
        url: `${TASKS_URL}/duplicate/${id}`,
        method: "POST",
        credentials: "include",
      }),
    }),
    updateTask: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/update/${data._id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    trashTask: builder.mutation({
      query: ({ id }) => ({
        url: `${TASKS_URL}/${id}`,
        method: "PUT",
        credentials: "include",
      }),
    }),
    createSubTask: builder.mutation({
      query: ({ data, id }) => ({
        url: `${TASKS_URL}/create-subtask/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    getSingleTask: builder.query({
        query: (id) => ({
          url: `${TASKS_URL}/${id}`,
          method: "GET",
          credentials: "include",
        }),
        providesTags: ["Task"], // Added for cache invalidation
      }),
    updateSubTaskItem: builder.mutation({
      query: ({ taskId, subTaskId, objectiveId, updateData }) => ({
        url: `${TASKS_URL}/update-subtaskItem/${taskId}/${subTaskId}/${objectiveId}`,
        method: "PUT",
        body: updateData,
        credentials: "include",
      }),
    }),
    updateSubTask: builder.mutation({
      query: ({ taskId, subTaskId, updateData }) => ({
        url: `${TASKS_URL}/update-subtask/${taskId}/${subTaskId}`,
        method: "PUT",
        body: updateData,
        credentials: "include",
      }),
    }),
    deleteSubTask: builder.mutation({
      query: ({ taskId, subTaskId }) => ({
        url: `${TASKS_URL}/delete-subtask/${taskId}/${subTaskId}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    addCommentToSubTask: builder.mutation({
        query: ({ id, subTaskId, ...commentData }) => ({
          url: `${TASKS_URL}/${id}/subtasks/${subTaskId}/comments`, // /api/task/...
          method: "POST",
          body: commentData,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }),
        invalidatesTags: ["Task"],
      }),
  
      deleteCommentFromSubTask: builder.mutation({
        query: ({ taskId, subTaskId, commentId }) => ({
          url: `${TASKS_URL}/${taskId}/subtasks/${subTaskId}/comments/${commentId}`, // Fixed to /api/task/...
          method: "DELETE",
          credentials: "include",
        }),
        invalidatesTags: ["Task"],
      }),
    }),
  });

export const {
  useGetDashboardStatsQuery,
  useGetAllTaskQuery,
  useCreateTaskMutation, // Fixed typo from useCraeteTaskMutation
  useDuplicateTaskMutation,
  useUpdateTaskMutation,
  useTrashTaskMutation,
  useCreateSubTaskMutation,
  useGetSingleTaskQuery,
  useUpdateSubTaskItemMutation,
  useUpdateSubTaskMutation,
  useDeleteSubTaskMutation,
  useAddCommentToSubTaskMutation,
  useDeleteCommentFromSubTaskMutation, // Export the new mutation hook
} = taskApiSlice;