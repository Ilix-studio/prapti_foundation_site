import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../constants/apiConfig";

export const awardApi = createApi({
  reducerPath: "awardApi",
  baseQuery,
  tagTypes: ["Awards"],

  endpoints: (builder) => ({
    // GET /get
    getAwards: builder.query({
      query: () => "/awards/get",
      providesTags: ["Awards"],
    }),

    // GET /get/:id
    getAwardById: builder.query({
      query: (id: string) => `awards/get/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Awards", id }],
    }),

    // POST /create
    createAwardPost: builder.mutation({
      query: (body) => ({
        url: "/awards/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Awards"],
    }),

    // POST /upload (single image)
    uploadAward: builder.mutation({
      query: (formData: FormData) => ({
        url: "/awards/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Awards"],
    }),

    // POST /upload-multiple
    uploadMultipleAwards: builder.mutation({
      query: (formData: FormData) => ({
        url: "/awards/upload-multiple",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Awards"],
    }),

    // PATCH /update/:id
    updateAwardPost: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/awards/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Awards", id: arg.id }],
    }),

    // DELETE /del/:id
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
  useDeleteAwardPostMutation,
} = awardApi;
