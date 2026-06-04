import { apiSlice } from "./apiSlice";

const awardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAwards: builder.query({
      query: () => "/awards/get",
      providesTags: ["Awards"],
    }),

    getAwardById: builder.query({
      query: (id: string) => `awards/get/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Awards", id }],
    }),

    createAwardPost: builder.mutation({
      query: (body) => ({
        url: "/awards/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Awards"],
    }),

    uploadAward: builder.mutation<
      { success: boolean; message: string; data: any },
      FormData
    >({
      query: (formData) => ({
        url: "/awards/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Awards"],
    }),

    uploadMultipleAwards: builder.mutation<
      { success: boolean; message: string; data: any },
      FormData
    >({
      query: (formData) => ({
        url: "/awards/upload-multiple",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Awards"],
    }),

    updateAwardPost: builder.mutation<
      { success: boolean; message: string; data: any },
      {
        id: string;
        title?: string;
        description?: string;
        category?: string;
        imageAction?: "delete" | "updateAlt";
        imageIndex?: string;
        imageAlt?: string;
      }
    >({
      query: ({ id, ...data }) => ({
        url: `/awards/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Awards", id: arg.id },
        "Awards",
      ],
    }),

    updateAwardWithImage: builder.mutation<
      { success: boolean; message: string; data: any },
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/awards/update/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Awards", id: arg.id },
        "Awards",
      ],
    }),

    deleteAwardPost: builder.mutation({
      query: (id: string) => ({
        url: `/awards/del/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Awards"],
    }),
  }),
});

export const {
  useGetAwardsQuery,
  useGetAwardByIdQuery,
  useCreateAwardPostMutation,
  useUploadAwardMutation,
  useUploadMultipleAwardsMutation,
  useUpdateAwardPostMutation,
  useUpdateAwardWithImageMutation,
  useDeleteAwardPostMutation,
} = awardApi;
