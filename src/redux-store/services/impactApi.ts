import { apiSlice } from "./apiSlice";
import { handleApiError } from "../../constants/apiConfig";
import {
  CreateTotalImpactRequest,
  ImpactStatsResponse,
  TotalImpactListResponse,
  TotalImpactResponse,
  UpdateTotalImpactRequest,
} from "@/types/Impact.types";

const totalImpactApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTotalImpact: builder.query<
      TotalImpactListResponse,
      { page?: number; limit?: number; isActive?: boolean }
    >({
      query: ({ page = 1, limit = 10, isActive } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (isActive !== undefined)
          params.append("isActive", isActive.toString());
        return `/impact?${params}`;
      },
      providesTags: ["TotalImpact"],
      transformErrorResponse: (response: any) => handleApiError(response),
    }),

    getTotalImpactById: builder.query<TotalImpactResponse, string>({
      query: (id) => `/impact/${id}`,
      providesTags: (_result, _error, id) => [{ type: "TotalImpact", id }],
      transformErrorResponse: (response: any) => handleApiError(response),
    }),

    getLatestTotalImpact: builder.query<TotalImpactResponse, void>({
      query: () => "/impact/latest",
      providesTags: ["TotalImpact"],
      transformErrorResponse: (response: any) => handleApiError(response),
    }),

    getImpactStatistics: builder.query<ImpactStatsResponse, void>({
      query: () => "/impact/stats",
      providesTags: ["ImpactStats"],
      transformErrorResponse: (response: any) => handleApiError(response),
    }),

    createTotalImpact: builder.mutation<
      TotalImpactResponse,
      CreateTotalImpactRequest
    >({
      query: (data) => ({
        url: "/impact",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TotalImpact", "ImpactStats"],
      transformErrorResponse: (response: any) => handleApiError(response),
    }),

    updateTotalImpact: builder.mutation<
      TotalImpactResponse,
      { id: string; data: UpdateTotalImpactRequest }
    >({
      query: ({ id, data }) => ({
        url: `/impact/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "TotalImpact", id },
        "TotalImpact",
        "ImpactStats",
      ],
      transformErrorResponse: (response: any) => handleApiError(response),
    }),

    deleteTotalImpact: builder.mutation<TotalImpactResponse, string>({
      query: (id) => ({
        url: `/impact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "TotalImpact", id },
        "TotalImpact",
        "ImpactStats",
      ],
      transformErrorResponse: (response: any) => handleApiError(response),
    }),
  }),
});

export const {
  useGetAllTotalImpactQuery,
  useGetTotalImpactByIdQuery,
  useGetLatestTotalImpactQuery,
  useGetImpactStatisticsQuery,
  useCreateTotalImpactMutation,
  useUpdateTotalImpactMutation,
  useDeleteTotalImpactMutation,
} = totalImpactApi;
