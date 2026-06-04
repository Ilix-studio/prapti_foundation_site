import { apiSlice } from "./apiSlice";
import { handleApiError } from "../../constants/apiConfig";

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

const rescueApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRescuePosts: builder.query<
      RescuePostsResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search) params.append("search", search);
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

    getRescuePostById: builder.query<RescuePostResponse, string>({
      query: (id) => `/rescue/get/${id}`,
      providesTags: (_, __, id) => [{ type: "RescuePost", id }],
      transformErrorResponse: (response) => handleApiError(response),
    }),

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
