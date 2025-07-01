import { apiSlice } from '../apiSlice';

const DEPARTMENT_URL = '/department';

export const departmentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation to create a new department
    createDepartment: builder.mutation({
      query: (departmentData) => ({
        url: DEPARTMENT_URL,
        method: 'POST',
        body: departmentData,
      }),
      invalidatesTags: ['Departments'],
    }),

    // Query to fetch all departments
    getDepartments: builder.query({
      query: () => ({
        url: DEPARTMENT_URL,
        method: 'GET',
      }),
      providesTags: ['Departments'],
    }),

    // Query to fetch a department by ID
    getDepartmentById: builder.query({
      query: (id) => ({
        url: `${DEPARTMENT_URL}/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Department', id }],
    }),

    // Mutation to update a department
   updateDepartment: builder.mutation({
  query: ({ id, name, head }) => ({
    url: `/department/${id}`,
    method: 'PUT',
    body: { name, head },
  }),
  invalidatesTags: ['Departments'],
}),
  }),
});

export const {
  useCreateDepartmentMutation,
  useGetDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useUpdateDepartmentMutation,
} = departmentApiSlice;