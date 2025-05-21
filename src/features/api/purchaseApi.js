import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Dynamic API URL from environment variables
const BASE_API_URL = import.meta.env.VITE_BACKEND_URL || "https://neuroned-backend.onrender.com";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  tagTypes: ["Purchases"], // For cache invalidation
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_API_URL}/api/v1/purchase`,
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    }
  }),
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (courseId) => ({
        url: "/checkout/create-checkout-session",
        method: "POST",
        body: { courseId }
      }),
      invalidatesTags: ["Purchases"] // Invalidate cache after purchase
    }),

    getCourseDetailWithStatus: builder.query({
      query: (courseId) => `/course/${courseId}/detail-with-status`,
      providesTags: (result, error, courseId) => [
        { type: "Purchases", id: courseId }
      ]
    }),

    getPurchasedCourses: builder.query({
      query: () => "/",
      providesTags: ["Purchases"]
    })
  })
});

export const {
  useCreateCheckoutSessionMutation,
  useGetCourseDetailWithStatusQuery,
  useGetPurchasedCoursesQuery
} = purchaseApi;