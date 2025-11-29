import React, { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
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
  AlertCircle,
  Upload,
  Trash2,
  Award,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectAuth, selectIsAdmin } from "@/redux-store/slices/authSlice";
import {
  useGetAwardByIdQuery,
  useUpdateAwardPostMutation,
  useUpdateAwardWithImageMutation,
} from "@/redux-store/services/awardApi";
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
} from "@/redux-store/services/categoryApi";
import { AwardPost, getAwardCategoryId } from "@/types/award.types";
import { PhotoImage } from "@/types/photo.types";
import { BackNavigation } from "@/config/navigation/BackNavigation";
import toast from "react-hot-toast";

interface AwardFormData {
  title: string;
  description: string;
  category: string;
}

interface FilePreview {
  file: File;
  preview: string;
  altText: string;
}

const EditAward: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);

  const imageFileRef = useRef<HTMLInputElement>(null);

  // Fetch categories
  const { data: categories = [] } = useGetAllCategoriesQuery();

  // Category management
  const [createCategory, { isLoading: creatingCategory }] =
    useCreateCategoryMutation();
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Form state
  const [formData, setFormData] = useState<AwardFormData>({
    title: "",
    description: "",
    category: "",
  });

  const [currentImages, setCurrentImages] = useState<PhotoImage[]>([]);
  const [newImages, setNewImages] = useState<FilePreview[]>([]);
  const [removedImageIndices, setRemovedImageIndices] = useState<Set<number>>(
    new Set()
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auth check
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/admin/login' />;
  }

  if (!id) {
    return <Navigate to='/admin/awardDash' />;
  }

  const {
    data: awardData,
    isLoading: loadingAward,
    error: awardError,
    refetch,
  } = useGetAwardByIdQuery(id);

  const [updateAward, { isLoading: updating }] = useUpdateAwardPostMutation();
  const [updateAwardWithImage, { isLoading: updatingWithImage }] =
    useUpdateAwardWithImageMutation();

  // Extract award from response
  const award = useMemo(() => {
    if (!awardData) return null;
    return awardData as AwardPost;
  }, [awardData]);

  // Populate form when award data loads
  useEffect(() => {
    if (award) {
      setFormData({
        title: award.title,
        description: award.description || "",
        category: getAwardCategoryId(award.category),
      });
      setCurrentImages(award.images || []);
      setRemovedImageIndices(new Set());
      setNewImages([]);
    }
  }, [award]);

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
        type: "award",
      }).unwrap();

      setNewCategoryName("");
      setShowAddCategory(false);
      handleInputChange("category", result._id);
      toast.success("Category created");

      if (errors.category) {
        setErrors((prev) => ({ ...prev, category: "" }));
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      setErrors((prev) => ({
        ...prev,
        category: err?.data?.message || "Failed to create category",
      }));
    }
  };

  const handleInputChange = (field: keyof AwardFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentCount = currentImages.length - removedImageIndices.size;
    const remainingSlots = 10 - (currentCount + newImages.length);

    if (files.length > remainingSlots) {
      toast.error(
        `Maximum 10 images allowed. You can add ${Math.max(
          0,
          remainingSlots
        )} more.`
      );
      return;
    }

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const preview = URL.createObjectURL(file);
        const altText = file.name.split(".")[0];
        setNewImages((prev) => [...prev, { file, preview, altText }]);
        setHasChanges(true);
      }
    });

    // Reset input
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleRemoveCurrentImage = (index: number) => {
    const currentCount = currentImages.length - removedImageIndices.size;
    const willHaveImages = currentCount - 1 + newImages.length;

    if (willHaveImages < 1) {
      toast.error("At least one image is required. Add a new image first.");
      return;
    }

    setRemovedImageIndices((prev) => new Set([...prev, index]));
    setHasChanges(true);
  };

  const handleRestoreImage = (index: number) => {
    setRemovedImageIndices((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
    setHasChanges(true);
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
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

    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }

    const remainingImages =
      currentImages.length - removedImageIndices.size + newImages.length;

    if (remainingImages === 0) {
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

    setIsSubmitting(true);
    setErrors({});

    try {
      // Step 1: Add new images FIRST (so we have images before deleting)
      for (const newImage of newImages) {
        const imageFormData = new FormData();
        imageFormData.append("image", newImage.file);
        imageFormData.append("imageAction", "add");
        imageFormData.append("imageAlt", newImage.altText);

        await updateAwardWithImage({
          id: id!,
          formData: imageFormData,
        }).unwrap();
      }

      // Step 2: Delete removed images (in reverse order to maintain indices)
      const sortedIndicesToDelete = Array.from(removedImageIndices).sort(
        (a, b) => b - a
      );

      for (const imageIndex of sortedIndicesToDelete) {
        await updateAward({
          id: id!,
          imageAction: "delete",
          imageIndex: imageIndex.toString(),
        }).unwrap();
      }

      // Step 3: Update text fields
      await updateAward({
        id: id!,
        title: formData.title,
        description: formData.description,
        category: formData.category,
      }).unwrap();

      toast.success("Award updated successfully");

      // Refetch to get updated data
      await refetch();

      navigate("/admin/awardDash");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      const errorMessage =
        err.data?.message ||
        err.message ||
        "Failed to update award. Please try again.";
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
      console.error("Update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmed) return;
    }

    // Cleanup previews
    newImages.forEach((img) => URL.revokeObjectURL(img.preview));
    navigate("/admin/awardDash");
  };

  const isLoading = updating || updatingWithImage || isSubmitting;

  if (loadingAward) {
    return (
      <>
        <BackNavigation />
        <div className='container mx-auto p-6 max-w-4xl'>
          <div className='space-y-6'>
            <Skeleton className='h-10 w-48' />
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              <div className='lg:col-span-2 space-y-4'>
                <Skeleton className='h-12 w-full' />
                <Skeleton className='h-32 w-full' />
                <Skeleton className='h-12 w-full' />
              </div>
              <div className='space-y-4'>
                <Skeleton className='h-48 w-full' />
                <Skeleton className='h-24 w-full' />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (awardError) {
    return (
      <>
        <BackNavigation />
        <div className='container mx-auto p-6'>
          <Alert variant='destructive' className='max-w-md mx-auto'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              Failed to load award. Please try again.
            </AlertDescription>
          </Alert>
          <div className='flex justify-center mt-4'>
            <Button onClick={() => navigate("/admin/awardDash")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </>
    );
  }

  if (!award) {
    return (
      <>
        <BackNavigation />
        <div className='container mx-auto p-6'>
          <Alert className='max-w-md mx-auto'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>Award not found.</AlertDescription>
          </Alert>
        </div>
      </>
    );
  }

  const activeImageCount = currentImages.length - removedImageIndices.size;

  return (
    <>
      <BackNavigation />
      <div className='min-h-screen bg-gray-50'>
        <div className='container mx-auto px-4 py-8'>
          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              <div className='lg:col-span-2'>
                <Card>
                  <h1 className='text-2xl font-bold flex items-center gap-2'>
                    <Award className='h-6 w-6 text-orange-500' />
                    Edit Award Post
                  </h1>
                  <CardHeader>
                    <CardTitle>Award Details</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    {/* Title */}
                    <div className='space-y-2'>
                      <Label htmlFor='title'>Title *</Label>
                      <Input
                        id='title'
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        placeholder='Enter award title'
                        className={errors.title ? "border-red-500" : ""}
                        disabled={isLoading}
                      />
                      {errors.title && (
                        <p className='text-sm text-red-600'>{errors.title}</p>
                      )}
                    </div>

                    {/* Description */}
                    <div className='space-y-2'>
                      <Label htmlFor='description'>Description *</Label>
                      <Textarea
                        id='description'
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        placeholder='Enter award description'
                        rows={4}
                        className={errors.description ? "border-red-500" : ""}
                        disabled={isLoading}
                      />
                      {errors.description && (
                        <p className='text-sm text-red-600'>
                          {errors.description}
                        </p>
                      )}
                    </div>

                    {/* Category */}
                    <div className='space-y-2'>
                      <Label htmlFor='category'>Category *</Label>
                      <div className='flex gap-2'>
                        <select
                          id='category'
                          value={formData.category}
                          onChange={(e) =>
                            handleInputChange("category", e.target.value)
                          }
                          disabled={isLoading}
                          className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                            errors.category
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value=''>Select a category</option>
                          {categories.map(
                            (cat: { _id: string; name: string }) => (
                              <option key={cat._id} value={cat._id}>
                                {cat.name}
                              </option>
                            )
                          )}
                        </select>
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() => setShowAddCategory(!showAddCategory)}
                          className='whitespace-nowrap'
                          disabled={isLoading}
                        >
                          + New
                        </Button>
                      </div>
                      <div className='bg-white border-b'>
                        <div className='container mx-auto px-4 py-4'>
                          <div className='mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                            <p className='text-sm text-blue-800 font-medium mb-1'>
                              💡 Tips for updating:
                            </p>
                            <ul className='text-xs text-blue-700 space-y-1 list-disc list-inside'>
                              <li>
                                To replace an image: add new image first, then
                                mark old one for deletion
                              </li>
                              <li>
                                At least one image is required — you cannot
                                delete all images
                              </li>
                              <li>
                                Changes are saved only when you click "Save
                                Changes"
                              </li>
                              <li>Maximum 10 images allowed per award posts</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {showAddCategory && (
                        <div className='flex gap-2 mt-2'>
                          <Input
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder='Enter new category name'
                            disabled={creatingCategory}
                          />
                          <Button
                            type='button'
                            onClick={handleCreateCategory}
                            disabled={creatingCategory}
                          >
                            {creatingCategory ? (
                              <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Creating...
                              </>
                            ) : (
                              "Create"
                            )}
                          </Button>
                        </div>
                      )}

                      {errors.category && (
                        <p className='text-sm text-red-600'>
                          {errors.category}
                        </p>
                      )}
                    </div>

                    {/* Error Messages */}
                    {errors.submit && (
                      <Alert variant='destructive'>
                        <AlertCircle className='h-4 w-4' />
                        <AlertDescription>{errors.submit}</AlertDescription>
                      </Alert>
                    )}

                    {errors.images && (
                      <Alert variant='destructive'>
                        <AlertCircle className='h-4 w-4' />
                        <AlertDescription>{errors.images}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className='space-y-6'>
                {/* Current Images */}
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Image className='w-5 h-5' />
                      Current Images ({activeImageCount})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      {currentImages.length === 0 ? (
                        <p className='text-sm text-gray-500 text-center py-4'>
                          No images available
                        </p>
                      ) : (
                        currentImages.map((image, index) => {
                          const isRemoved = removedImageIndices.has(index);
                          return (
                            <div
                              key={image.cloudinaryPublicId || `img-${index}`}
                              className={`relative rounded-lg overflow-hidden ${
                                isRemoved ? "opacity-50" : ""
                              }`}
                            >
                              <img
                                src={image.src}
                                alt={image.alt}
                                className='w-full rounded-lg'
                              />
                              {isRemoved && (
                                <div className='absolute inset-0 bg-red-500/30 flex items-center justify-center'>
                                  <span className='bg-red-600 text-white px-3 py-1 rounded text-sm font-medium'>
                                    Will be deleted
                                  </span>
                                </div>
                              )}
                              <div className='absolute top-2 right-2'>
                                {isRemoved ? (
                                  <Button
                                    type='button'
                                    size='sm'
                                    onClick={() => handleRestoreImage(index)}
                                    className='bg-green-600 hover:bg-green-700'
                                    disabled={isLoading}
                                  >
                                    Restore
                                  </Button>
                                ) : (
                                  <Button
                                    type='button'
                                    size='sm'
                                    variant='destructive'
                                    onClick={() =>
                                      handleRemoveCurrentImage(index)
                                    }
                                    disabled={isLoading}
                                  >
                                    <Trash2 className='w-4 h-4' />
                                  </Button>
                                )}
                              </div>
                              <p className='text-xs text-gray-500 mt-1 truncate px-1'>
                                {image.alt}
                              </p>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Add New Images */}
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Upload className='w-5 h-5' />
                      Add New Images ({newImages.length})
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
                        disabled={isLoading}
                      />

                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => imageFileRef.current?.click()}
                        className='w-full h-24 border-dashed'
                        disabled={
                          isLoading || activeImageCount + newImages.length >= 10
                        }
                      >
                        <div className='text-center'>
                          <Upload className='w-8 h-8 mx-auto mb-2 text-gray-400' />
                          <p className='text-sm'>Click to upload new images</p>
                          <p className='text-xs text-gray-400'>
                            {10 - activeImageCount - newImages.length} slots
                            remaining
                          </p>
                        </div>
                      </Button>

                      {newImages.map((imageData, index) => (
                        <div key={`new-${index}`} className='space-y-2'>
                          <div className='relative rounded-lg overflow-hidden'>
                            <img
                              src={imageData.preview}
                              alt={imageData.altText}
                              className='w-full rounded-lg'
                            />
                            <div className='absolute top-1 left-1'>
                              <span className='bg-green-600 text-white text-xs px-2 py-0.5 rounded'>
                                New
                              </span>
                            </div>
                            <Button
                              type='button'
                              size='sm'
                              variant='destructive'
                              onClick={() => handleRemoveNewImage(index)}
                              className='absolute top-2 right-2'
                              disabled={isLoading}
                            >
                              <X className='w-4 h-4' />
                            </Button>
                          </div>
                          <Input
                            placeholder='Alt text for this image'
                            value={imageData.altText}
                            onChange={(e) =>
                              handleNewImageAltChange(index, e.target.value)
                            }
                            disabled={isLoading}
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
                        className='w-full bg-orange-500 hover:bg-orange-600'
                        disabled={isLoading || !hasChanges}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                            Saving...
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
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditAward;
