import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

// Define Blog Post types
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image: string;
}

export interface CreateBlogPostRequest {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
}

// For now, we'll use a mock API base URL
// In a real application, this would point to your actual API
const API_URL = "/api";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the auth state
      const token = (getState() as RootState).auth.token;

      // If we have a token, add it to the headers
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["BlogPost"],
  endpoints: (builder) => ({
    // Get all blog posts
    getBlogPosts: builder.query<BlogPost[], void>({
      // In a real app, this would be a real API endpoint
      // For this example, we'll mock it with a function that returns data from our mock data
      queryFn: () => {
        // This is where you would normally fetch from an API
        // We're just returning mock data for now
        const mockData = require("../../mockdata/BlogData").blogPosts;
        return { data: mockData };
      },
      providesTags: ["BlogPost"],
    }),

    // Get a single blog post by ID
    getBlogPost: builder.query<BlogPost, string>({
      queryFn: (id) => {
        const mockData = require("../../mockdata/BlogData").blogPosts;
        const post = mockData.find((post: BlogPost) => post.id === id);
        return post
          ? { data: post }
          : { error: { status: 404, data: "Post not found" } };
      },
      providesTags: (_result, _error, id) => [{ type: "BlogPost", id }],
    }),

    // Create a new blog post
    createBlogPost: builder.mutation<BlogPost, CreateBlogPostRequest>({
      queryFn: (newPost) => {
        // In a real app, this would be a POST request to your API
        // For this demo, we'll just return a mock response

        // Generate a unique ID
        const id = Date.now().toString();

        // Create the new post with current date and author name from auth state
        const post: BlogPost = {
          id,
          ...newPost,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          author: "Admin User", // In a real app, get this from auth state
        };

        // In a real app, this would be saved to your database
        // For now, we'll just return the new post
        return { data: post };
      },
      invalidatesTags: ["BlogPost"],
    }),

    // Update an existing blog post
    updateBlogPost: builder.mutation<
      BlogPost,
      Partial<BlogPost> & { id: string }
    >({
      queryFn: (updateData) => {
        // In a real app, this would be a PUT/PATCH request to your API
        // For this demo, we'll just return a mock response
        return { data: updateData as BlogPost };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "BlogPost", id }],
    }),

    // Delete a blog post
    deleteBlogPost: builder.mutation<void, string>({
      queryFn: () => {
        // In a real app, this would be a DELETE request to your API
        // For this demo, we'll just return a success response
        return { data: undefined };
      },
      invalidatesTags: (_result, _error, id) => [{ type: "BlogPost", id }],
    }),
  }),
});

// Export the auto-generated hooks
export const {
  useGetBlogPostsQuery,
  useGetBlogPostQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
} = blogApi;
