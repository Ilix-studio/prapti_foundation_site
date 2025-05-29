// src/redux-store/services/cloudinaryApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, handleApiError } from "../../lib/apiConfig";

// Define the response type for the signature
export interface CloudinarySignatureResponse {
  timestamp: number;
  signature: string;
  cloudName: string;
  apiKey: string;
  folder: string;
}

// Define the response type for image deletion
export interface CloudinaryDeleteResponse {
  success: boolean;
  message: string;
}

// Create the Cloudinary API slice
export const cloudinaryApi = createApi({
  reducerPath: "cloudinaryApi",
  baseQuery,
  endpoints: (builder) => ({
    // Get upload signature
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

    // Delete image
    deleteImage: builder.mutation<CloudinaryDeleteResponse, string>({
      query: (publicId) => ({
        url: `/cloudinary/${publicId}`,
        method: "DELETE",
      }),
      transformErrorResponse: (response) => handleApiError(response),
    }),
  }),
});

// Export hooks for using the API endpoints
export const { useGetUploadSignatureMutation, useDeleteImageMutation } =
  cloudinaryApi;
