// apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://tla.pbr.com.ng/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token || localStorage.getItem('authToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Objective', 'Task', 'User', 'Department', 'Organization'], // Add new tags
  endpoints: () => ({}),
});