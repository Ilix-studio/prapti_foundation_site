// src/redux-store/services/contactApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, handleApiError } from "../../lib/apiConfig";

// Define types for contact messages
export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessagesResponse {
  success: boolean;
  data: ContactMessage[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
  unreadCount: number;
}

export interface ContactMessageResponse {
  success: boolean;
  data: ContactMessage;
}

export interface SendMessageResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    subject: string;
    createdAt: string;
  };
}

export interface MarkAsReadRequest {
  id: string;
  isRead: boolean;
}

export interface GetMessagesParams {
  page?: number;
  limit?: number;
  read?: boolean;
}

// Create the contact API service
export const contactApi = createApi({
  reducerPath: "contactApi",
  baseQuery,
  tagTypes: ["ContactMessages", "ContactMessage"],
  endpoints: (builder) => ({
    // Send contact message (Public)
    sendContactMessage: builder.mutation<SendMessageResponse, ContactFormData>({
      query: (data) => ({
        url: "/messages/send",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "ContactMessages", id: "LIST" }],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Get all contact messages (Admin only)
    getContactMessages: builder.query<
      ContactMessagesResponse,
      GetMessagesParams | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params?.page) searchParams.append("page", params.page.toString());
        if (params?.limit)
          searchParams.append("limit", params.limit.toString());
        if (params?.read !== undefined)
          searchParams.append("read", params.read.toString());

        const queryString = searchParams.toString();
        return `/messages/get${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: "ContactMessages" as const,
                id: _id,
              })),
              { type: "ContactMessages", id: "LIST" },
            ]
          : [{ type: "ContactMessages", id: "LIST" }],
      transformErrorResponse: (response) => handleApiError(response),
    }),
    // Get contact message by ID (Admin only)
    getContactMessageById: builder.query<ContactMessageResponse, string>({
      query: (id) => `/messages/${id}`,
      providesTags: (_, __, id) => [{ type: "ContactMessage", id }],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Mark message as read/unread (Admin only)
    markMessageAsRead: builder.mutation<
      ContactMessageResponse,
      MarkAsReadRequest
    >({
      query: ({ id, isRead }) => ({
        url: `/messages/${id}/read`,
        method: "PATCH",
        body: { isRead },
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "ContactMessages", id: "LIST" },
        { type: "ContactMessage", id },
      ],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Delete contact message (Admin only)
    deleteContactMessage: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/messages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "ContactMessages", id: "LIST" }],
      transformErrorResponse: (response) => handleApiError(response),
    }),
  }),
});

// Export hooks for using the API endpoints
export const {
  useSendContactMessageMutation,
  useGetContactMessagesQuery,
  useGetContactMessageByIdQuery,
  useMarkMessageAsReadMutation,
  useDeleteContactMessageMutation,
} = contactApi;
