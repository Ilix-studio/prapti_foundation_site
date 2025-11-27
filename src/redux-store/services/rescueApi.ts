import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, handleApiError } from "../../constants/apiConfig";

export interface RescuePost {
  _id: string;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface RescuePostsResponse {
  success: boolean;
  data: RescuePost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface RescuePostResponse {
  success: boolean;
  data: RescuePost;
}

export interface CreateRescuePostRequest {
  title: string;
  description: string;
  beforeImage: File;
  afterImage: File;
}

export interface UpdateRescuePostRequest {
  title?: string;
  description?: string;
  imageAction?: "add";
  imageType?: "before" | "after";
  image?: File;
}

export const rescueApi = createApi({
  reducerPath: "rescueApi",
  baseQuery,
  tagTypes: ["RescuePosts", "RescuePost"],
  endpoints: (builder) => ({
    // GET /rescue/get - Get all rescue posts with pagination
    getRescuePosts: builder.query<
      RescuePostsResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search) {
          params.append("search", search);
        }
        return `/rescue/get?${params.toString()}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "RescuePosts" as const,
                id: _id,
              })),
              { type: "RescuePosts", id: "LIST" },
            ]
          : [{ type: "RescuePosts", id: "LIST" }],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // GET /rescue/get/:id - Get single rescue post
    getRescuePostById: builder.query<RescuePostResponse, string>({
      query: (id) => `/rescue/get/${id}`,
      providesTags: (_, __, id) => [{ type: "RescuePost", id }],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // POST /rescue/create - Create rescue post
    createRescuePost: builder.mutation<
      { success: boolean; message: string; data: RescuePost },
      FormData
    >({
      query: (formData) => ({
        url: "/rescue/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "RescuePosts", id: "LIST" }],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // PATCH /rescue/update/:id - Update rescue post
    updateRescuePost: builder.mutation<
      { success: boolean; message: string; data: RescuePost },
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/rescue/update/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "RescuePost", id },
        { type: "RescuePosts", id: "LIST" },
      ],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // DELETE /rescue/del/:id - Delete rescue post
    deleteRescuePost: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/rescue/del/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "RescuePosts", id: "LIST" }],
      transformErrorResponse: (response) => handleApiError(response),
    }),
  }),
});

export const {
  useGetRescuePostsQuery,
  useGetRescuePostByIdQuery,
  useCreateRescuePostMutation,
  useUpdateRescuePostMutation,
  useDeleteRescuePostMutation,
} = rescueApi;
