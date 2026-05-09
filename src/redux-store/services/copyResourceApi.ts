import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../constants/apiConfig";

export interface CopyImage {
  src: string;
  alt: string;
  cloudinaryPublicId: string;
}

export interface CopyPhoto {
  _id: string;
  title: string;
  description?: string;
  location?: string;
  date: string;
  images: CopyImage[];
  category: { _id: string; name: string; type: string } | string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CopyAward {
  _id: string;
  title: string;
  description: string;
  awardedDate?: string;
  isActive: boolean;
  category: { _id: string; name: string; type: string } | string;
  photos: CopyPhoto[] | string[];
  videos: any[] | string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCopyAwardBody {
  title: string;
  description: string;
  category: string;
  photos?: string[];
  videos?: string[];
  awardedDate?: string;
}

export interface UpdateCopyAwardBody extends Partial<CreateCopyAwardBody> {
  isActive?: boolean;
}

export const copyResourceApi = createApi({
  reducerPath: "copyResourceApi",
  baseQuery,
  tagTypes: ["CopyAward", "CopyPhoto"],
  endpoints: (builder) => ({
    // ----- Copy Photos -----
    getCopyPhotos: builder.query<{ success: boolean; data: CopyPhoto[] }, void>(
      {
        query: () => "/copy-photos",
        providesTags: ["CopyPhoto"],
      },
    ),
    uploadCopyPhotos: builder.mutation<
      { success: boolean; data: CopyPhoto },
      FormData
    >({
      query: (formData) => ({
        url: "/copy-photos/upload-multiple",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["CopyPhoto"],
    }),
    deleteCopyPhoto: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({ url: `/copy-photos/${id}`, method: "DELETE" }),
      invalidatesTags: ["CopyPhoto"],
    }),

    // ----- Copy Awards -----
    getCopyAwards: builder.query<{ success: boolean; data: CopyAward[] }, void>(
      {
        query: () => "/copy-awards",
        providesTags: ["CopyAward"],
      },
    ),
    getCopyAwardById: builder.query<
      { success: boolean; data: CopyAward },
      string
    >({
      query: (id) => `/copy-awards/${id}`,
      providesTags: (_r, _e, id) => [{ type: "CopyAward", id }],
    }),
    createCopyAward: builder.mutation<
      { success: boolean; data: CopyAward },
      CreateCopyAwardBody
    >({
      query: (body) => ({ url: "/copy-awards", method: "POST", body }),
      invalidatesTags: ["CopyAward"],
    }),
    updateCopyAward: builder.mutation<
      { success: boolean; data: CopyAward },
      { id: string; body: UpdateCopyAwardBody }
    >({
      query: ({ id, body }) => ({
        url: `/copy-awards/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "CopyAward", id },
        "CopyAward",
      ],
    }),
    deleteCopyAward: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({ url: `/copy-awards/${id}`, method: "DELETE" }),
      invalidatesTags: ["CopyAward"],
    }),
  }),
});

export const {
  useGetCopyPhotosQuery,
  useUploadCopyPhotosMutation,
  useDeleteCopyPhotoMutation,
  useGetCopyAwardsQuery,
  useGetCopyAwardByIdQuery,
  useCreateCopyAwardMutation,
  useUpdateCopyAwardMutation,
  useDeleteCopyAwardMutation,
} = copyResourceApi;
