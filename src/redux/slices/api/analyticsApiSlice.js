// analyticsApiSlice.js
import { apiSlice } from "../apiSlice";

// Define the base URL path for analytics endpoints
const ANALYTICS_URL = "/analytics";

// Extend the existing apiSlice with analytics endpoints
export const analyticsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /analytics/user/{userId}/rating
    getUserRating: builder.query({
      query: (userId) => ({
        url: `${ANALYTICS_URL}/user/${userId}/rating`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // GET /analytics/department/{departmentId}/rating
    getDepartmentRating: builder.query({
      query: (departmentId) => ({
        url: `${ANALYTICS_URL}/department/${departmentId}/rating`,
        method: "GET",
      }),
      providesTags: ["Department"],
    }),

    // GET /analytics/organization/rating
    getOrganizationRating: builder.query({
      query: () => ({
        url: `${ANALYTICS_URL}/organization/rating`,
        method: "GET",
      }),
      providesTags: ["Organization"],
    }),

    // GET /analytics/department/{departmentId}/member-ratings
    getDepartmentMemberRatings: builder.query({
      query: (departmentId) => ({
        url: `${ANALYTICS_URL}/department/${departmentId}/member-ratings`,
        method: "GET",
      }),
      providesTags: ["Department", "User"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetUserRatingQuery,
  useGetDepartmentRatingQuery,
  useGetOrganizationRatingQuery,
  useGetDepartmentMemberRatingsQuery,
} = analyticsApiSlice;
