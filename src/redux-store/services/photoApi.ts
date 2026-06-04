import { apiSlice } from "./apiSlice";
import {
  PhotoCreateData,
  PhotoMultipleUploadData,
  PhotoResponse,
  PhotosQueryParams,
  PhotosResponse,
  PhotoUpdateData,
  PhotoUploadData,
} from "@/types/photo.types";

const photoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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

    getPhoto: builder.query<PhotoResponse, string>({
      query: (id) => `/photos/${id}`,
      transformResponse: (response: PhotoResponse) => response,
      providesTags: (_result, _error, id) => [{ type: "Photo", id }],
    }),

    createPhoto: builder.mutation<PhotoResponse, PhotoCreateData>({
      query: (data) => ({
        url: "/photos",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: PhotoResponse) => response,
      invalidatesTags: ["Photo"],
    }),

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
        return { url: "/photos/upload", method: "POST", body: formData };
      },
      transformResponse: (response: PhotoResponse) => response,
      invalidatesTags: ["Photo"],
    }),

    uploadMultiplePhotos: builder.mutation<
      PhotoResponse,
      { files: File[]; data: PhotoMultipleUploadData }
    >({
      query: ({ files, data }) => {
        const formData = new FormData();
        files.forEach((file) => formData.append("photos", file));
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

    updatePhoto: builder.mutation<
      PhotoResponse,
      { id: string; data: PhotoUpdateData }
    >({
      query: ({ id, data }) => ({
        url: `/photos/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: PhotoResponse) => response,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Photo", id },
        "Photo",
      ],
    }),

    updatePhotoWithFile: builder.mutation<
      PhotoResponse,
      {
        id: string;
        file?: File;
        data: Partial<
          PhotoUpdateData & {
            alt?: string;
            imageAction?: "add" | "delete" | "updateAlt";
            imageIndex?: string;
            imageAlt?: string;
          }
        >;
      }
    >({
      query: ({ id, file, data }) => {
        const formData = new FormData();
        if (file) formData.append("photo", file);
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });
        return { url: `/photos/${id}/upload`, method: "PATCH", body: formData };
      },
      transformResponse: (response: PhotoResponse) => response,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Photo", id },
        "Photo",
      ],
    }),

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
  useUpdatePhotoWithFileMutation,
  useDeletePhotoMutation,
  useGetPhotosByCategoryQuery,
  useSearchPhotosQuery,
} = photoApi;
