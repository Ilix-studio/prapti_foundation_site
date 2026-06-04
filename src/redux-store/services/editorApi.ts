import { apiSlice } from "./apiSlice";
import { handleApiError } from "../../constants/apiConfig";
import {
  Editor,
  CreateEditorBody,
  GetEditorsResponse,
  CreateEditorResponse,
  ToggleEditorStatusResponse,
  MutationMessageResponse,
} from "@/types/editor.types";

const editorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEditors: builder.query<Editor[], void>({
      query: () => "/editor",
      transformResponse: (response: GetEditorsResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Editor" as const,
                id: _id,
              })),
              { type: "Editor", id: "LIST" },
            ]
          : [{ type: "Editor", id: "LIST" }],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    createEditor: builder.mutation<CreateEditorResponse, CreateEditorBody>({
      query: (body) => ({
        url: "/editor",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Editor", id: "LIST" }],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    toggleEditorStatus: builder.mutation<ToggleEditorStatusResponse, string>({
      query: (id) => ({
        url: `/editor/${id}/status`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Editor", id },
        { type: "Editor", id: "LIST" },
      ],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    deleteEditor: builder.mutation<MutationMessageResponse, string>({
      query: (id) => ({
        url: `/editor/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Editor", id },
        { type: "Editor", id: "LIST" },
      ],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    resendEditorCredentials: builder.mutation<MutationMessageResponse, string>({
      query: (id) => ({
        url: `/editor/${id}/resend-credentials`,
        method: "POST",
      }),
      // No cache impact — credentials are emailed, no editor field changes.
      transformErrorResponse: (response) => handleApiError(response),
    }),
  }),
});

export const {
  useGetEditorsQuery,
  useCreateEditorMutation,
  useToggleEditorStatusMutation,
  useDeleteEditorMutation,
  useResendEditorCredentialsMutation,
} = editorApi;
