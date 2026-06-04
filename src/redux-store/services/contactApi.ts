import { apiSlice } from "./apiSlice";
import { handleApiError } from "../../constants/apiConfig";
import {
  ContactFormData,
  ContactMessageResponse,
  ContactMessagesResponse,
  GetMessagesParams,
  MarkAsReadRequest,
  SendMessageResponse,
} from "@/types/contact.types";

const contactApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendContactMessage: builder.mutation<SendMessageResponse, ContactFormData>({
      query: (data) => ({
        url: "/messages/send",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "ContactMessages", id: "LIST" }],
      transformErrorResponse: (response) => handleApiError(response),
    }),

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

    getContactMessageById: builder.query<ContactMessageResponse, string>({
      query: (id) => `/messages/${id}`,
      providesTags: (_, __, id) => [{ type: "ContactMessage", id }],
      transformErrorResponse: (response) => handleApiError(response),
    }),

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

export const {
  useSendContactMessageMutation,
  useGetContactMessagesQuery,
  useGetContactMessageByIdQuery,
  useMarkMessageAsReadMutation,
  useDeleteContactMessageMutation,
} = contactApi;
