// Image interface for photo records
export interface PhotoImage {
  src: string;
  alt: string;
  cloudinaryPublicId: string;
}

// Base Photo interface (matching your photoModel)
export interface Photo {
  _id: string;
  images: PhotoImage[];
  title: string;
  category: string | { _id: string; name: string; type: string }; // Can be populated or not
  date: Date;
  location?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Pagination interface
export interface PhotoPagination {
  current: number;
  pages: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Query parameters for getting photos
export interface PhotosQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Single photo upload data (for form submission)
export interface PhotoUploadData {
  title: string;
  category: string;
  date?: string;
  location?: string;
  description?: string;
  alt: string;
}

// Multiple photos upload data (for form submission)
export interface PhotoMultipleUploadData {
  title: string;
  category: string;
  date?: string;
  location?: string;
  description?: string;
  altTexts: string[];
}

// Create photo data (for creating with existing URLs)
export interface PhotoCreateData {
  images: PhotoImage[];
  title: string;
  category: string;
  date?: string;
  location?: string;
  description?: string;
}

// Update photo data
export interface PhotoUpdateData {
  images?: PhotoImage[];
  title?: string;
  category?: string;
  date?: string;
  location?: string;
  description?: string;
  isActive?: boolean;
}

// API Response for single photo (can handle both regular and upload responses)
export interface PhotoResponse {
  success: boolean;
  message?: string;
  data:
    | Photo
    | {
        photo: Photo;
        imagesCount?: number;
      };
}

// Type guard to check if response is an upload response
export const isUploadResponse = (
  data: Photo | { photo: Photo; imagesCount?: number }
): data is { photo: Photo; imagesCount?: number } => {
  return "photo" in data && "imagesCount" in data;
};

// API Response for multiple photos
export interface PhotosResponse {
  success: boolean;
  data: {
    photos: Photo[];
    pagination: PhotoPagination;
  };
}

// Delete photo response
export interface DeletePhotoResponse {
  success: boolean;
  message: string;
}

// Error interface for photo operations
export interface PhotoError {
  success: false;
  message: string;
  error?: string;
}

// Types specifically for your React component
export interface SinglePhotoUploadData {
  title: string;
  category: string;
  date?: string;
  location?: string;
  description?: string;
  alt: string;
}

export interface MultiplePhotosUploadData {
  title: string;
  category: string;
  date?: string;
  location?: string;
  description?: string;
  altTexts: string[];
}

// File preview interface for the component
export interface FilePreview {
  file: File;
  preview: string;
  altText: string;
}

// Form data interface for the component state
export interface PhotoFormData {
  title: string;
  category: string;
  date: string;
  location: string;
  description: string;
  altText: string; // For single photo mode
}

// Upload mode type
export type UploadMode = "single" | "multiple";

// Category interface (if needed in photo context)
export interface PhotoCategory {
  _id: string;
  name: string;
  type: "photo";
  count?: number;
}
// Define the PhotoCard-compatible interface
export interface PhotoCardData {
  _id: string;
  title: string;
  description?: string;
  src: string;
  alt: string;
  date: string;
  location?: string;
  category: {
    _id: string;
    name: string;
    type: string;
  };
  createdAt: string;
  updatedAt: string;
}
