// src/services/cloudinaryService.ts

import { API_CONFIG } from "@/lib/apiConfig";

// Interface for signature response
export interface CloudinarySignature {
  timestamp: number;
  signature: string;
  cloudName: string;
  apiKey: string;
  folder: string;
}

// Interface for upload response
export interface CloudinaryUploadResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  url: string;
  secure_url: string;
}

/**
 * Service for handling Cloudinary uploads
 */
class CloudinaryService {
  /**
   * Get a signature for authenticated Cloudinary uploads
   * @param token JWT authentication token
   * @param folder Optional folder path in Cloudinary
   * @returns CloudinarySignature object with upload credentials
   */
  async getUploadSignature(
    token: string,
    folder = "prapti-foundation-images"
  ): Promise<CloudinarySignature> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/cloudinary/signature`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ folder }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to get Cloudinary signature"
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting upload signature:", error);
      throw error;
    }
  }

  /**
   * Upload an image to Cloudinary using signed upload
   * @param file Image file to upload
   * @param signature Signature data from getUploadSignature
   * @returns Cloudinary upload response
   */
  async uploadImage(
    file: File,
    signature: CloudinarySignature
  ): Promise<CloudinaryUploadResponse> {
    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signature.apiKey);
      formData.append("timestamp", signature.timestamp.toString());
      formData.append("signature", signature.signature);
      formData.append("folder", signature.folder);

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || "Failed to upload to Cloudinary"
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw error;
    }
  }

  /**
   * Delete an image from Cloudinary
   * @param token JWT authentication token
   * @param publicId Cloudinary public ID of the image
   * @returns Success response
   */
  async deleteImage(
    token: string,
    publicId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/cloudinary/${publicId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete image");
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
      throw error;
    }
  }

  /**
   * Extract public ID from a Cloudinary URL
   * @param url Cloudinary URL
   * @returns Public ID or null if not a Cloudinary URL
   */
  extractPublicId(url: string): string | null {
    if (!url || !url.includes("cloudinary.com")) {
      return null;
    }

    try {
      const urlParts = url.split("/");
      const uploadIndex = urlParts.indexOf("upload");

      if (uploadIndex !== -1 && urlParts.length > uploadIndex + 2) {
        // Get everything after 'upload/v{version}/'
        const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join("/");
        // Remove file extension
        return publicIdWithExtension.replace(/\.[^/.]+$/, "");
      }

      return null;
    } catch (error) {
      console.error("Error extracting public ID:", error);
      return null;
    }
  }
}

export default new CloudinaryService();
