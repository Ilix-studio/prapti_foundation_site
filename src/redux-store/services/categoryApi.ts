import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../lib/apiConfig";
import {
  Category,
  CategoryCreateData,
  CategoryUpdateData,
} from "@/types/category.types";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery,
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    // Get categories by type (Public)
    getCategoriesByType: builder.query<Category[], "photo" | "video" | "press">(
      {
        query: (type) => `/categories/${type}`,
        transformResponse: (response: { success: boolean; data: Category[] }) =>
          response.data,
        providesTags: (result, _error, type) => [
          { type: "Category", id: type },
          ...(result || []).map(({ _id }) => ({
            type: "Category" as const,
            id: _id,
          })),
        ],
      }
    ),

    // Get all categories (Admin only)
    getAllCategories: builder.query<Category[], void>({
      query: () => "/categories",
      transformResponse: (response: { success: boolean; data: Category[] }) =>
        response.data,
      providesTags: (result) => [
        "Category",
        ...(result || []).map(({ _id }) => ({
          type: "Category" as const,
          id: _id,
        })),
      ],
    }),

    // Create category (Admin only)
    createCategory: builder.mutation<Category, CategoryCreateData>({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: {
        success: boolean;
        message: string;
        data: Category;
      }) => response.data,
      invalidatesTags: ["Category"],
    }),

    // Update category (Admin only)
    updateCategory: builder.mutation<
      Category,
      { id: string; data: CategoryUpdateData }
    >({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: {
        success: boolean;
        message: string;
        data: Category;
      }) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Category", id },
        "Category",
      ],
    }),

    // Delete category (Admin only)
    deleteCategory: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Category", id },
        "Category",
      ],
    }),
  }),
});

export const {
  useGetCategoriesByTypeQuery,
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
