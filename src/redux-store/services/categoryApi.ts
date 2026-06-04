import { apiSlice } from "./apiSlice";
import {
  Category,
  CategoryCreateData,
  CategoryUpdateData,
} from "@/types/category.types";

const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategoriesByType: builder.query<
      Category[],
      "photo" | "video" | "blogs" | "award" | "rescue"
    >({
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
    }),

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
