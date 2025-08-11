import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Loader2,
  Calendar,
  MapPin,
  FileText,
  Tag,
  Save,
  ArrowLeft,
  AlertCircle,
  X,
  Upload,
  ImagePlus,
  Plus,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import API hooks
import {
  useGetPhotoQuery,
  useUpdatePhotoMutation,
  useUploadPhotoMutation,
} from "@/redux-store/services/photoApi";
import {
  useGetCategoriesByTypeQuery,
  useCreateCategoryMutation,
} from "@/redux-store/services/categoryApi";
import { Photo, PhotoUpdateData } from "@/types/photo.types";
import { BackNavigation } from "@/config/navigation/BackNavigation";

interface EditFormData {
  title: string;
  category: string;
  date: string;
  location: string;
  description: string;
  isActive: boolean;
}

interface FilePreview {
  file: File;
  preview: string;
  altText: string;
}

const EditPhoto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState<EditFormData>({
    title: "",
    category: "",
    date: "",
    location: "",
    description: "",
    isActive: true,
  });

  // Image management state
  const [currentImages, setCurrentImages] = useState<any[]>([]);
  const [newImages, setNewImages] = useState<FilePreview[]>([]);
  const [removedImageIndices, setRemovedImageIndices] = useState<Set<number>>(
    new Set()
  );

  // Category management state
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // API hooks
  const {
    data: photoData,
    isLoading: isLoadingPhoto,
    error: photoError,
  } = useGetPhotoQuery(id!);

  const { data: categories = [], isLoading: isLoadingCategories } =
    useGetCategoriesByTypeQuery("photo");

  const [updatePhoto, { isLoading: isUpdating }] = useUpdatePhotoMutation();
  const [uploadPhoto, { isLoading: isUploading }] = useUploadPhotoMutation();
  const [createCategory, { isLoading: creatingCategory }] =
    useCreateCategoryMutation();

  // Helper functions
  const getCategoryId = (category: Photo["category"]): string => {
    if (typeof category === "string") {
      return category;
    }
    return category._id;
  };

  const formatDateForInput = (date: Date | string): string => {
    const dateObj = new Date(date);
    return dateObj.toISOString().split("T")[0];
  };

  // Initialize form data when photo loads
  useEffect(() => {
    if (photoData?.success) {
      const photo =
        "photo" in photoData.data ? photoData.data.photo : photoData.data;

      setFormData({
        title: photo.title,
        category: getCategoryId(photo.category),
        date: formatDateForInput(photo.date),
        location: photo.location || "",
        description: photo.description || "",
        isActive: photo.isActive,
      });

      // Initialize current images
      setCurrentImages(photo.images || []);
    }
  }, [photoData]);

  // Handle removing current photos
  const handleRemoveCurrentImage = (index: number) => {
    setRemovedImageIndices((prev) => new Set([...prev, index]));
  };

  // Handle restoring removed photos
  const handleRestoreImage = (index: number) => {
    setRemovedImageIndices((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Validate file types
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast.error(`${file.name} is too large. Maximum size is 10MB`);
        return false;
      }
      return true;
    });

    // Create previews for valid files
    validFiles.forEach((file) => {
      const preview = URL.createObjectURL(file);
      setNewImages((prev) => [
        ...prev,
        {
          file,
          preview,
          altText: file.name.split(".")[0], // Use filename without extension as default alt text
        },
      ]);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle removing new images
  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => {
      const newArray = [...prev];
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(newArray[index].preview);
      newArray.splice(index, 1);
      return newArray;
    });
  };

  // Create new category
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      const result = await createCategory({
        name: newCategoryName.trim(),
        type: "photo",
      }).unwrap();

      toast.success("Category created successfully");
      setNewCategoryName("");
      setShowAddCategory(false);

      // Auto-select the newly created category
      setFormData((prev) => ({ ...prev, category: result._id }));
    } catch (error: any) {
      console.error("Create category error:", error);
      toast.error(
        error?.data?.message || error?.message || "Failed to create category"
      );
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    // Check if all images are removed and no new images added
    const remainingCurrentImages = currentImages.filter(
      (_, index) => !removedImageIndices.has(index)
    );

    if (remainingCurrentImages.length === 0 && newImages.length === 0) {
      toast.error("Please keep at least one image or add new images");
      return;
    }

    try {
      // First upload new images if any
      if (newImages.length > 0) {
        for (const newImage of newImages) {
          await uploadPhoto({
            file: newImage.file,
            data: {
              title: formData.title,
              category: formData.category,
              date: formData.date,
              location: formData.location,
              description: formData.description,
              alt: newImage.altText,
            },
          }).unwrap();
        }
      }

      // Update the main photo data
      const updateData: PhotoUpdateData = {
        title: formData.title,
        category: formData.category,
        date: formData.date,
        location: formData.location || undefined,
        description: formData.description || undefined,
        isActive: formData.isActive,
        // Include removed image indices if your API supports it
        // removedImageIndices: Array.from(removedImageIndices),
      };

      await updatePhoto({
        id: id!,
        data: updateData,
      }).unwrap();

      toast.success("Photo updated successfully!");

      // Clean up previews
      newImages.forEach((image) => URL.revokeObjectURL(image.preview));

      navigate("/admin/photoDashboard");
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error?.data?.message || error?.message || "Update failed");
    }
  };

  // Calculate if we should show upload input
  const remainingCurrentImages = currentImages.filter(
    (_, index) => !removedImageIndices.has(index)
  );
  const showUploadInput =
    remainingCurrentImages.length === 0 || newImages.length > 0;

  if (!id) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 flex items-center justify-center'>
        <Alert variant='destructive' className='max-w-md'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>Photo ID not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoadingPhoto || isLoadingCategories) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4'>
        <BackNavigation />
        <div className='max-w-4xl mx-auto space-y-6'>
          <Skeleton className='h-10 w-48' />
          <Card>
            <CardHeader>
              <Skeleton className='h-8 w-64' />
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
              </div>
              <Skeleton className='h-20 w-full' />
              <Skeleton className='h-10 w-full' />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (photoError || !photoData?.success) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4'>
        <BackNavigation />
        <div className='flex items-center justify-center min-h-[50vh]'>
          <Alert variant='destructive' className='max-w-md'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              Failed to load photo. Please try again.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <>
      <BackNavigation />

      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4'>
        <div className='max-w-4xl mx-auto'>
          <Card className='shadow-lg border border-gray-200 overflow-hidden'>
            {/* Header */}
            <CardHeader className='bg-gradient-to-r from-white to-white'>
              <CardTitle className='text-2xl font-bold text-black flex items-center gap-2'>
                <FileText className='w-6 h-6' />
                Edit Photo
              </CardTitle>
              <p className='text-black/90'>
                Update photo information and settings
              </p>
            </CardHeader>

            <CardContent className='p-6'>
              {/* Current Images Display */}
              <div className='mb-6'>
                <h3 className='text-lg font-semibold mb-3'>Current Images</h3>
                {currentImages.length > 0 ? (
                  <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {currentImages.map((image, index) => (
                      <div key={index} className='relative group'>
                        <div
                          className={`relative ${
                            removedImageIndices.has(index) ? "opacity-50" : ""
                          }`}
                        >
                          <img
                            src={image.src}
                            alt={image.alt}
                            className='w-full h-24 object-cover rounded-lg shadow-md'
                          />
                          <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg' />
                          <div className='absolute bottom-1 right-1 bg-black/50 text-white px-1 py-0.5 rounded text-xs'>
                            {index + 1}
                          </div>
                        </div>

                        {/* Remove/Restore button */}
                        <div className='absolute top-1 right-1'>
                          {removedImageIndices.has(index) ? (
                            <Button
                              type='button'
                              size='sm'
                              variant='secondary'
                              onClick={() => handleRestoreImage(index)}
                              className='h-6 w-6 p-0 bg-green-600 hover:bg-green-700 text-white'
                            >
                              <Upload className='h-3 w-3' />
                            </Button>
                          ) : (
                            <Button
                              type='button'
                              size='sm'
                              variant='destructive'
                              onClick={() => handleRemoveCurrentImage(index)}
                              className='h-6 w-6 p-0'
                            >
                              <X className='h-3 w-3' />
                            </Button>
                          )}
                        </div>

                        {/* Removed overlay */}
                        {removedImageIndices.has(index) && (
                          <div className='absolute inset-0 bg-red-500 bg-opacity-20 rounded-lg flex items-center justify-center'>
                            <span className='text-red-700 font-semibold text-xs bg-white px-2 py-1 rounded'>
                              REMOVED
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-gray-500 text-center py-4'>
                    No current images available
                  </p>
                )}
              </div>

              {/* New Images Display */}
              {newImages.length > 0 && (
                <div className='mb-6'>
                  <h3 className='text-lg font-semibold mb-3 text-green-700'>
                    New Images to Upload
                  </h3>
                  <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {newImages.map((image, index) => (
                      <div key={index} className='relative group'>
                        <img
                          src={image.preview}
                          alt={image.altText}
                          className='w-full h-24 object-cover rounded-lg shadow-md border-2 border-green-200'
                        />
                        <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg' />
                        {/* Remove button */}
                        <Button
                          type='button'
                          size='sm'
                          variant='destructive'
                          onClick={() => handleRemoveNewImage(index)}
                          className='absolute top-1 right-1 h-6 w-6 p-0'
                        >
                          <X className='h-3 w-3' />
                        </Button>
                        {/* New label */}
                        <div className='absolute bottom-1 left-1 bg-green-600 text-white px-2 py-0.5 rounded text-xs'>
                          NEW
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Input - Show conditionally */}
              {showUploadInput && (
                <div className='mb-6'>
                  <h3 className='text-lg font-semibold mb-3'>
                    {remainingCurrentImages.length === 0
                      ? "Add New Images (Required)"
                      : "Add Additional Images"}
                  </h3>
                  <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors'>
                    <input
                      ref={fileInputRef}
                      type='file'
                      accept='image/*'
                      multiple
                      onChange={handleFileSelect}
                      className='hidden'
                      id='image-upload'
                    />
                    <label
                      htmlFor='image-upload'
                      className='cursor-pointer flex flex-col items-center gap-2'
                    >
                      <ImagePlus className='w-8 h-8 text-gray-400' />
                      <span className='text-gray-600'>
                        Click to upload images or drag and drop
                      </span>
                      <span className='text-sm text-gray-500'>
                        PNG, JPG, GIF up to 10MB each
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Add Upload Button when there are current images */}
              {remainingCurrentImages.length > 0 && newImages.length === 0 && (
                <div className='mb-6 text-center'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => fileInputRef.current?.click()}
                    className='border-dashed border-2'
                  >
                    <ImagePlus className='w-4 h-4 mr-2' />
                    Add More Images
                  </Button>
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    multiple
                    onChange={handleFileSelect}
                    className='hidden'
                  />
                </div>
              )}

              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Form Fields */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* Title */}
                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      <FileText className='w-4 h-4 inline mr-1' />
                      Title *
                    </label>
                    <Input
                      name='title'
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder='Enter photo title'
                      className='focus:ring-2 focus:ring-blue-500'
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      <Tag className='w-4 h-4 inline mr-1' />
                      Category *
                    </label>
                    <div className='flex gap-2'>
                      <select
                        name='category'
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        disabled={isLoadingCategories}
                        className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      >
                        <option value=''>Select Category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <Button
                        type='button'
                        onClick={() => setShowAddCategory(!showAddCategory)}
                        className='px-3 py-2 bg-green-600 hover:bg-green-700'
                        title='Add new category'
                      >
                        <Plus className='w-4 h-4' />
                      </Button>
                    </div>

                    {/* Add Category Input */}
                    {showAddCategory && (
                      <div className='mt-2 p-3 bg-gray-50 rounded-lg border'>
                        <div className='flex gap-2'>
                          <Input
                            type='text'
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder='Enter category name'
                            className='flex-1'
                            onKeyPress={(e) =>
                              e.key === "Enter" && handleCreateCategory()
                            }
                          />
                          <Button
                            type='button'
                            onClick={handleCreateCategory}
                            disabled={creatingCategory}
                            className='px-3 py-2 bg-green-600 hover:bg-green-700'
                          >
                            {creatingCategory ? (
                              <Loader2 className='w-4 h-4 animate-spin' />
                            ) : (
                              <Check className='w-4 h-4' />
                            )}
                          </Button>
                          <Button
                            type='button'
                            onClick={() => {
                              setShowAddCategory(false);
                              setNewCategoryName("");
                            }}
                            variant='outline'
                            className='px-3 py-2'
                          >
                            <X className='w-4 h-4' />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      <Calendar className='w-4 h-4 inline mr-1' />
                      Date
                    </label>
                    <Input
                      type='date'
                      name='date'
                      value={formData.date}
                      onChange={handleInputChange}
                      className='focus:ring-2 focus:ring-blue-500'
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      <MapPin className='w-4 h-4 inline mr-1' />
                      Location
                    </label>
                    <Input
                      name='location'
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder='Enter location'
                      className='focus:ring-2 focus:ring-blue-500'
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Status
                    </label>
                    <Select
                      value={formData.isActive.toString()}
                      onValueChange={(value) =>
                        handleSelectChange(
                          "isActive",
                          value === "true" ? "true" : "false"
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='true'>Active</SelectItem>
                        <SelectItem value='false'>Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Description
                    </label>
                    <textarea
                      name='description'
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
                      placeholder='Enter description (optional)'
                    />
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className='flex flex-col sm:flex-row gap-3 pt-6 border-t'>
                  <Button
                    type='submit'
                    disabled={isUpdating || isUploading}
                    className='flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                  >
                    {isUpdating || isUploading ? (
                      <>
                        <Loader2 className='w-5 h-5 animate-spin mr-2' />
                        {isUploading ? "Uploading..." : "Updating..."}
                      </>
                    ) : (
                      <>
                        <Save className='w-5 h-5 mr-2' />
                        Update Photo
                      </>
                    )}
                  </Button>

                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => navigate("/admin/photoDashboard")}
                    className='px-6 py-3'
                  >
                    <ArrowLeft className='w-4 h-4 mr-2' />
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default EditPhoto;
