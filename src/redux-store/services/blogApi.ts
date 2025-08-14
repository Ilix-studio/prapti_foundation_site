import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, handleApiError } from "../../constants/apiConfig";
import { BlogPost, BlogFormData } from "@/types/blogs.types";

// Create the blog API service
export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery,
  tagTypes: ["BlogPosts", "BlogPost"],
  endpoints: (builder) => ({
    // Get all blog posts
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

    // Get a single blog post by ID
    getBlogPostById: builder.query<BlogPost, string>({
      query: (id) => `/blogs/${id}`,
      providesTags: (_, __, id) => [{ type: "BlogPost", id }],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Get blogs by category
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

    // Create a new blog post
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

    // Update an existing blog post
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

    // Delete a blog post
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

// Export hooks for using the API endpoints
export const {
  useGetBlogPostsQuery,
  useGetBlogPostByIdQuery,
  useGetBlogsByCategoryQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
} = blogApi;
