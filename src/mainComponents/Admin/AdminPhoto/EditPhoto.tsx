import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  Save,
  Image,
  Loader2,
  Calendar,
  MapPin,
  AlertCircle,
  Upload,
  Trash2,
  Plus,
  Check,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectAuth, selectIsAdmin } from "@/redux-store/slices/authSlice";
import { Navigate } from "react-router-dom";
import {
  useGetPhotoQuery,
  useUpdatePhotoMutation,
  useUpdatePhotoWithFileMutation,
} from "@/redux-store/services/photoApi";
import {
  useGetCategoriesByTypeQuery,
  useCreateCategoryMutation,
} from "@/redux-store/services/categoryApi";
import { PhotoUpdateData, PhotoImage } from "@/types/photo.types";
import { BackNavigation } from "@/config/navigation/BackNavigation";

interface FilePreview {
  file: File;
  preview: string;
  altText: string;
}

const EditPhoto = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);

  const imageFileRef = useRef<HTMLInputElement>(null);

  // Fetch photo categories
  const { data: categories = [], isLoading: categoriesLoading } =
    useGetCategoriesByTypeQuery("photo");

  // Category management
  const [createCategory, { isLoading: creatingCategory }] =
    useCreateCategoryMutation();
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Form state
  const [formData, setFormData] = useState<PhotoUpdateData>({
    title: "",
    description: "",
    category: "",
    date: "",
    location: "",
    isActive: true,
  });

  const [currentImages, setCurrentImages] = useState<PhotoImage[]>([]);
  const [newImages, setNewImages] = useState<FilePreview[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<Set<string>>(
    new Set()
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/admin/login' />;
  }

  // Redirect if no ID provided
  if (!id) {
    return <Navigate to='/admin/photoDashboard' />;
  }

  const {
    data: photoData,
    isLoading: loadingPhoto,
    error: photoError,
    refetch,
  } = useGetPhotoQuery(id);

  const [updatePhoto, { isLoading: updating }] = useUpdatePhotoMutation();
  const [updatePhotoWithFile, { isLoading: updatingWithFile }] =
    useUpdatePhotoWithFileMutation();

  // Extract photo from response
  const photo = React.useMemo(() => {
    if (!photoData?.data) return null;
    return "photo" in photoData.data ? photoData.data.photo : photoData.data;
  }, [photoData]);

  // Populate form when photo data is loaded
  React.useEffect(() => {
    if (photo) {
      const formattedDate = new Date(photo.date).toISOString().split("T")[0];

      setFormData({
        title: photo.title,
        description: photo.description || "",
        category:
          typeof photo.category === "string"
            ? photo.category
            : photo.category._id,
        date: formattedDate,
        location: photo.location || "",
        isActive: photo.isActive,
      });

      setCurrentImages(photo.images || []);
    }
  }, [photo]);

  // Create new category
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setErrors((prev) => ({
        ...prev,
        category: "Please enter a category name",
      }));
      return;
    }

    try {
      const result = await createCategory({
        name: newCategoryName.trim(),
        type: "photo",
      }).unwrap();

      setNewCategoryName("");
      setShowAddCategory(false);
      handleInputChange("category", result._id);

      if (errors.category) {
        setErrors((prev) => ({ ...prev, category: "" }));
      }
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        category: error?.data?.message || "Failed to create category",
      }));
    }
  };

  const handleInputChange = (field: keyof PhotoUpdateData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };
  const isLoading = updating || updatingWithFile;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const preview = URL.createObjectURL(file);
        const altText = file.name.split(".")[0];

        setNewImages((prev) => [...prev, { file, preview, altText }]);
        setHasChanges(true);
      }
    });
  };

  const handleRemoveCurrentImage = (imageId: string) => {
    setRemovedImageIds((prev) => new Set([...prev, imageId]));
    setHasChanges(true);
  };

  const handleRestoreImage = (imageId: string) => {
    setRemovedImageIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(imageId);
      return newSet;
    });
    setHasChanges(true);
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
    setHasChanges(true);
  };

  const handleNewImageAltChange = (index: number, altText: string) => {
    setNewImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, altText } : img))
    );
    setHasChanges(true);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    // Check if all images are removed
    const remainingImages = currentImages.filter(
      (img) => !removedImageIds.has(img.cloudinaryPublicId)
    );

    if (remainingImages.length === 0 && newImages.length === 0) {
      newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Check if we have new images to upload
      if (newImages.length > 0) {
        // Use the file upload mutation for each new image
        for (const imageData of newImages) {
          await updatePhotoWithFile({
            id: id!,
            file: imageData.file,
            data: {
              title: formData.title,
              category: formData.category,
              date: formData.date,
              location: formData.location,
              description: formData.description,
              isActive: formData.isActive,
              alt: imageData.altText,
            },
          }).unwrap();
        }
      } else {
        // Use regular update mutation for metadata-only changes
        const updateData: PhotoUpdateData = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          date: formData.date,
          location: formData.location,
          isActive: formData.isActive,
        };

        await updatePhoto({
          id: id!,
          data: updateData,
        }).unwrap();
      }

      // Success - navigate back to dashboard
      navigate("/admin/photoDashboard");
    } catch (error: any) {
      setErrors({
        submit: error.message || "Failed to update photo. Please try again.",
      });
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmed) return;
    }

    // Clean up object URLs
    newImages.forEach((img) => URL.revokeObjectURL(img.preview));
    navigate("/admin/photoDashboard");
  };

  // Loading state
  if (loadingPhoto) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
        <BackNavigation />
        <div className='container py-6 px-4 sm:px-6 max-w-4xl mx-auto'>
          <Skeleton className='h-8 w-64 mb-6' />
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2'>
              <Card>
                <CardContent className='p-6 space-y-6'>
                  <Skeleton className='h-10 w-full' />
                  <Skeleton className='h-32 w-full' />
                  <div className='grid grid-cols-2 gap-4'>
                    <Skeleton className='h-10 w-full' />
                    <Skeleton className='h-10 w-full' />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className='space-y-6'>
              <Card>
                <CardContent className='p-6'>
                  <Skeleton className='aspect-square w-full' />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (photoError || !photo) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
        <BackNavigation />
        <div className='container py-6 px-4 sm:px-6 max-w-4xl mx-auto'>
          <Alert variant='destructive' className='max-w-md mx-auto mt-8'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              Photo not found or failed to load. Please try again.
            </AlertDescription>
          </Alert>
          <div className='flex justify-center mt-4 gap-2'>
            <Button
              onClick={() => navigate("/admin/photoDashboard")}
              variant='outline'
            >
              Back to Photos
            </Button>
            <Button onClick={refetch}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <BackNavigation />

      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
        <div className='container py-6 px-4 sm:px-6 max-w-4xl mx-auto'>
          {/* Header */}
          <motion.div
            className='mb-6'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className='text-3xl font-bold text-slate-900'>Edit Photo</h1>
              <p className='text-slate-600 mt-1'>
                Update photo details and manage images
              </p>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* Main Form */}
              <motion.div
                className='lg:col-span-2'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Image className='w-5 h-5' />
                      Photo Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    {/* Title */}
                    <div>
                      <Label htmlFor='title'>Title *</Label>
                      <Input
                        id='title'
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        placeholder='Enter photo title'
                        className={errors.title ? "border-red-500" : ""}
                      />
                      {errors.title && (
                        <p className='text-sm text-red-600 mt-1'>
                          {errors.title}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <Label htmlFor='description'>Description</Label>
                      <Textarea
                        id='description'
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        placeholder='Enter photo description'
                        className='min-h-[120px]'
                      />
                    </div>

                    {/* Category and Date */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <Label htmlFor='category'>Category *</Label>
                        <div className='flex gap-2'>
                          <select
                            id='category'
                            value={formData.category}
                            onChange={(e) =>
                              handleInputChange("category", e.target.value)
                            }
                            className={`flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                              errors.category ? "border-red-500" : ""
                            }`}
                            disabled={updating || updatingWithFile}
                          >
                            <option value='' disabled>
                              Select category
                            </option>
                            {categoriesLoading ? (
                              <option value='' disabled>
                                Loading categories...
                              </option>
                            ) : (
                              categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                  {category.name}
                                </option>
                              ))
                            )}
                          </select>
                          <Button
                            type='button'
                            onClick={() => setShowAddCategory(!showAddCategory)}
                            className='px-3 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-1'
                            title='Add new category'
                            disabled={updating || updatingWithFile}
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
                                onChange={(e) =>
                                  setNewCategoryName(e.target.value)
                                }
                                placeholder='Enter category name'
                                className='flex-1'
                                onKeyPress={(e) =>
                                  e.key === "Enter" && handleCreateCategory()
                                }
                                disabled={updating || updatingWithFile}
                              />
                              <Button
                                type='button'
                                onClick={handleCreateCategory}
                                disabled={
                                  creatingCategory ||
                                  updating ||
                                  updatingWithFile
                                }
                                className='px-3 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-1'
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
                                className='px-3 py-2 bg-gray-500 text-white hover:bg-gray-600 transition-colors'
                                disabled={updating || updatingWithFile}
                              >
                                <X className='w-4 h-4' />
                              </Button>
                            </div>
                          </div>
                        )}

                        {errors.category && (
                          <p className='text-sm text-red-600 mt-1'>
                            {errors.category}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor='date'>Date *</Label>
                        <div className='relative'>
                          <Calendar className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4' />
                          <Input
                            id='date'
                            type='date'
                            value={formData.date}
                            onChange={(e) =>
                              handleInputChange("date", e.target.value)
                            }
                            className={`pl-10 ${
                              errors.date ? "border-red-500" : ""
                            }`}
                          />
                        </div>
                        {errors.date && (
                          <p className='text-sm text-red-600 mt-1'>
                            {errors.date}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <Label htmlFor='location'>Location</Label>
                      <div className='relative'>
                        <MapPin className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4' />
                        <Input
                          id='location'
                          value={formData.location}
                          onChange={(e) =>
                            handleInputChange("location", e.target.value)
                          }
                          placeholder='Enter location'
                          className='pl-10'
                        />
                      </div>
                    </div>

                    {/* Error Messages */}
                    {errors.submit && (
                      <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                        <div className='flex items-center gap-2'>
                          <AlertCircle className='w-5 h-5 text-red-600' />
                          <p className='text-red-700'>{errors.submit}</p>
                        </div>
                      </div>
                    )}

                    {errors.images && (
                      <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                        <div className='flex items-center gap-2'>
                          <AlertCircle className='w-5 h-5 text-red-600' />
                          <p className='text-red-700'>{errors.images}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Sidebar */}
              <motion.div
                className='space-y-6'
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {/* Current Images */}
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Image className='w-5 h-5' />
                      Current Images
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      {currentImages.map((image) => {
                        const isRemoved = removedImageIds.has(
                          image.cloudinaryPublicId
                        );
                        return (
                          <div
                            key={image.cloudinaryPublicId}
                            className={`relative ${
                              isRemoved ? "opacity-50" : ""
                            }`}
                          >
                            <img
                              src={image.src}
                              alt={image.alt}
                              className='w-full rounded-lg'
                            />
                            <div className='absolute top-2 right-2 flex gap-1'>
                              {isRemoved ? (
                                <Button
                                  type='button'
                                  size='sm'
                                  onClick={() =>
                                    handleRestoreImage(image.cloudinaryPublicId)
                                  }
                                  className='bg-green-600 hover:bg-green-700'
                                >
                                  Restore
                                </Button>
                              ) : (
                                <Button
                                  type='button'
                                  size='sm'
                                  variant='destructive'
                                  onClick={() =>
                                    handleRemoveCurrentImage(
                                      image.cloudinaryPublicId
                                    )
                                  }
                                >
                                  <Trash2 className='w-4 h-4' />
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Add New Images */}
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Upload className='w-5 h-5' />
                      Add New Images
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <input
                        ref={imageFileRef}
                        type='file'
                        accept='image/*'
                        multiple
                        onChange={handleImageFileChange}
                        className='hidden'
                      />

                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => imageFileRef.current?.click()}
                        className='w-full h-24 border-dashed'
                      >
                        <div className='text-center'>
                          <Upload className='w-8 h-8 mx-auto mb-2 text-slate-400' />
                          <p className='text-sm'>Click to upload new images</p>
                        </div>
                      </Button>

                      {/* New Images Preview */}
                      {newImages.map((imageData, index) => (
                        <div key={index} className='space-y-2'>
                          <div className='relative'>
                            <img
                              src={imageData.preview}
                              alt={imageData.altText}
                              className='w-full rounded-lg'
                            />
                            <Button
                              type='button'
                              size='sm'
                              variant='destructive'
                              onClick={() => handleRemoveNewImage(index)}
                              className='absolute top-2 right-2'
                            >
                              <Trash2 className='w-4 h-4' />
                            </Button>
                          </div>
                          <Input
                            placeholder='Alt text'
                            value={imageData.altText}
                            onChange={(e) =>
                              handleNewImageAltChange(index, e.target.value)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Save Actions */}
                <Card>
                  <CardContent className='p-4'>
                    <div className='space-y-3'>
                      <Button
                        type='submit'
                        className='w-full'
                        disabled={isLoading || !hasChanges}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                            {updatingWithFile ? "Uploading..." : "Saving..."}
                          </>
                        ) : (
                          <>
                            <Save className='w-4 h-4 mr-2' />
                            Save Changes
                          </>
                        )}
                      </Button>

                      <Button
                        type='button'
                        variant='outline'
                        onClick={handleCancel}
                        disabled={isLoading}
                        className='w-full'
                      >
                        Cancel
                      </Button>

                      {hasChanges && (
                        <p className='text-sm text-amber-600 text-center'>
                          You have unsaved changes
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditPhoto;
