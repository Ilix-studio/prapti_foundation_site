// src/redux-store/services/totalImpactApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, handleApiError } from "../../constants/apiConfig";

export interface TotalImpact {
  _id: string;
  dogsRescued: number;
  dogsAdopted: number;
  volunteers: number;
  isActive: boolean;
  adoptionRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTotalImpactRequest {
  dogsRescued: number;
  dogsAdopted: number;
  volunteers: number;
}

export interface UpdateTotalImpactRequest {
  dogsRescued?: number;
  dogsAdopted?: number;
  volunteers?: number;
  isActive?: boolean;
}

export interface TotalImpactResponse {
  success: boolean;
  message: string;
  data: TotalImpact;
}

export interface TotalImpactListResponse {
  success: boolean;
  data: TotalImpact[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

export interface ImpactStatistics {
  totalDogsRescued: number;
  totalDogsAdopted: number;
  totalVolunteers: number;
  avgAdoptionRate: number;
  recordCount: number;
}

export interface ImpactStatsResponse {
  success: boolean;
  data: ImpactStatistics;
}

export const totalImpactApi = createApi({
  reducerPath: "totalImpactApi",
  baseQuery,
  tagTypes: ["TotalImpact", "ImpactStats"],
  endpoints: (builder) => ({
    // Get all total impact records
    getAllTotalImpact: builder.query<
      TotalImpactListResponse,
      { page?: number; limit?: number; isActive?: boolean }
    >({
      query: ({ page = 1, limit = 10, isActive } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (isActive !== undefined) {
          params.append("isActive", isActive.toString());
        }
        return `/impact?${params}`;
      },
      providesTags: ["TotalImpact"],
      transformErrorResponse: (response: any) => {
        console.error("Get all total impact error:", response);
        return handleApiError(response);
      },
    }),

    // Get single total impact record by ID
    getTotalImpactById: builder.query<TotalImpactResponse, string>({
      query: (id) => `/impact/${id}`,
      providesTags: (_result, _error, id) => [{ type: "TotalImpact", id }],
      transformErrorResponse: (response: any) => {
        console.error("Get total impact by ID error:", response);
        return handleApiError(response);
      },
    }),

    // Get latest total impact record
    getLatestTotalImpact: builder.query<TotalImpactResponse, void>({
      query: () => "/impact/latest",
      providesTags: ["TotalImpact"],
      transformErrorResponse: (response: any) => {
        console.error("Get latest total impact error:", response);
        return handleApiError(response);
      },
    }),

    // Get impact statistics
    getImpactStatistics: builder.query<ImpactStatsResponse, void>({
      query: () => "/impact/stats",
      providesTags: ["ImpactStats"],
      transformErrorResponse: (response: any) => {
        console.error("Get impact statistics error:", response);
        return handleApiError(response);
      },
    }),

    // Create new total impact record
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
      transformErrorResponse: (response: any) => {
        console.error("Create total impact error:", response);
        return handleApiError(response);
      },
    }),

    // Update total impact record
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
      transformErrorResponse: (response: any) => {
        console.error("Update total impact error:", response);
        return handleApiError(response);
      },
    }),

    // Delete total impact record
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
      transformErrorResponse: (response: any) => {
        console.error("Delete total impact error:", response);
        return handleApiError(response);
      },
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
