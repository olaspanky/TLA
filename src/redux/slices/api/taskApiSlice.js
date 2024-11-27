// import { apiSlice } from "../apiSlice";

// const TASKS_URL = "/task";

// export const taskApiSlice = apiSlice.injectEndpoints({
//     endpoints: (builder) => ({
//         getDashboardStats: builder.query({
//             query: () => ({
//                 url: `${TASKS_URL}/dashboard`,
//                 method: "GET",
//                 credentials: "include",
//             }),
//         }),
//         getAllTask: builder.query({
//             query: ({strQuery, isTrashed, search}) => ({
//                 url: `${TASKS_URL}?stage=${strQuery}&isTrashed=${isTrashed}&search=${search}`,
//                 method: "GET",
//                 credentials: "include",
//             }),
//         }),
//         craeteTask: builder.mutation({
//             query: (data) => ({
//                 url: `${TASKS_URL}/create`,
//                 method: "POST",
//                 body: data,
//                 credentials: "include",
//             }),
//         }),
       
//         duplicateTask: builder.mutation({
//             query: (id) => ({
//               url: `${TASKS_URL}/duplicate/${id}`,
//               method: "POST",
//               credentials: "include", // Empty body if no data is required for duplication
//             }),
//           }),
          
//           updateTask: builder.mutation({
//             query: (data) => ({
//               url: `${TASKS_URL}/update/${data._id}`,
//               method: "PUT",
//               body: data, // The full task data to update
//               credentials: "include", // Necessary for authenticated requests
//             }),
//           }),
          
//           trashTask: builder.mutation({
//             query: ({ id }) => ({
//               url: `${TASKS_URL}/${id}`, // Adjust URL to match backend if needed
//               method: "PUT", // PATCH is preferred for small updates like trashing a task
//               credentials: "include", // Include credentials for cookies/auth
//             }),
//           }),
//           createSubTask: builder.mutation({
//             query: ({ data, id }) => ({
//               url: `${TASKS_URL}/create-subtask/${id}`, // Adjust URL to match backend if needed
//               method: "PUT", // PATCH is preferred for small updates like trashing a task
//               body: data, // The full task data to update
//               credentials: "include", // Include credentials for cookies/auth
//             }),
//           }),

//           getSingleTask: builder.query({
//             query: (id) => ({
//               url: `${TASKS_URL}/${id}`, // Adjust URL to match backend if needed
//               method: "GET", // PATCH is preferred for small updates like trashing a task
//               credentials: "include", // Include credentials for cookies/auth
//             }),
//           }),
          
//           updateSubTaskItem: builder.mutation({
//             query: ({ taskId, subTaskId, objectiveId, updateData }) => ({
//                 url: `${TASKS_URL}/update-subtaskItem/${taskId}/${subTaskId}/${objectiveId}`,
//                 method: "PUT",
//                 body: updateData,
//                 credentials: "include",
//             }),
//           }),

        

//         updateSubTask: builder.mutation({
//           query: ({ taskId, subTaskId, updateData }) => ({
//             url: `${TASKS_URL}/update-subtask/${taskId}/${subTaskId}`,
//             method: "PUT",
//             body: updateData,
//             credentials: "include",
//           }),
//         }),

//         deleteSubTask: builder.mutation({
//           query: ({ taskId, subTaskId }) => ({
//               url: `${TASKS_URL}/delete-subtask/${taskId}/${subTaskId}`,
//               method: "DELETE",
//               credentials: "include",
//           }),
//       }),
          
          
        
//     }),
// });

// export const {
//    useGetDashboardStatsQuery,
//    useGetAllTaskQuery, useCraeteTaskMutation, 
//    useDuplicateTaskMutation, useUpdateTaskMutation, useTrashTaskMutation,
//    useCreateSubTaskMutation, useGetSingleTaskQuery, useUpdateSubTaskItemMutation, useUpdateSubTaskMutation, useDeleteSubTaskMutation
// } = taskApiSlice;
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
        craeteTask: builder.mutation({
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
                credentials: "include", // Empty body if no data is required for duplication
            }),
        }),
        updateTask: builder.mutation({
            query: (data) => ({
                url: `${TASKS_URL}/update/${data._id}`,
                method: "PUT",
                body: data, // The full task data to update
                credentials: "include", // Necessary for authenticated requests
            }),
        }),
        trashTask: builder.mutation({
            query: ({ id }) => ({
                url: `${TASKS_URL}/${id}`, // Adjust URL to match backend if needed
                method: "PUT", // PATCH is preferred for small updates like trashing a task
                credentials: "include", // Include credentials for cookies/auth
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
              url: `${TASKS_URL}/${id}/subtasks/${subTaskId}/comments`,
              method: "POST",
              body: commentData,
              credentials: "include", 
              headers: {
                  "Content-Type": "application/json",
              },
          }),
      }),
    }),
});

export const {
    useGetDashboardStatsQuery,
    useGetAllTaskQuery,
    useCraeteTaskMutation,
    useDuplicateTaskMutation,
    useUpdateTaskMutation,
    useTrashTaskMutation,
    useCreateSubTaskMutation,
    useGetSingleTaskQuery,
    useUpdateSubTaskItemMutation,
    useUpdateSubTaskMutation,
    useDeleteSubTaskMutation,
    useAddCommentToSubTaskMutation, // Export the new mutation hook
} = taskApiSlice;
