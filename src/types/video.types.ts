// Base Video interface (matching your videoModel)
export interface Video {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  date: Date;
  category: string | { _id: string; name: string; type: string }; // Can be populated or not
  duration: string;
  publicId: string;
  thumbnailPublicId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Pagination interface for videos
export interface VideoPagination {
  currentPage: number;
  totalPages: number;
  totalVideos: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

// Query parameters for getting videos
export interface VideoQueryParams {
  page?: string;
  limit?: string;
  category?: string;
  featured?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

// Video upload data interface (for file upload)
export interface VideoUploadData {
  title: string;
  description: string;
  category: string;
  date: string;
  duration: string;
}

// Create video data interface (for creating with existing URLs)
export interface VideoCreateData {
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  date: string;
  category: string;
  duration: string;
  publicId: string;
  thumbnailPublicId?: string;
}

// Update video data interface
export interface VideoUpdateData {
  title?: string;
  description?: string;
  thumbnail?: string;
  videoUrl?: string;
  date?: string;
  category?: string;
  duration?: string;
  publicId?: string;
  thumbnailPublicId?: string;
  featured?: boolean;
  tags?: string[];
  isActive?: boolean;
}

// API Response for single video
export interface VideoResponse {
  success: boolean;
  message?: string;
  data: {
    video: Video;
  };
}

// API Response for multiple videos
export interface VideosResponse {
  success: boolean;
  data: {
    videos: Video[];
    pagination: VideoPagination;
  };
}

// Delete video response
export interface DeleteVideoResponse {
  success: boolean;
  message: string;
}

// Video category interfaces
export interface VideoCategory {
  _id: string;
  name: string;
  type: "video";
  count?: number;
  createdAt?: Date;
}

// Video category create data
export interface VideoCategoryCreateData {
  name: string;
}

// Video category update data
export interface VideoCategoryUpdateData {
  name: string;
}

// API Response for video categories
export interface VideoCategoriesResponse {
  success: boolean;
  data: VideoCategory[];
}

// API Response for single category
export interface CategoryResponse {
  success: boolean;
  message?: string;
  data: VideoCategory;
}

// Video category with counts (for dashboard/stats)
export interface VideoCategoryWithCount extends VideoCategory {
  count: number;
}

// Error interface for video operations
export interface VideoError {
  success: false;
  message: string;
  error?: string;
}

// Form data interface for video upload component
export interface VideoFormData {
  title: string;
  description: string;
  category: string;
  date: string;
  duration: string;
  featured: boolean;
  tags: string;
}

// File preview interface for video upload
export interface VideoFilePreview {
  videoFile: File | null;
  thumbnailFile: File | null;
  videoPreview: string | null;
  thumbnailPreview: string | null;
}

// Video upload mode type
export type VideoUploadMode = "upload" | "url";

// Video sort options
export interface VideoSortOption {
  value: string;
  label: string;
  field: string;
  order: "asc" | "desc";
}

// Default sort options for videos
export const VIDEO_SORT_OPTIONS: VideoSortOption[] = [
  { value: "date-desc", label: "Newest First", field: "date", order: "desc" },
  { value: "date-asc", label: "Oldest First", field: "date", order: "asc" },
  { value: "title-asc", label: "Title A-Z", field: "title", order: "asc" },
  { value: "title-desc", label: "Title Z-A", field: "title", order: "desc" },
];

// Helper function to get category name
export const getVideoCategoryName = (category: Video["category"]): string => {
  if (typeof category === "string") {
    return category;
  }
  return category.name;
};

// Helper function to get category ID
export const getVideoCategoryId = (category: Video["category"]): string => {
  if (typeof category === "string") {
    return category;
  }
  return category._id;
};
