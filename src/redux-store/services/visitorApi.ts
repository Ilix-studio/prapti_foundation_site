import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, handleApiError } from "../../constants/apiConfig";
import {
  VisitorCountResponse,
  VisitorResetResponse,
  VisitorStatsResponse,
} from "@/types/visitor.types";

// Create the Visitor API slice
export const visitorApi = createApi({
  reducerPath: "visitorApi",
  baseQuery,
  tagTypes: ["VisitorCount", "VisitorStats"],
  endpoints: (builder) => ({
    // PUBLIC ENDPOINTS

    // Increment visitor counter (for new visitors)
    incrementVisitorCounter: builder.mutation<VisitorCountResponse, void>({
      query: () => ({
        url: "/visitor/increment-counter",
        method: "POST",
      }),
      invalidatesTags: ["VisitorCount", "VisitorStats"],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Get current visitor count (for returning visitors)
    getVisitorCount: builder.query<VisitorCountResponse, void>({
      query: () => ({
        url: "/visitor/visitor-count",
        method: "GET",
      }),
      providesTags: ["VisitorCount"],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // PROTECTED ENDPOINTS (Admin only)

    // Get detailed visitor statistics for admin dashboard
    getVisitorStats: builder.query<VisitorStatsResponse, void>({
      query: () => ({
        url: "/visitor/stats",
        method: "GET",
      }),
      providesTags: ["VisitorStats"],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Reset visitor counter (Admin only)
    resetVisitorCounter: builder.mutation<VisitorResetResponse, void>({
      query: () => ({
        url: "/visitor/reset",
        method: "POST",
      }),
      invalidatesTags: ["VisitorCount", "VisitorStats"],
      transformErrorResponse: (response) => handleApiError(response),
    }),
  }),
});

// Export hooks for using the API endpoints
export const {
  // Public endpoints
  useIncrementVisitorCounterMutation,
  useGetVisitorCountQuery,
  useLazyGetVisitorCountQuery,

  // Admin endpoints
  useGetVisitorStatsQuery,
  useLazyGetVisitorStatsQuery,
  useResetVisitorCounterMutation,
} = visitorApi;
