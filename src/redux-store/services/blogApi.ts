// src/redux-store/services/blogApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../lib/apiConfig";

export interface BlogPost {
  _id: string;
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogResponse {
  success: boolean;
  count?: number;
  data: BlogPost[];
}

export interface BlogPostResponse {
  success: boolean;
  data: BlogPost;
}

export interface CreateBlogRequest {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author?: string;
}

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery,
  tagTypes: ["BlogPost"],
  endpoints: (builder) => ({
    // Get all blog posts
    getBlogPosts: builder.query<BlogPost[], void>({
      query: () => "/blogs",
      transformResponse: (response: BlogResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "BlogPost" as const,
                id: _id,
              })),
              { type: "BlogPost", id: "LIST" },
            ]
          : [{ type: "BlogPost", id: "LIST" }],
    }),

    // Get a single blog post by ID
    getBlogPostById: builder.query<BlogPost, string>({
      query: (id) => `/blogs/${id}`,
      transformResponse: (response: BlogPostResponse) => response.data,
      providesTags: (_, __, id) => [{ type: "BlogPost", id }],
    }),

    // Create a new blog post
    createBlogPost: builder.mutation<BlogPost, CreateBlogRequest>({
      query: (blogPost) => ({
        url: "/blogs/create",
        method: "POST",
        body: blogPost,
      }),
      transformResponse: (response: BlogPostResponse) => response.data,
      invalidatesTags: [{ type: "BlogPost", id: "LIST" }],
    }),

    // Update a blog post
    updateBlogPost: builder.mutation<
      BlogPost,
      { id: string; data: Partial<CreateBlogRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/blogs/update/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: BlogPostResponse) => response.data,
      invalidatesTags: (_, __, { id }) => [
        { type: "BlogPost", id },
        { type: "BlogPost", id: "LIST" },
      ],
    }),

    // Delete a blog post
    deleteBlogPost: builder.mutation<void, string>({
      query: (id) => ({
        url: `/blogs/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "BlogPost", id },
        { type: "BlogPost", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetBlogPostsQuery,
  useGetBlogPostByIdQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
} = blogApi;
