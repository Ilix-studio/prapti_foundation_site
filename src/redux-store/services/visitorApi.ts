import { apiSlice } from "./apiSlice";
import { handleApiError } from "../../constants/apiConfig";
import {
  VisitorCountResponse,
  VisitorResetResponse,
  VisitorStatsResponse,
} from "@/types/visitor.types";

const visitorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    incrementVisitorCounter: builder.mutation<VisitorCountResponse, void>({
      query: () => ({
        url: "/visitor/increment-counter",
        method: "POST",
      }),
      invalidatesTags: ["VisitorCount", "VisitorStats"],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    getVisitorCount: builder.query<VisitorCountResponse, void>({
      query: () => "/visitor/visitor-count",
      providesTags: ["VisitorCount"],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    getVisitorStats: builder.query<VisitorStatsResponse, void>({
      query: () => "/visitor/stats",
      providesTags: ["VisitorStats"],
      transformErrorResponse: (response) => handleApiError(response),
    }),

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

export const {
  useIncrementVisitorCounterMutation,
  useGetVisitorCountQuery,
  useLazyGetVisitorCountQuery,
  useGetVisitorStatsQuery,
  useLazyGetVisitorStatsQuery,
  useResetVisitorCounterMutation,
} = visitorApi;
