// types/cloudinary.ts
export interface CloudinaryImage {
  src: string;
  alt: string;
  cloudinaryPublicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface CloudinarySignatureResponse {
  timestamp: number;
  signature: string;
  cloudName: string;
  apiKey: string;
  folder: string;
}

export interface CloudinaryUploadSingleRequest {
  file: File;
  folder?: string;
  alt?: string;
}

export interface CloudinaryUploadSingleResponse {
  success: boolean;
  message: string;
  data: CloudinaryImage;
}

export interface CloudinaryUploadMultipleRequest {
  files: File[];
  folder?: string;
  altTexts?: string[];
}

export interface CloudinaryUploadMultipleResponse {
  success: boolean;
  message: string;
  data: {
    images: CloudinaryImage[];
    count: number;
  };
}

export interface CloudinaryDeleteMultipleRequest {
  publicIds: string[];
}

export interface CloudinaryDeleteResult {
  publicId: string;
  result: string;
  success: boolean;
}

export interface CloudinaryDeleteMultipleResponse {
  success: boolean;
  message: string;
  data: {
    successful: CloudinaryDeleteResult[];
    failed: Array<{
      publicId: string;
      error: string;
    }>;
    totalRequested: number;
    successCount: number;
    failedCount: number;
  };
}

export interface CloudinaryDeleteSingleResponse {
  success: boolean;
  message: string;
  data: {
    publicId: string;
    result: string;
  };
}

export interface CloudinaryImageDetails {
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  createdAt: string;
  folder: string;
}

export interface CloudinaryImageDetailsResponse {
  success: boolean;
  data: CloudinaryImageDetails;
}

export interface CloudinaryFolderImage {
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  createdAt: string;
}

export interface CloudinaryListFolderResponse {
  success: boolean;
  data: {
    folder: string;
    images: CloudinaryFolderImage[];
    count: number;
    totalCount: number;
  };
}
