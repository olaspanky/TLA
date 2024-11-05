import { apiSlice } from "../apiSlice";

const USER_URL = "/user";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/profile`,
                method: "PUT",
                body: data,
                credentials: "include",
            }),
        }),

        getTeamList: builder.query({ 
            query: () => ({
                url: `${USER_URL}/get-team`,
                method: "GET",
                credentials: "include",
            }),
        }),

        deleteUser: builder.mutation({
            query: (id) => ({
                url: `${USER_URL}/${id}`,
                method: "DELETE", // Changed to DELETE
                credentials: "include",
            }),
        }),

        userAction: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/${data.id}`,
                method: "PUT",
                body: data,  // Assuming you're sending user action (active state)
                credentials: "include",
            }),
        }),
        getNotification: builder.query({
            query: (data) => ({
                url: `${USER_URL}/notifications`,
                method: "GET",
                body: data,  // Assuming you're sending user action (active state)
                credentials: "include",
            }),
        }),

        markNotiAsRead: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/read-noti?isReadType=${data.type}&id=${data?.id}`,
                method: "PUT",
                body: data,  // Assuming you're sending user action (active state)
                credentials: "include",
            }),
        }),

        changePassword: builder.mutation({
         query: (data) => ({
            url: `${USER_URL}/change-password`,
            method: "PUT",
            body: data,  // Assuming you're sending user action (active state)
            credentials: "include",
         })  
        }),

       

        
        
    }),
});

export const {
    useUpdateUserMutation,
    useGetTeamListQuery,  
    useDeleteUserMutation,
    useUserActionMutation,
    useChangePasswordMutation,
    useGetNotificationQuery,
    useMarkNotiAsReadMutation
} = userApiSlice;
