// src/store/api/testimonialApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../constants/apiConfig";
import {
  TestimonialCreateRequest,
  TestimonialQueryParams,
  TestimonialResponse,
  TestimonialsResponse,
  TestimonialUpdateRequest,
  TestimonialStatsResponse,
} from "../../types/testimonial.types";

const buildQueryString = (params: TestimonialQueryParams): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value.toString());
    }
  });

  return searchParams.toString();
};

export const testimonialApi = createApi({
  reducerPath: "testimonialApi",
  baseQuery,
  tagTypes: ["Testimonials", "Testimonial", "TestimonialStats"],
  endpoints: (builder) => ({
    // Get all testimonials with pagination and filters
    getTestimonials: builder.query<
      TestimonialsResponse,
      TestimonialQueryParams
    >({
      query: (params = {}) => {
        const queryString = buildQueryString(params);
        return `/testimonials${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Testimonials" as const,
                id,
              })),
              { type: "Testimonials", id: "LIST" },
            ]
          : [{ type: "Testimonials", id: "LIST" }],
    }),

    // Get active testimonials only
    getActiveTestimonials: builder.query<
      TestimonialsResponse,
      { limit?: number; sortBy?: string; sortOrder?: "asc" | "desc" }
    >({
      query: (params = {}) => {
        const queryString = buildQueryString(params);
        return `/testimonials/active${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: [{ type: "Testimonials", id: "ACTIVE" }],
    }),

    // Get featured testimonials
    getFeaturedTestimonials: builder.query<
      TestimonialsResponse,
      { limit?: number }
    >({
      query: (params = {}) => {
        const queryString = buildQueryString(params);
        return `/testimonials/featured${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: [{ type: "Testimonials", id: "FEATURED" }],
    }),

    // Get testimonial by ID
    getTestimonialById: builder.query<TestimonialResponse, string>({
      query: (id) => `/testimonials/${id}`,
      providesTags: (_, __, id) => [{ type: "Testimonial", id }],
    }),

    // Create testimonial (Public)
    createTestimonial: builder.mutation<
      TestimonialResponse,
      TestimonialCreateRequest
    >({
      query: (body) => ({
        url: "/testimonials",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Testimonials", id: "LIST" },
        { type: "Testimonials", id: "ACTIVE" },
        { type: "Testimonials", id: "FEATURED" },
        { type: "TestimonialStats", id: "STATS" },
      ],
    }),

    // Update testimonial (Admin only)
    updateTestimonial: builder.mutation<
      TestimonialResponse,
      { id: string; data: TestimonialUpdateRequest }
    >({
      query: ({ id, data }) => ({
        url: `/testimonials/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Testimonial", id },
        { type: "Testimonials", id: "LIST" },
        { type: "Testimonials", id: "ACTIVE" },
        { type: "Testimonials", id: "FEATURED" },
        { type: "TestimonialStats", id: "STATS" },
      ],
    }),

    // Delete testimonial (Admin only)
    deleteTestimonial: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/testimonials/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Testimonials", id: "LIST" },
        { type: "Testimonials", id: "ACTIVE" },
        { type: "Testimonials", id: "FEATURED" },
        { type: "TestimonialStats", id: "STATS" },
      ],
    }),

    // Get testimonial statistics (Admin only)
    getTestimonialStats: builder.query<TestimonialStatsResponse, void>({
      query: () => "/testimonials/admin/stats",
      providesTags: [{ type: "TestimonialStats", id: "STATS" }],
    }),
  }),
});

export const {
  useGetTestimonialsQuery,
  useGetActiveTestimonialsQuery,
  useGetFeaturedTestimonialsQuery,
  useGetTestimonialByIdQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
  useGetTestimonialStatsQuery,
} = testimonialApi;
