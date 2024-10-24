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
            query: ({strQuery, isTrashed, search}) => ({
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
              url: `${TASKS_URL}/create-subtask/${id}`, // Adjust URL to match backend if needed
              method: "PUT", // PATCH is preferred for small updates like trashing a task
              body: data, // The full task data to update
              credentials: "include", // Include credentials for cookies/auth
            }),
          }),

          getSingleTask: builder.query({
            query: (id) => ({
              url: `${TASKS_URL}/${id}`, // Adjust URL to match backend if needed
              method: "GET", // PATCH is preferred for small updates like trashing a task
              credentials: "include", // Include credentials for cookies/auth
            }),
          }),
          
          updateSubTask: builder.mutation({
            query: ({ taskId, subTaskId, objectiveId, updateData }) => ({
                url: `${TASKS_URL}/update-subtask/${taskId}/${subTaskId}/${objectiveId}`,
                method: "PUT",
                body: updateData,
                credentials: "include",
            }),
          }),
          
          

       
        
    }),
});

export const {
   useGetDashboardStatsQuery,
   useGetAllTaskQuery, useCraeteTaskMutation, 
   useDuplicateTaskMutation, useUpdateTaskMutation, useTrashTaskMutation,
   useCreateSubTaskMutation, useGetSingleTaskQuery, useUpdateSubTaskMutation
} = taskApiSlice;
