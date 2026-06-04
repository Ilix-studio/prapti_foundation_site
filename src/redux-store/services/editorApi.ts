import { apiSlice } from "./apiSlice";
import { handleApiError } from "../../constants/apiConfig";
import {
  Editor,
  CreateEditorBody,
  GetEditorsResponse,
  CreateEditorResponse,
  ToggleEditorStatusResponse,
  MutationMessageResponse,
  EditorLoginResponse,
  EditorLoginRequest,
} from "@/types/editor.types";
import { loginSuccess, logout, User } from "../slices/authSlice";

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
    loginEditor: builder.mutation<EditorLoginResponse, EditorLoginRequest>({
      query: (credentials) => ({
        url: "/editor/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            const userData: User = {
              id: data.data.id,
              name: data.data.name,
              email: data.data.email,
              role: data.data.role,
            };
            dispatch(loginSuccess({ user: userData, token: data.data.token }));
          }
        } catch (error) {
          console.error("Editor login failed:", error);
        }
      },
      transformErrorResponse: (response) => handleApiError(response),
    }),

    logoutEditor: builder.mutation<{ success: boolean; message: string }, void>(
      {
        query: () => ({
          url: "/editor/logout",
          method: "POST",
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(logout());
          } catch (error) {
            console.error("Editor logout failed:", error);
          }
        },
        transformErrorResponse: (response) => handleApiError(response),
      },
    ),
  }),
});

export const {
  useGetEditorsQuery,
  useCreateEditorMutation,
  useToggleEditorStatusMutation,
  useDeleteEditorMutation,
  useResendEditorCredentialsMutation,
  useLoginEditorMutation,
  useLogoutEditorMutation,
} = editorApi;
