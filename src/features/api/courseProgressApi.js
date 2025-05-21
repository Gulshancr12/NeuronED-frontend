import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Dynamic API URL from environment variables
const BASE_API_URL = import.meta.env.VITE_BACKEND_URL || "https://neuroned-backend.onrender.com";

export const courseProgressApi = createApi({
  reducerPath: "courseProgressApi",
  tagTypes: ["CourseProgress"], 
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_API_URL}/api/v1/progress`,
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    }
  }),
  endpoints: (builder) => ({
    getCourseProgress: builder.query({
      query: (courseId) => `/${courseId}`,
      providesTags: (result, error, courseId) => 
        [{ type: "CourseProgress", id: courseId }]
    }),

    updateLectureProgress: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `/${courseId}/lecture/${lectureId}/view`,
        method: "POST"
      }),
      invalidatesTags: (result, error, { courseId }) => 
        [{ type: "CourseProgress", id: courseId }]
    }),

    completeCourse: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}/complete`,
        method: "POST"
      }),
      invalidatesTags: (result, error, courseId) => 
        [{ type: "CourseProgress", id: courseId }]
    }),

    inCompleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}/incomplete`,
        method: "POST"
      }),
      invalidatesTags: (result, error, courseId) => 
        [{ type: "CourseProgress", id: courseId }]
    })
  })
});

export const {
  useGetCourseProgressQuery,
  useUpdateLectureProgressMutation,
  useCompleteCourseMutation,
  useInCompleteCourseMutation
} = courseProgressApi;