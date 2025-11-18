// Form data for creating/updating blog posts
export interface BlogFormData {
  title: string;
  content: string;
  category: string; // Category ID or name
  image?: string;
  author?: string;
}
// Define types for blog posts
export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  category: string | { _id: string; name: string; type: string };
  image: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

// Blog API response types
export interface BlogResponse {
  success: boolean;
  message: string;
  data: BlogPost;
}

export interface BlogsResponse {
  success: boolean;
  data: BlogPost[];
}
// Helper function to get category name
export const getBlogCategoryName = (category: BlogPost["category"]): string => {
  if (!category) {
    return "Uncategorized";
  }
  if (typeof category === "string") {
    return category;
  }
  return category?.name || "Uncategorized";
};

// Helper function to get category ID
export const getBlogCategoryId = (category: BlogPost["category"]): string => {
  if (!category) {
    return "";
  }
  if (typeof category === "string") {
    return category;
  }
  return category._id || "";
};
