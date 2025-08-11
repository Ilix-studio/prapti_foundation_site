import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  MapPin,
  Edit,
  Trash2,
  AlertCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useGetPhotoQuery } from "@/redux-store/services/photoApi";
import { Photo } from "@/types/photo.types";

export interface PhotoViewProps {
  photoId: string;
  onEdit?: (photo: Photo) => void;
  onDelete?: (photoId: string) => void;
  onBack?: () => void;
  showActions?: boolean;
}

const PhotoView: React.FC<PhotoViewProps> = ({
  photoId,
  onEdit,
  onDelete,
  onBack,
  showActions = true,
}) => {
  const { data: photoData, isLoading, error } = useGetPhotoQuery(photoId);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function to get category name
  const getCategoryName = (category: Photo["category"]): string => {
    if (typeof category === "string") {
      return category;
    }
    return category.name;
  };

  if (isLoading) {
    return (
      <Card className='max-w-7xl mx-auto'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-8 w-64' />
            {onBack && (
              <Button variant='outline' size='sm' onClick={onBack}>
                <ArrowLeft className='w-4 h-4 mr-2' />
                Back
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          <Skeleton className='w-full h-96' />
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Skeleton className='h-6 w-full' />
            <Skeleton className='h-6 w-full' />
            <Skeleton className='h-6 w-full' />
            <Skeleton className='h-6 w-full' />
          </div>
          <Skeleton className='h-20 w-full' />
        </CardContent>
      </Card>
    );
  }

  if (error || !photoData?.success) {
    return (
      <Alert variant='destructive' className='max-w-4xl mx-auto'>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription>
          Failed to load photo. Please try again later.
        </AlertDescription>
        {onBack && (
          <Button variant='outline' size='sm' onClick={onBack} className='mt-2'>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back
          </Button>
        )}
      </Alert>
    );
  }

  // Handle the union type from PhotoResponse
  const photo =
    "photo" in photoData.data ? photoData.data.photo : photoData.data;

  // Get the current image from the images array
  const currentImage = photo.images?.[currentImageIndex];
  const imageSrc = currentImage?.src || "";
  const imageAlt = currentImage?.alt || photo.title;

  const nextImage = () => {
    if (photo.images && currentImageIndex < photo.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setShowLightbox(true);
  };

  return (
    <>
      <Card className='max-w-4xl mx-auto'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-2xl font-bold'>{photo.title}</CardTitle>
            <div className='flex items-center gap-2'>
              {showActions && (
                <>
                  {onEdit && (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => onEdit(photo)}
                    >
                      <Edit className='w-4 h-4 mr-2' />
                      Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => onDelete(photo._id)}
                    >
                      <Trash2 className='w-4 h-4 mr-2' />
                      Delete
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className='space-y-6'>
          {/* Photo Image with Slider */}
          <div className='relative'>
            {imageSrc ? (
              <div className='relative group'>
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className='w-full max-h-96 object-contain rounded-lg shadow-lg cursor-pointer'
                  onClick={() => openLightbox(currentImageIndex)}
                />

                {/* Navigation arrows for multiple images */}
                {photo.images && photo.images.length > 1 && (
                  <>
                    <Button
                      variant='outline'
                      size='sm'
                      className='absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm'
                      onClick={prevImage}
                      disabled={currentImageIndex === 0}
                    >
                      <ChevronLeft className='w-4 h-4' />
                    </Button>

                    <Button
                      variant='outline'
                      size='sm'
                      className='absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm'
                      onClick={nextImage}
                      disabled={currentImageIndex === photo.images.length - 1}
                    >
                      <ChevronRight className='w-4 h-4' />
                    </Button>

                    {/* Image counter */}
                    <div className='absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm'>
                      {currentImageIndex + 1} / {photo.images.length}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className='w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center'>
                <span className='text-gray-500'>No image available</span>
              </div>
            )}
          </div>

          {/* Image Thumbnails */}
          {photo.images && photo.images.length > 1 && (
            <div className='flex gap-2 overflow-x-auto pb-2'>
              {photo.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className='w-full h-full object-cover'
                  />
                </button>
              ))}
            </div>
          )}

          {/* Photo Meta Information */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='flex items-center gap-2 text-sm'>
              <span className='font-medium'>Category:</span>
              <Badge variant='secondary' className='capitalize'>
                {getCategoryName(photo.category)}
              </Badge>
            </div>

            <div className='flex items-center gap-2 text-sm'>
              <Calendar className='w-4 h-4 text-gray-500' />
              <span>{formatDate(photo.date)}</span>
            </div>

            {photo.location && (
              <div className='flex items-center gap-2 text-sm'>
                <MapPin className='w-4 h-4 text-gray-500' />
                <span>{photo.location}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {photo.description && (
            <div>
              <h3 className='text-lg font-semibold mb-2'>Description</h3>
              <p className='text-gray-700 leading-relaxed'>
                {photo.description}
              </p>
            </div>
          )}

          {/* Lightbox Modal */}
          {showLightbox && photo.images && (
            <div className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4'>
              <div className='relative max-w-4xl max-h-full'>
                {/* Close button */}
                <Button
                  variant='outline'
                  size='sm'
                  className='absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm'
                  onClick={() => setShowLightbox(false)}
                >
                  <X className='w-4 h-4' />
                </Button>

                {/* Main image */}
                <img
                  src={photo.images[currentImageIndex]?.src}
                  alt={photo.images[currentImageIndex]?.alt}
                  className='max-w-full max-h-full object-contain'
                />

                {/* Navigation */}
                {photo.images.length > 1 && (
                  <>
                    <Button
                      variant='outline'
                      size='sm'
                      className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm'
                      onClick={prevImage}
                      disabled={currentImageIndex === 0}
                    >
                      <ChevronLeft className='w-4 h-4' />
                    </Button>

                    <Button
                      variant='outline'
                      size='sm'
                      className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm'
                      onClick={nextImage}
                      disabled={currentImageIndex === photo.images.length - 1}
                    >
                      <ChevronRight className='w-4 h-4' />
                    </Button>

                    {/* Counter */}
                    <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded'>
                      {currentImageIndex + 1} / {photo.images.length}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className='pt-4 border-t border-gray-200'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-500'>
              <div>
                <span className='font-medium'>Created:</span>{" "}
                {formatDate(photo.createdAt)}
              </div>
              <div>
                <span className='font-medium'>Last Updated:</span>{" "}
                {formatDate(photo.updatedAt)}
              </div>
              <div>
                <span className='font-medium'>Photo ID:</span> {photo._id}
              </div>
              <div>
                <span className='font-medium'>Images Count:</span>{" "}
                {photo.images?.length || 0}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default PhotoView;
