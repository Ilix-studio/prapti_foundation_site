import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, AlertCircle, Grid3X3, List, Plus } from "lucide-react";
import {
  useGetPhotosQuery,
  useUpdatePhotoMutation,
  // useDeletePhotoMutation,
} from "@/redux-store/services/photoApi";
import { useGetCategoriesByTypeQuery } from "@/redux-store/services/categoryApi";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "@/redux-store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import PhotoCard from "./PhotoCard";
import { BackNavigation } from "@/config/navigation/BackNavigation";
import { toast } from "react-hot-toast";

// Import types from the correct location
import {
  Photo,
  PhotoCardData,
  PhotosQueryParams,
  PhotoUpdateData,
} from "@/types/photo.types";

// Skeleton Components (unchanged)
const PhotoCardSkeleton: React.FC<{ viewMode: "grid" | "list" }> = ({
  viewMode,
}) => {
  if (viewMode === "grid") {
    return (
      <Card className='overflow-hidden'>
        <Skeleton className='aspect-[4/3] w-full' />
        <CardContent className='p-4 space-y-2'>
          <Skeleton className='h-5 w-3/4' />
          <Skeleton className='h-4 w-1/2' />
          <Skeleton className='h-3 w-1/3' />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <div className='flex p-4 gap-4'>
        <Skeleton className='w-24 h-24 rounded flex-shrink-0' />
        <div className='flex-1 space-y-2'>
          <Skeleton className='h-5 w-3/4' />
          <Skeleton className='h-4 w-1/2' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-3 w-1/3' />
        </div>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-8 w-8' />
          <Skeleton className='h-8 w-8' />
          <Skeleton className='h-8 w-8' />
        </div>
      </div>
    </Card>
  );
};

const PhotoGridSkeleton: React.FC<{ viewMode: "grid" | "list" }> = ({
  viewMode,
}) => {
  return (
    <div
      className={`grid gap-6 ${
        viewMode === "grid"
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1"
      }`}
    >
      {Array.from({ length: 12 }, (_, i) => (
        <PhotoCardSkeleton key={i} viewMode={viewMode} />
      ))}
    </div>
  );
};

const getCategoryId = (category: Photo["category"]): string => {
  if (typeof category === "string") {
    return category;
  }
  return category._id;
};

// Convert API Photo to PhotoCard-compatible format
const convertPhotoForCard = (photo: Photo): PhotoCardData => {
  // Get the first image or use a placeholder
  const firstImage = photo.images?.[0];

  // Ensure category is in object format
  const categoryObj =
    typeof photo.category === "string"
      ? { _id: photo.category, name: photo.category, type: "photo" }
      : photo.category;

  return {
    _id: photo._id,
    title: photo.title,
    description: photo.description,
    src: firstImage?.src || "", // Use the src from the first image
    alt: firstImage?.alt || photo.title, // Use the alt from the first image or title as fallback
    date: photo.date.toString(),
    location: photo.location,
    category: categoryObj,
    createdAt: photo.createdAt.toString(),
    updatedAt: photo.updatedAt.toString(),
  };
};

const PhotoDash: React.FC = () => {
  const navigate = useNavigate();
  const isAdmin = useSelector(selectIsAdmin);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Query parameters
  const [queryParams, setQueryParams] = useState<PhotosQueryParams>({
    page: 1,
    limit: 12,
    category: "",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // API hooks
  const {
    data: photosData,
    isLoading: isLoadingPhotos,
    error: photosError,
    refetch: refetchPhotos,
  } = useGetPhotosQuery(queryParams);

  const { data: categories = [], isLoading: isLoadingCategories } =
    useGetCategoriesByTypeQuery("photo");

  const [updatePhoto, { isLoading: isUpdating }] = useUpdatePhotoMutation();
  // const [deletePhoto ] = useDeletePhotoMutation();

  if (!isAdmin) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <BackNavigation />
        <Alert className='max-w-md mx-auto mt-8'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>Admin access required.</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Handle error state
  if (photosError) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <BackNavigation />
        <Alert className='max-w-md mx-auto mt-8' variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            Failed to load photos. Please try again.
          </AlertDescription>
        </Alert>
        <div className='flex justify-center mt-4'>
          <Button onClick={() => refetchPhotos()} variant='outline'>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const handleSearch = (search: string) => {
    setQueryParams((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleCategoryFilter = (categoryId: string) => {
    setQueryParams((prev) => ({
      ...prev,
      category: categoryId === "all" ? "" : categoryId,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  const handleViewPhoto = (photo: PhotoCardData) => {
    navigate(`/admin/view/${photo._id}`);
  };

  const handleEditPhoto = (photo: PhotoCardData) => {
    // Find the original Photo object to edit
    const originalPhoto = photosData?.data.photos.find(
      (p) => p._id === photo._id
    );
    if (originalPhoto) {
      setEditingPhoto(originalPhoto);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;

    try {
      const updateData: PhotoUpdateData = {
        title: editingPhoto.title,
        category: getCategoryId(editingPhoto.category),
        location: editingPhoto.location,
        description: editingPhoto.description,
        date: editingPhoto.date.toString(),
      };

      await updatePhoto({
        id: editingPhoto._id,
        data: updateData,
      }).unwrap();

      toast.success("Photo updated successfully");
      setEditingPhoto(null);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Update failed";
      toast.error(`Update failed: ${errorMessage}`);
      console.error("Update failed:", error);
    }
  };

  const handleAddPhoto = () => {
    navigate("/admin/addPhoto");
  };

  return (
    <>
      <BackNavigation />
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <div className='max-w-7xl mx-auto space-y-6'>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <h1 className='text-2xl font-bold text-slate-800'>
              Photo Dashboard
            </h1>

            <div className='flex items-center gap-3'>
              <Button
                variant='outline'
                size='sm'
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                disabled={isLoadingPhotos}
              >
                {viewMode === "grid" ? (
                  <List className='w-4 h-4' />
                ) : (
                  <Grid3X3 className='w-4 h-4' />
                )}
              </Button>
            </div>
          </div>

          {/* Stats Card */}
          <Card>
            <CardContent className='pt-1'>
              <div className='grid grid-cols-3 md:grid-cols-3 gap-3 text-center'>
                <div>
                  <h3 className='text-2xl font-bold text-blue-600'>
                    {photosData?.data.pagination.total || 0}
                  </h3>
                  <p className='text-sm text-gray-600'>Total Photos</p>
                </div>
                <div>
                  <h3 className='text-2xl font-bold text-green-600'>
                    {categories.length}
                  </h3>
                  <p className='text-sm text-gray-600'>Categories</p>
                </div>
                <div>
                  <h3 className='text-2xl font-bold text-purple-600'>
                    {photosData?.data.pagination.pages || 0}
                  </h3>
                  <p className='text-sm text-gray-600'>Pages</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardContent className='pt-1'>
              <div className='flex flex-col sm:flex-row gap-4'>
                <div className='flex-1'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                    <Input
                      placeholder='Search photos...'
                      value={queryParams.search || ""}
                      onChange={(e) => handleSearch(e.target.value)}
                      className='pl-10'
                      disabled={isLoadingPhotos}
                    />
                  </div>
                </div>
                <select
                  className='w-48 px-3 py-2 border rounded-md text-sm'
                  value={queryParams.category || "all"}
                  onChange={(e) => handleCategoryFilter(e.target.value)}
                  disabled={isLoadingPhotos || isLoadingCategories}
                >
                  <option value='all'>All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Photos Grid/List with Skeleton Loading */}
          {isLoadingPhotos ? (
            <PhotoGridSkeleton viewMode={viewMode} />
          ) : photosData?.data.photos.length === 0 ? (
            <Card>
              <CardContent className='text-center py-12'>
                <p className='text-gray-500 mb-4'>No photos found.</p>
                <Button onClick={handleAddPhoto} variant='outline'>
                  <Plus className='w-4 h-4 mr-2' />
                  Add Your First Photo
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {photosData?.data.photos.map((photo) => (
                <PhotoCard
                  key={photo._id}
                  photo={convertPhotoForCard(photo)}
                  viewMode={viewMode}
                  onView={handleViewPhoto}
                  onEdit={handleEditPhoto}
                  showEditButton={true}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoadingPhotos &&
            photosData?.data.pagination &&
            photosData.data.pagination.pages > 1 && (
              <div className='flex justify-center space-x-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handlePageChange(queryParams.page! - 1)}
                  disabled={!photosData.data.pagination.hasPrev}
                >
                  Previous
                </Button>

                {Array.from(
                  { length: Math.min(photosData.data.pagination.pages, 5) },
                  (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={
                          queryParams.page === page ? "default" : "outline"
                        }
                        size='sm'
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    );
                  }
                )}

                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handlePageChange(queryParams.page! + 1)}
                  disabled={!photosData.data.pagination.hasNext}
                >
                  Next
                </Button>
              </div>
            )}

          {/* Edit Photo Dialog */}
          <Dialog
            open={!!editingPhoto}
            onOpenChange={() => setEditingPhoto(null)}
          >
            <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
              {editingPhoto && (
                <>
                  <DialogHeader>
                    <DialogTitle>Edit Photo</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleEditSubmit} className='space-y-4'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <label className='text-sm font-medium'>Title</label>
                        <Input
                          value={editingPhoto.title}
                          onChange={(e) =>
                            setEditingPhoto((prev) =>
                              prev ? { ...prev, title: e.target.value } : null
                            )
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className='text-sm font-medium'>Category</label>
                        <Select
                          value={getCategoryId(editingPhoto.category)}
                          onValueChange={(value) =>
                            setEditingPhoto((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    category:
                                      categories.find(
                                        (cat) => cat._id === value
                                      ) || value,
                                  }
                                : null
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat._id} value={cat._id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className='text-sm font-medium'>Date</label>
                        <Input
                          type='date'
                          value={editingPhoto.date.toString().split("T")[0]}
                          onChange={(e) =>
                            setEditingPhoto((prev) =>
                              prev
                                ? { ...prev, date: new Date(e.target.value) }
                                : null
                            )
                          }
                        />
                      </div>
                      <div>
                        <label className='text-sm font-medium'>Location</label>
                        <Input
                          value={editingPhoto.location || ""}
                          onChange={(e) =>
                            setEditingPhoto((prev) =>
                              prev
                                ? { ...prev, location: e.target.value }
                                : null
                            )
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className='text-sm font-medium'>Description</label>
                      <textarea
                        className='w-full p-2 border rounded-md'
                        rows={3}
                        value={editingPhoto.description || ""}
                        onChange={(e) =>
                          setEditingPhoto((prev) =>
                            prev
                              ? { ...prev, description: e.target.value }
                              : null
                          )
                        }
                      />
                    </div>

                    <div className='flex gap-3'>
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => setEditingPhoto(null)}
                        className='flex-1'
                      >
                        Cancel
                      </Button>
                      <Button
                        type='submit'
                        disabled={isUpdating}
                        className='flex-1'
                      >
                        {isUpdating ? "Updating..." : "Update Photo"}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default PhotoDash;
