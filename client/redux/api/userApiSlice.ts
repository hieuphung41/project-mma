import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constant";
interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<{ data: User }, string>({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        credentials:'include'
      }),
    }),
    updateUser: builder.mutation<{ data: User }, { id: string; updates: Partial<User> }>({
      query: ({ id, updates }) => ({
        url: `${USERS_URL}/${id}`,
        method: "PUT",
        body: updates,
      }),
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    forgotPassword: builder.mutation<void, { email: string }>({
      query: (data) => ({
        url: `${USERS_URL}/forgot_password`,
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<void, { token: string; newPassword: string }>({
      query: ({ token, newPassword }) => ({
        url: `${USERS_URL}/reset_password/${token}`,
        method: "POST",
        body: { newPassword },
      }),
    }),
  }),
});

export const { useGetUserQuery, useUpdateUserMutation, useDeleteUserMutation, useForgotPasswordMutation, useResetPasswordMutation } = userApiSlice;
