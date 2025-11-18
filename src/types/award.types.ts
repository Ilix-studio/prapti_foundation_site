import { PhotoImage } from "./photo.types";

// Form data for creating/updating blog posts
export interface AwardFormData {
  title: string;
  description: string;
  category: string;
  images: PhotoImage[];
}

// Define types for blog posts
export interface AwardPost {
  _id: string;
  title: string;
  description: string;
  category: string | { _id: string; name: string; type: string };
  images: PhotoImage[];
  createdAt: string;
  updatedAt: string;
}
// Single photo upload data (for form submission)
export interface AwardPhotoUploadData {
  title: string;
  description: string;
  category: string;
  alt: string;
}
// Multiple photos upload data (for form submission)
export interface AwardPhotoMultipleUploadData {
  title: string;
  description: string;
  category: string;
  altTexts: string[];
}
// Helper function to get category name
export const getAwardCategoryName = (
  category: AwardPost["category"]
): string => {
  if (!category) {
    return "Uncategorized";
  }
  if (typeof category === "string") {
    return category;
  }
  return category?.name || "Uncategorized";
};

// Helper function to get category ID
export const getAwardCategoryId = (category: AwardPost["category"]): string => {
  if (!category) {
    return "";
  }
  if (typeof category === "string") {
    return category;
  }
  return category._id || "";
};
