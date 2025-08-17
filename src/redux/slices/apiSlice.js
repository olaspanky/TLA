
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const primaryUrl = import.meta.env.VITE_API_PRIMARY_URL;
const backupUrl = import.meta.env.VITE_API_BACKUP_URL;

const baseQuery = fetchBaseQuery({
  
  baseUrl: primaryUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.token || localStorage.getItem("authToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});


const baseQueryWithFailover = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);


  const shouldFailover =
    result.error &&
    ((typeof result.error.originalStatus === "number" &&
      result.error.originalStatus >= 500 &&
      result.error.originalStatus < 600) ||
      result.error.status === "FETCH_ERROR" ||  result.error.originalStatus >= 400 &&
      result.error.originalStatus < 500);
    if (shouldFailover) {
      console.warn("Primary API unavailable, retrying with backup...");

      const backupBaseQuery = fetchBaseQuery({
        baseUrl: backupUrl,
        prepareHeaders: (headers, { getState }) => {
          const token =
            getState().auth?.token || localStorage.getItem("authToken");
          if (token) {
            headers.set("Authorization", `Bearer ${token}`);
          }
          headers.set("Content-Type", "application/json");
          return headers;
        },
      });

      result = await backupBaseQuery(args, api, extraOptions);
    }

  return result;
};


export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithFailover,
  tagTypes: ["Objective", "Task", "User", "Department", "Organization"],
  endpoints: () => ({}),
});
