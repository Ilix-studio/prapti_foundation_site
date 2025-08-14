// src/components/ImageUpload.tsx
import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Image, Upload, Loader2, X } from "lucide-react";
import { useGetUploadSignatureMutation } from "@/redux-store/services/cloudinaryApi";
import { selectAuth } from "@/redux-store/slices/authSlice";
import cloudinaryService from "@/redux-store/slices/cloudinaryService";

interface ImageUploadProps {
  currentImageUrl: string;
  onImageUploaded: (imageUrl: string) => void;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl,
  onImageUploaded,
  label = "Image",
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { token } = useSelector(selectAuth);
  const [getUploadSignature] = useGetUploadSignatureMutation();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPEG, PNG, etc.)");
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Get signature for Cloudinary upload
      if (!token) {
        throw new Error("Authentication required for image upload");
      }

      // Get upload signature from our API
      const signatureData = await getUploadSignature({
        folder: "prapti-foundation-images",
      }).unwrap();

      // Upload image to Cloudinary
      const uploadResult = await cloudinaryService.uploadImage(
        file,
        signatureData
      );

      // Call the callback with the secure URL
      onImageUploaded(uploadResult.secure_url);

      // Cleanup object URL
      URL.revokeObjectURL(objectUrl);
    } catch (err: any) {
      console.error("Image upload error:", err);
      setError(err.message || "Failed to upload image. Please try again.");
      // Revert to previous image if there's an error
      setPreviewUrl(currentImageUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl("");
    onImageUploaded("");
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <Label htmlFor='image-upload'>{label}</Label>
        {isUploading && (
          <div className='flex items-center text-sm text-amber-600'>
            <Loader2 className='h-3 w-3 animate-spin mr-1' />
            Uploading...
          </div>
        )}
      </div>

      {error && (
        <div className='text-sm text-red-500 bg-red-50 p-2 rounded'>
          {error}
        </div>
      )}

      {previewUrl ? (
        <div className='relative rounded-md overflow-hidden border border-gray-200'>
          <img
            src={previewUrl}
            alt='Preview'
            className='w-full h-48 object-cover'
          />
          <Button
            type='button'
            variant='destructive'
            size='icon'
            className='absolute top-2 right-2 h-8 w-8 rounded-full opacity-90'
            onClick={handleRemoveImage}
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      ) : (
        <div className='border-2 border-dashed border-gray-300 rounded-md p-8 text-center'>
          <Image className='h-8 w-8 mx-auto text-gray-400' />
          <p className='mt-2 text-sm text-gray-500'>No image selected</p>
        </div>
      )}

      <div className='flex items-center gap-2'>
        <Input
          id='image-upload'
          type='file'
          ref={fileInputRef}
          onChange={handleFileChange}
          accept='image/*'
          className='hidden'
          disabled={isUploading}
        />
        <Button
          type='button'
          variant='outline'
          className='w-full'
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className='h-4 w-4 mr-2' />
          {previewUrl ? "Change Image" : "Upload Image"}
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
