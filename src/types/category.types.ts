export interface Category {
  createdAt: string | number | Date;
  _id: string;
  name: string;
  type: string;
  count?: number;
}

export interface CategoryCreateData {
  name: string;
  type: "photo" | "video" | "blogs" | "award" | "rescue";
}

export interface CategoryUpdateData {
  name: string;
}
// Category create data interface
export interface CategoryCreateData {
  name: string;
  type: "photo" | "video" | "blogs" | "award" | "rescue";
}

// Category update data interface
export interface CategoryUpdateData {
  name: string;
}

// API Response interfaces
export interface CategoryResponse {
  success: boolean;
  message?: string;
  data: Category;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface DeleteCategoryResponse {
  success: boolean;
  message: string;
}

// Error interface
export interface CategoryError {
  success: false;
  message: string;
  error?: string;
}
