import { Photo } from "@/types/photo.types";
import { Video } from "@/types/video.types";

export const formatDate = (dateString: string | Date) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
// Helper function to get photo category name
export const getPhotoCategoryName = (category: Photo["category"]): string => {
  if (typeof category === "string") {
    return category;
  }
  return category.name;
};

// Helper function to get video category ID
export const getVideoCategoryId = (category: Video["category"]): string => {
  if (typeof category === "string") {
    return category;
  }
  return category._id;
};
