import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

// Use environment variable for base URL
const BASE_API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_API_URL}/api/v1/user`, // Dynamic URL
    credentials: "include",
    prepareHeaders: (headers) => {
      // Add Content-Type if not FormData
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
      return headers;
    }
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (inputData) => ({
        url: "register",
        method: "POST",
        body: inputData
      })
    }),
    loginUser: builder.mutation({
      query: (inputData) => ({
        url: "login",
        method: "POST",
        body: inputData
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.error("Login error:", error);
        }
      }
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET"
      }),
      async onQueryStarted(_, { dispatch }) {
        try {
          dispatch(userLoggedOut());
        } catch (error) {
          console.error("Logout error:", error);
        }
      }
    }),
    loadUser: builder.query({
      query: () => "profile",
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.error("Load user error:", error);
        }
      }
    }),
    updateUser: builder.mutation({
      query: (formData) => ({
        url: "profile/update",
        method: "PUT",
        body: formData,
        // Automatically handles FormData vs JSON
        headers: formData instanceof FormData 
          ? {} 
          : { "Content-Type": "application/json" }
      })
    })
  })
});

// Export hooks
export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useLoadUserQuery,
  useUpdateUserMutation
} = authApi;