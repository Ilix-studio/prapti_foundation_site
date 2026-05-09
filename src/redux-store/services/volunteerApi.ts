import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, handleApiError } from "../../constants/apiConfig";
import {
  DeleteVolunteerResponse,
  VolunteerDetailResponse,
  VolunteerInput,
  VolunteerResponse,
  VolunteersListResponse,
  VolunteerStatusResponse, // add this to volunteer_types.ts (see below)
} from "@/types/volunteer.types";

export const volunteerApi = createApi({
  reducerPath: "volunteerApi",
  baseQuery,
  tagTypes: ["Volunteers", "Volunteer"],
  endpoints: (builder) => ({
    submitVolunteerApplication: builder.mutation<
      VolunteerResponse,
      VolunteerInput
    >({
      query: (data) => ({
        url: "/volunteers/create",
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: [{ type: "Volunteers", id: "LIST" }],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    getVolunteerApplications: builder.query<
      VolunteersListResponse,
      { page?: number; limit?: number } | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append("page", params.page.toString());
        if (params?.limit)
          searchParams.append("limit", params.limit.toString());
        return `/volunteers/info${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Volunteers" as const,
                id: _id,
              })),
              { type: "Volunteers", id: "LIST" },
            ]
          : [{ type: "Volunteers", id: "LIST" }],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    getVolunteerApplicationById: builder.query<VolunteerDetailResponse, string>(
      {
        query: (id) => `/volunteers/${id}`,
        providesTags: (_, __, id) => [{ type: "Volunteer", id }],
        transformErrorResponse: (response) => handleApiError(response),
      },
    ),

    deleteVolunteerApplication: builder.mutation<
      DeleteVolunteerResponse,
      string
    >({
      query: (id) => ({ url: `/volunteers/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Volunteers", id: "LIST" }],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // PATCH /api/volunteers/:id/approve
    approveVolunteerApplication: builder.mutation<
      VolunteerStatusResponse,
      string
    >({
      query: (id) => ({
        url: `/volunteers/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "Volunteer", id },
        { type: "Volunteers", id: "LIST" },
      ],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // PATCH /api/volunteers/:id/reject
    rejectVolunteerApplication: builder.mutation<
      VolunteerStatusResponse,
      { id: string; reason?: string }
    >({
      query: ({ id, reason }) => ({
        url: `/volunteers/${id}/reject`,
        method: "PATCH",
        body: JSON.stringify({ reason }),
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Volunteer", id },
        { type: "Volunteers", id: "LIST" },
      ],
      transformErrorResponse: (response) => handleApiError(response),
    }),
    markVolunteerAsRead: builder.mutation<
      { success: boolean; data: { _id: string; isRead: boolean } },
      string
    >({
      query: (id) => ({
        url: `/volunteers/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "Volunteer", id },
        { type: "Volunteers", id: "LIST" },
      ],
      transformErrorResponse: (response) => handleApiError(response),
    }),
  }),
});

export const {
  useSubmitVolunteerApplicationMutation,
  useGetVolunteerApplicationsQuery,
  useGetVolunteerApplicationByIdQuery,
  useDeleteVolunteerApplicationMutation,
  useApproveVolunteerApplicationMutation,
  useRejectVolunteerApplicationMutation,
  useMarkVolunteerAsReadMutation,
} = volunteerApi;
