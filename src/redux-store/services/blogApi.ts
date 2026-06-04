import { apiSlice } from "./apiSlice";
import { handleApiError } from "../../constants/apiConfig";
import { BlogPost, BlogFormData } from "@/types/blogs.types";

const blogApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBlogPosts: builder.query<BlogPost[], void>({
      query: () => "/blogs/getAll",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "BlogPosts" as const,
                id: _id,
              })),
              { type: "BlogPosts", id: "LIST" },
            ]
          : [{ type: "BlogPosts", id: "LIST" }],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    getBlogPostById: builder.query<BlogPost, string>({
      query: (id) => `/blogs/${id}`,
      providesTags: (_, __, id) => [{ type: "BlogPost", id }],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    getBlogsByCategory: builder.query<BlogPost[], string>({
      query: (categoryId) => `/blogs?category=${categoryId}`,
      providesTags: (result, _error, categoryId) => [
        { type: "BlogPosts", id: `category-${categoryId}` },
        ...(result || []).map(({ _id }) => ({
          type: "BlogPosts" as const,
          id: _id,
        })),
      ],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    createBlogPost: builder.mutation<
      { success: boolean; message: string; data: BlogPost },
      BlogFormData
    >({
      query: (data) => ({
        url: "/blogs/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "BlogPosts", id: "LIST" }],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    updateBlogPost: builder.mutation<
      { success: boolean; message: string; data: BlogPost },
      { id: string; data: Partial<BlogFormData> }
    >({
      query: ({ id, data }) => ({
        url: `/blogs/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "BlogPosts", id: "LIST" },
        { type: "BlogPost", id },
      ],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    deleteBlogPost: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/blogs/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "BlogPosts", id: "LIST" }],
      transformErrorResponse: (response) => handleApiError(response),
    }),
  }),
});

export const {
  useGetBlogPostsQuery,
  useGetBlogPostByIdQuery,
  useGetBlogsByCategoryQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
} = blogApi;
