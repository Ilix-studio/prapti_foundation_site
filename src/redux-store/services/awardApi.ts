import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, handleApiError } from "../../constants/apiConfig";
import {
  AwardFormData,
  AwardPhotoMultipleUploadData,
  AwardPhotoUploadData,
  AwardPost,
} from "@/types/award.types";
import { PhotoResponse } from "@/types/photo.types";

export const awardApi = createApi({
  reducerPath: "awardApi",
  baseQuery,
  tagTypes: ["AwardPosts", "AwardPost"],
  endpoints: (builder) => ({
    // Get all blog posts
    getAwardPosts: builder.query<AwardPost[], void>({
      query: () => "/awards/get",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "AwardPosts" as const,
                id: _id,
              })),
              { type: "AwardPosts", id: "LIST" },
            ]
          : [{ type: "AwardPosts", id: "LIST" }],
      transformErrorResponse: (response) => handleApiError(response),
    }),
    // Get a single blog post by ID
    getAwardPostById: builder.query<AwardPost, string>({
      query: (id) => `/awards/get/${id}`,
      providesTags: (_, __, id) => [{ type: "AwardPost", id }],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Get blogs by category
    getAwardByCategory: builder.query<AwardPost[], string>({
      query: (categoryId) => `/awards?category=${categoryId}`,
      providesTags: (result, _error, categoryId) => [
        { type: "AwardPosts", id: `category-${categoryId}` },
        ...(result || []).map(({ _id }) => ({
          type: "AwardPosts" as const,
          id: _id,
        })),
      ],
      transformErrorResponse: (response) => handleApiError(response),
    }),
    // Create a new award post
    createAwardPost: builder.mutation<
      { success: boolean; message: string; data: AwardPost },
      AwardFormData
    >({
      query: (data) => ({
        url: "/awards/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "AwardPosts", id: "LIST" }],
      transformErrorResponse: (response) => handleApiError(response),
    }),
    // Upload single photo (Admin only) - Use PhotoUploadResponse
    uploadAwardPhoto: builder.mutation<
      PhotoResponse,
      { file: File; data: AwardPhotoUploadData }
    >({
      query: ({ file, data }) => {
        const formData = new FormData();
        formData.append("photo", file);

        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });

        return {
          url: "/awards/upload",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: PhotoResponse) => response,
      invalidatesTags: ["AwardPosts"],
    }),
    // Upload multiple photos (Admin only) - Use PhotoUploadResponse
    uploadAwardMultiplePhotos: builder.mutation<
      PhotoResponse,
      { files: File[]; data: AwardPhotoMultipleUploadData }
    >({
      query: ({ files, data }) => {
        const formData = new FormData();

        files.forEach((file) => {
          formData.append("photos", file);
        });

        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (key === "altTexts" && Array.isArray(value)) {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, value.toString());
            }
          }
        });

        return {
          url: "/awards/upload-multiple",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: PhotoResponse) => response,
      invalidatesTags: ["AwardPosts"],
    }),
  }),
});

// Export hooks for using the API endpoints
export const {
  useGetAwardPostsQuery,
  useGetAwardPostByIdQuery,
  useGetAwardByCategoryQuery,
  useCreateAwardPostMutation,
  useUploadAwardPhotoMutation,
  useUploadAwardMultiplePhotosMutation,
} = awardApi;
