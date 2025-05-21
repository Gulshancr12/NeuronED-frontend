import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Dynamic API URL from environment variables
const BASE_API_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Refetch_Creator_Course", "Refetch_Lecture"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_API_URL}/api/v1/course`,
    credentials: "include",
    prepareHeaders: (headers) => {
      // Handle FormData vs JSON automatically
      if (!headers.has("Content-Type") && !(body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: ({ courseTitle, category }) => ({
        url: "",
        method: "POST",
        body: { courseTitle, category },
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),

    getSearchCourse: builder.query({
      query: ({ searchQuery, categories, sortByPrice }) => {
        const params = new URLSearchParams();

        if (searchQuery) params.append("query", searchQuery);
        if (categories?.length)
          params.append("categories", categories.join(","));
        if (sortByPrice) params.append("sortByPrice", sortByPrice);

        return {
          url: `/search?${params.toString()}`,
          method: "GET",
        };
      },
    }),

    getPublishedCourse: builder.query({
      query: () => "/published-courses",
      providesTags: ["Refetch_Creator_Course"],
    }),

    getCreatorCourse: builder.query({
      query: () => "",
      providesTags: ["Refetch_Creator_Course"],
    }),

    editCourse: builder.mutation({
      query: ({ formData, courseId }) => ({
        url: `/${courseId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),

    getCourseById: builder.query({
      query: (courseId) => `/${courseId}`,
    }),

    createLecture: builder.mutation({
      query: ({ lectureTitle, courseId }) => ({
        url: `/${courseId}/lecture`,
        method: "POST",
        body: { lectureTitle },
      }),
      invalidatesTags: ["Refetch_Lecture"],
    }),

    getCourseLecture: builder.query({
      query: (courseId) => `/${courseId}/lecture`,
      providesTags: ["Refetch_Lecture"],
    }),

    editLecture: builder.mutation({
      query: ({
        lectureTitle,
        videoInfo,
        isPreviewFree,
        courseId,
        lectureId,
      }) => ({
        url: `/${courseId}/lecture/${lectureId}`,
        method: "POST",
        body: { lectureTitle, videoInfo, isPreviewFree },
      }),
      invalidatesTags: ["Refetch_Lecture"],
    }),

    removeLecture: builder.mutation({
      query: (lectureId) => ({
        url: `/lecture/${lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Refetch_Lecture"],
    }),

    getLectureById: builder.query({
      query: (lectureId) => `/lecture/${lectureId}`,
    }),

    publishCourse: builder.mutation({
      query: ({ courseId, query }) => ({
        url: `/${courseId}?publish=${query}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),
  }),
});

// Export hooks
export const {
  useCreateCourseMutation,
  useGetSearchCourseQuery,
  useGetPublishedCourseQuery,
  useGetCreatorCourseQuery,
  useEditCourseMutation,
  useGetCourseByIdQuery,
  useCreateLectureMutation,
  useGetCourseLectureQuery,
  useEditLectureMutation,
  useRemoveLectureMutation,
  useGetLectureByIdQuery,
  usePublishCourseMutation,
} = courseApi;
