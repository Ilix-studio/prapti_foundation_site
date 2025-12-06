import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, handleApiError } from "../../constants/apiConfig";
import {
  DeleteVolunteerResponse,
  VolunteerDetailResponse,
  VolunteerInput,
  VolunteerResponse,
  VolunteersListResponse,
} from "@/types/volunteer.types";

// Create the volunteer API service
export const volunteerApi = createApi({
  reducerPath: "volunteerApi",
  baseQuery,
  tagTypes: ["Volunteers", "Volunteer"],
  endpoints: (builder) => ({
    // Submit volunteer application (Public)
    submitVolunteerApplication: builder.mutation<
      VolunteerResponse,
      VolunteerInput
    >({
      query: (data) => ({
        url: "/volunteers/create",
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [{ type: "Volunteers", id: "LIST" }],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Get all volunteer applications (Admin only)
    getVolunteerApplications: builder.query<
      VolunteersListResponse,
      { page?: number; limit?: number } | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append("page", params.page.toString());
        if (params?.limit)
          searchParams.append("limit", params.limit.toString());

        return `/volunteers/info${
          searchParams.toString() ? `?${searchParams.toString()}` : ""
        }`;
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

    // Get volunteer application by ID (Admin only)
    getVolunteerApplicationById: builder.query<VolunteerDetailResponse, string>(
      {
        query: (id) => `/volunteers/${id}`,
        providesTags: (_, __, id) => [{ type: "Volunteer", id }],
        transformErrorResponse: (response) => handleApiError(response),
      }
    ),

    // Delete volunteer application (Admin only)
    deleteVolunteerApplication: builder.mutation<
      DeleteVolunteerResponse,
      string
    >({
      query: (id) => ({
        url: `/volunteers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Volunteers", id: "LIST" }],
      transformErrorResponse: (response) => handleApiError(response),
    }),
  }),
});

// Export hooks for using the API endpoints
export const {
  useSubmitVolunteerApplicationMutation,
  useGetVolunteerApplicationsQuery,
  useGetVolunteerApplicationByIdQuery,
  useDeleteVolunteerApplicationMutation,
} = volunteerApi;
