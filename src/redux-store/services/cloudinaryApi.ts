import { apiSlice } from "./apiSlice";
import { handleApiError } from "../../constants/apiConfig";

export interface CloudinarySignatureResponse {
  timestamp: number;
  signature: string;
  cloudName: string;
  apiKey: string;
  folder: string;
}

export interface CloudinaryDeleteResponse {
  success: boolean;
  message: string;
}

const cloudinaryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUploadSignature: builder.mutation<
      CloudinarySignatureResponse,
      { folder?: string }
    >({
      query: (body) => ({
        url: "/cloudinary/signature",
        method: "POST",
        body,
      }),
      transformErrorResponse: (response) => handleApiError(response),
    }),

    deleteImage: builder.mutation<CloudinaryDeleteResponse, string>({
      query: (publicId) => ({
        url: `/cloudinary/${publicId}`,
        method: "DELETE",
      }),
      transformErrorResponse: (response) => handleApiError(response),
    }),
  }),
});

export const { useGetUploadSignatureMutation, useDeleteImageMutation } =
  cloudinaryApi;
