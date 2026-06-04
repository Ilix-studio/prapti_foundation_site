import { apiSlice } from "./apiSlice";
import {
  VideoQueryParams,
  VideosResponse,
  VideoResponse,
  VideoUploadData,
  VideoCreateData,
  VideoUpdateData,
  DeleteVideoResponse,
  VideoCategory,
  VideoCategoriesResponse,
  VideoCategoryCreateData,
  VideoCategoryUpdateData,
  CategoryResponse,
} from "@/types/video.types";

const videoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVideos: builder.query<VideosResponse, VideoQueryParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, value.toString());
          }
        });
        return `/videos?${searchParams.toString()}`;
      },
      providesTags: (result) => [
        "Video",
        ...(result?.data.videos || []).map(({ _id }) => ({
          type: "Video" as const,
          id: _id,
        })),
      ],
    }),

    getVideo: builder.query<VideoResponse, string>({
      query: (id) => `/videos/${id}`,
      transformResponse: (response: VideoResponse) => response,
      providesTags: (_result, _error, id) => [{ type: "Video", id }],
    }),

    uploadVideo: builder.mutation<
      VideoResponse,
      { videoFile: File; thumbnailFile?: File; data: VideoUploadData }
    >({
      query: ({ videoFile, thumbnailFile, data }) => {
        const formData = new FormData();
        formData.append("video", videoFile);
        if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });
        return { url: "/videos/upload", method: "POST", body: formData };
      },
      transformResponse: (response: VideoResponse) => response,
      invalidatesTags: ["Video"],
    }),

    createVideo: builder.mutation<VideoResponse, VideoCreateData>({
      query: (data) => ({
        url: "/videos",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: VideoResponse) => response,
      invalidatesTags: ["Video"],
    }),

    updateVideo: builder.mutation<
      VideoResponse,
      { id: string; data: VideoUpdateData }
    >({
      query: ({ id, data }) => ({
        url: `/videos/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: VideoResponse) => response,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Video", id },
        "Video",
      ],
    }),

    deleteVideo: builder.mutation<DeleteVideoResponse, string>({
      query: (id) => ({
        url: `/videos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Video", id },
        "Video",
      ],
    }),

    getVideoCategories: builder.query<VideoCategory[], void>({
      query: () => "/videos/categories",
      transformResponse: (response: VideoCategoriesResponse) => response.data,
      providesTags: (result) => [
        "VideoCategory",
        ...(result || []).map(({ _id }) => ({
          type: "VideoCategory" as const,
          id: _id,
        })),
      ],
    }),

    getVideosByCategory: builder.query<
      VideosResponse,
      { category: string; limit?: number }
    >({
      query: ({ category, limit = 12 }) =>
        `/videos?category=${category}&limit=${limit}`,
      providesTags: (result, _error, { category }) => [
        { type: "Video", id: `category-${category}` },
        ...(result?.data.videos || []).map(({ _id }) => ({
          type: "Video" as const,
          id: _id,
        })),
      ],
    }),

    getVideoCategoriesWithCounts: builder.query<VideoCategory[], void>({
      query: () => "/videos/categories/counts",
      transformResponse: (response: VideoCategoriesResponse) => response.data,
      providesTags: (result) => [
        "VideoCategory",
        ...(result || []).map(({ _id }) => ({
          type: "VideoCategory" as const,
          id: _id,
        })),
      ],
    }),

    createVideoCategory: builder.mutation<
      VideoCategory,
      VideoCategoryCreateData
    >({
      query: (data) => ({
        url: "/videos/categories",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: CategoryResponse) => response.data,
      invalidatesTags: ["VideoCategory"],
    }),

    updateVideoCategory: builder.mutation<
      VideoCategory,
      { id: string; data: VideoCategoryUpdateData }
    >({
      query: ({ id, data }) => ({
        url: `/videos/categories/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: CategoryResponse) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "VideoCategory", id },
        "VideoCategory",
      ],
    }),

    deleteVideoCategory: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/videos/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "VideoCategory", id },
        "VideoCategory",
      ],
    }),
  }),
});

export const {
  useGetVideosQuery,
  useGetVideoQuery,
  useUploadVideoMutation,
  useCreateVideoMutation,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
  useGetVideoCategoriesQuery,
  useGetVideosByCategoryQuery,
  useGetVideoCategoriesWithCountsQuery,
  useCreateVideoCategoryMutation,
  useUpdateVideoCategoryMutation,
  useDeleteVideoCategoryMutation,
} = videoApi;
