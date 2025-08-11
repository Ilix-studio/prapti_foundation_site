import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../lib/apiConfig";
import {
  PhotoCreateData,
  PhotoMultipleUploadData,
  PhotoResponse,
  // Add this new type
  PhotosQueryParams,
  PhotosResponse,
  PhotoUpdateData,
  PhotoUploadData,
} from "@/types/photo.types";

export const photoApi = createApi({
  reducerPath: "photoApi",
  baseQuery,
  tagTypes: ["Photo"],
  endpoints: (builder) => ({
    // Get photos with pagination and filtering (Public)
    getPhotos: builder.query<PhotosResponse, PhotosQueryParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, value.toString());
          }
        });

        return `/photos?${searchParams.toString()}`;
      },
      providesTags: (result) => [
        "Photo",
        ...(result?.data.photos || []).map(({ _id }) => ({
          type: "Photo" as const,
          id: _id,
        })),
      ],
    }),

    // Get single photo by ID (Public)
    getPhoto: builder.query<PhotoResponse, string>({
      query: (id) => `/photos/${id}`,
      transformResponse: (response: PhotoResponse) => response,
      providesTags: (_result, _error, id) => [{ type: "Photo", id }],
    }),

    // Create photo with existing URLs (Admin only)
    createPhoto: builder.mutation<PhotoResponse, PhotoCreateData>({
      query: (data) => ({
        url: "/photos",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: PhotoResponse) => response,
      invalidatesTags: ["Photo"],
    }),

    // Upload single photo (Admin only) - Use PhotoUploadResponse
    uploadPhoto: builder.mutation<
      PhotoResponse,
      { file: File; data: PhotoUploadData }
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
          url: "/photos/upload",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: PhotoResponse) => response,
      invalidatesTags: ["Photo"],
    }),

    // Upload multiple photos (Admin only) - Use PhotoUploadResponse
    uploadMultiplePhotos: builder.mutation<
      PhotoResponse,
      { files: File[]; data: PhotoMultipleUploadData }
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
          url: "/photos/upload-multiple",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: PhotoResponse) => response,
      invalidatesTags: ["Photo"],
    }),

    // Update photo (Admin only)
    updatePhoto: builder.mutation<
      PhotoResponse,
      { id: string; data: PhotoUpdateData }
    >({
      query: ({ id, data }) => ({
        url: `/photos/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: PhotoResponse) => response,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Photo", id },
        "Photo",
      ],
    }),

    // Delete photo (Admin only)
    deletePhoto: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/photos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Photo", id },
        "Photo",
      ],
    }),

    // Get photos by category (Public)
    getPhotosByCategory: builder.query<
      PhotosResponse,
      { category: string; limit?: number }
    >({
      query: ({ category, limit = 12 }) =>
        `/photos?category=${category}&limit=${limit}`,
      providesTags: (result, _error, { category }) => [
        { type: "Photo", id: `category-${category}` },
        ...(result?.data.photos || []).map(({ _id }) => ({
          type: "Photo" as const,
          id: _id,
        })),
      ],
    }),

    // Search photos (Public)
    searchPhotos: builder.query<
      PhotosResponse,
      { search: string; limit?: number }
    >({
      query: ({ search, limit = 12 }) =>
        `/photos?search=${encodeURIComponent(search)}&limit=${limit}`,
      providesTags: (result, _error, { search }) => [
        { type: "Photo", id: `search-${search}` },
        ...(result?.data.photos || []).map(({ _id }) => ({
          type: "Photo" as const,
          id: _id,
        })),
      ],
    }),
  }),
});

export const {
  useGetPhotosQuery,
  useGetPhotoQuery,
  useCreatePhotoMutation,
  useUploadPhotoMutation,
  useUploadMultiplePhotosMutation,
  useUpdatePhotoMutation,
  useDeletePhotoMutation,
  useGetPhotosByCategoryQuery,
  useSearchPhotosQuery,
} = photoApi;
