import { apiSlice } from "../apiSlice"

const AUTH_URL = "/user"

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder)=> ({
        login: builder.mutation({
            query: (data)=> ({
                url: `${AUTH_URL}/login`,
                method: "POST",
                body: data,
                credentials: "include",

            })
        }),
        register: builder.mutation({
            query: (data)=> ({
                url: `${AUTH_URL}/register`,
                method: "POST",
                body: data,
                credentials: "include",

            })
        }),
        logout: builder.mutation({
            query: (data)=> ({
                url: `${AUTH_URL}/logout`,
                method: "POST",
                credentials: "include",

            })
        }),

        forgotPassword: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/forgot-password`,
                method: "POST",
                body: data, // Include this if sending data in the body
                credentials: "include",
            }),
        }),
    })
})

export const { useLoginMutation, useRegisterMutation, useLogoutMutation, useForgotPasswordMutation }= authApiSlice