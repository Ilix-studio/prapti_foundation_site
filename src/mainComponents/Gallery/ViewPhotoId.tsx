// src/components/ViewPhotoId.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  MapPin,
  ArrowLeft,
  AlertCircle,
  Share2,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  Download,
  ExternalLink,
  Loader2,
} from "lucide-react";
import {
  useGetPhotoQuery,
  useGetPhotosQuery,
} from "@/redux-store/services/photoApi";
import { Photo } from "@/types/photo.types";

// Animation variants for smooth transitions
const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const ViewPhotoId: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Fetch photo data
  const {
    data: photoData,
    isLoading,
    error,
    refetch,
  } = useGetPhotoQuery(id!, {
    skip: !id,
  });

  // Extract photo data safely with type checking
  const photo = photoData?.success
    ? "photo" in photoData.data
      ? photoData.data.photo
      : photoData.data
    : null;

  // Helper function to get category information
  const getCategoryInfo = (category: Photo["category"]) => {
    if (typeof category === "string") {
      return { name: category, id: category };
    }
    return { name: category.name, id: category._id };
  };

  // Get category info for related photos query
  const categoryInfo = photo ? getCategoryInfo(photo.category) : null;

  // Fetch related photos by category
  const { data: relatedPhotosData, isLoading: isRelatedLoading } =
    useGetPhotosQuery(
      {
        category: categoryInfo?.name || "",
        limit: 9,
        page: 1,
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      {
        skip: !photo || !categoryInfo?.name,
        refetchOnMountOrArgChange: true,
      }
    );

  // Reset image index when photo changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [photo?._id]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!showLightbox || !photo?.images) return;

      switch (event.key) {
        case "Escape":
          setShowLightbox(false);
          break;
        case "ArrowLeft":
          prevImage();
          break;
        case "ArrowRight":
          nextImage();
          break;
      }
    };

    if (showLightbox) {
      document.addEventListener("keydown", handleKeyPress);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.body.style.overflow = "unset";
    };
  }, [showLightbox, currentImageIndex, photo?.images]);

  // Enhanced date formatting with relative time
  const formatDate = useCallback((dateString: string | Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (diffDays === 1) return `${formattedDate} (Yesterday)`;
    if (diffDays <= 7) return `${formattedDate} (${diffDays} days ago)`;
    return formattedDate;
  }, []);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Enhanced sharing functionality
  const handleShare = useCallback(async () => {
    if (!photoData?.success || !photo) return;

    setIsSharing(true);

    try {
      if (navigator.share && navigator.canShare) {
        const shareData = {
          title: photo.title,
          text: photo.description || `Check out this photo: ${photo.title}`,
          url: window.location.href,
        };

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
        } else {
          throw new Error("Cannot share this content");
        }
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.log("Error sharing:", error);
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch (clipboardError) {
        console.error("Failed to copy to clipboard:", clipboardError);
      }
    } finally {
      setIsSharing(false);
    }
  }, [photoData, photo]);

  const handleRelatedPhotoClick = useCallback(
    (photoId: string) => {
      navigate(`/view/photo/${photoId}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [navigate]
  );

  const handleBrowseCategory = useCallback(() => {
    if (photo && categoryInfo) {
      navigate(`/photo-gallery?category=${categoryInfo.name.toLowerCase()}`);
    }
  }, [photo, categoryInfo, navigate]);

  // Image navigation with bounds checking
  const nextImage = useCallback(() => {
    if (photo?.images && currentImageIndex < photo.images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  }, [photo?.images, currentImageIndex]);

  const prevImage = useCallback(() => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  }, [currentImageIndex]);

  const openLightbox = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setShowLightbox(true);
  }, []);

  // Enhanced download functionality
  const handleDownload = useCallback(async () => {
    if (!photo?.images?.[currentImageIndex]?.src) return;

    try {
      const response = await fetch(photo.images[currentImageIndex].src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${photo.title}-${currentImageIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(photo.images[currentImageIndex].src, "_blank");
    }
  }, [photo, currentImageIndex]);

  // Loading state
  if (!id) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4'>
        <Alert variant='destructive' className='max-w-md'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>Photo ID not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <div className='max-w-4xl mx-auto space-y-6'>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-10 w-20' />
            <div className='flex gap-2'>
              <Skeleton className='h-10 w-10' />
              <Skeleton className='h-10 w-10' />
            </div>
          </div>
          <Card>
            <CardContent className='p-6 space-y-6'>
              <Skeleton className='h-8 w-3/4' />
              <Skeleton className='w-full h-96' />
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <Skeleton className='h-16' />
                <Skeleton className='h-16' />
                <Skeleton className='h-16' />
              </div>
              <Skeleton className='h-20 w-full' />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !photoData?.success || !photo) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4'>
        <Alert variant='destructive' className='max-w-md'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            Failed to load photo. Please try again later.
          </AlertDescription>
          <div className='mt-4 flex gap-2'>
            <Button variant='outline' size='sm' onClick={() => refetch()}>
              Try Again
            </Button>
            <Button variant='outline' size='sm' onClick={handleBack}>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  // Get current image
  const currentImage = photo.images?.[currentImageIndex];
  const imageSrc = currentImage?.src || "";
  const imageAlt = currentImage?.alt || photo.title;

  // Filter related photos
  const relatedPhotos =
    relatedPhotosData?.success && relatedPhotosData.data?.photos
      ? relatedPhotosData.data.photos
          .filter((relatedPhoto) => relatedPhoto._id !== photo._id)
          .slice(0, 6)
      : [];

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
      {/* Header */}
      <div className='sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60'>
        <div className='container flex h-16 items-center justify-between px-4'>
          <Button variant='ghost' onClick={handleBack}>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back
          </Button>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={handleShare}
              disabled={isSharing}
            >
              {isSharing ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <Share2 className='w-4 h-4' />
              )}
            </Button>
            <Button variant='outline' size='sm' onClick={handleDownload}>
              <Download className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </div>

      <div className='container mx-auto p-4 pt-8'>
        <motion.div
          initial='hidden'
          animate='visible'
          variants={fadeInVariants}
          className='max-w-4xl mx-auto space-y-8'
        >
          <Card className='overflow-hidden shadow-xl'>
            <CardContent className='p-0'>
              {/* Photo Header */}
              <div className='p-6 pb-4'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='space-y-2 flex-1'>
                    <h1 className='text-3xl font-bold text-gray-900 leading-tight'>
                      {photo.title}
                    </h1>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <Badge variant='outline' className='text-sm'>
                        {categoryInfo?.name.toUpperCase()}
                      </Badge>
                      {photo.location && (
                        <Badge variant='secondary' className='text-sm'>
                          <MapPin className='w-3 h-3 mr-1' />
                          {photo.location}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Image */}
              <div className='relative'>
                {imageSrc ? (
                  <div className='relative group'>
                    <img
                      src={imageSrc}
                      alt={imageAlt}
                      className='w-full h-auto max-h-[70vh] object-contain bg-gray-100 cursor-pointer transition-transform duration-200 hover:scale-[1.02]'
                      onClick={() => openLightbox(currentImageIndex)}
                      loading='lazy'
                    />

                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200' />

                    {/* Navigation for multiple images */}
                    {photo.images && photo.images.length > 1 && (
                      <>
                        <Button
                          variant='outline'
                          size='sm'
                          className='absolute left-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/90 backdrop-blur-sm hover:bg-white'
                          onClick={prevImage}
                          disabled={currentImageIndex === 0}
                        >
                          <ChevronLeft className='w-4 h-4' />
                        </Button>

                        <Button
                          variant='outline'
                          size='sm'
                          className='absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/90 backdrop-blur-sm hover:bg-white'
                          onClick={nextImage}
                          disabled={
                            currentImageIndex === photo.images.length - 1
                          }
                        >
                          <ChevronRight className='w-4 h-4' />
                        </Button>

                        <div className='absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm'>
                          {currentImageIndex + 1} / {photo.images.length}
                        </div>
                      </>
                    )}

                    <div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                      <div className='bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm flex items-center gap-1'>
                        <ExternalLink className='w-3 h-3' />
                        View Full Size
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg'>
                    <span className='text-gray-500'>No image available</span>
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              {photo.images && photo.images.length > 1 && (
                <div className='p-6 pt-4'>
                  <div className='flex gap-3 overflow-x-auto pb-2'>
                    {photo.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          index === currentImageIndex
                            ? "border-blue-500 ring-2 ring-blue-200 scale-105"
                            : "border-gray-300 hover:border-gray-400 hover:scale-105"
                        }`}
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          className='w-full h-full object-cover'
                          loading='lazy'
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Photo Details */}
              <div className='p-6 space-y-6'>
                <motion.div
                  variants={staggerVariants}
                  initial='hidden'
                  animate='visible'
                  className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                >
                  <motion.div
                    variants={childVariants}
                    className='flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200'
                  >
                    <Calendar className='w-5 h-5 text-orange-600' />
                    <div>
                      <div className='text-sm font-medium text-gray-700'>
                        Date
                      </div>
                      <div className='text-sm text-gray-600'>
                        {formatDate(photo.date)}
                      </div>
                    </div>
                  </motion.div>

                  {photo.location && (
                    <motion.div
                      variants={childVariants}
                      className='flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200'
                    >
                      <MapPin className='w-5 h-5 text-green-600' />
                      <div>
                        <div className='text-sm font-medium text-gray-700'>
                          Location
                        </div>
                        <div className='text-sm text-gray-600'>
                          {photo.location}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    variants={childVariants}
                    className='flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200'
                  >
                    <div className='w-5 h-5 bg-blue-600 rounded-full text-white flex items-center justify-center text-xs font-bold'>
                      {categoryInfo?.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className='text-sm font-medium text-gray-700'>
                        Category
                      </div>
                      <div className='text-sm text-gray-600 capitalize'>
                        {categoryInfo?.name}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Description */}
                {photo.description && (
                  <motion.div
                    variants={childVariants}
                    initial='hidden'
                    animate='visible'
                  >
                    <h3 className='text-lg font-semibold mb-3 text-gray-900'>
                      Description
                    </h3>
                    <p className='text-gray-700 leading-relaxed text-base'>
                      {photo.description}
                    </p>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Related Photos */}
          <motion.div
            initial='hidden'
            animate='visible'
            variants={fadeInVariants}
            transition={{ delay: 0.3 }}
          >
            <Card className='shadow-lg'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <div>
                    <h2 className='text-2xl font-bold text-gray-900'>
                      Related Photos
                    </h2>
                    <p className='text-gray-600 mt-1'>
                      More photos from the {categoryInfo?.name} category
                    </p>
                  </div>
                  <Button
                    variant='outline'
                    onClick={handleBrowseCategory}
                    className='flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300'
                  >
                    <Eye className='w-4 h-4' />
                    Browse Category
                  </Button>
                </div>

                {isRelatedLoading ? (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className='space-y-3'>
                        <Skeleton className='w-full h-48 rounded-lg' />
                        <Skeleton className='h-4 w-3/4' />
                        <Skeleton className='h-3 w-1/2' />
                      </div>
                    ))}
                  </div>
                ) : relatedPhotos.length > 0 ? (
                  <motion.div
                    variants={staggerVariants}
                    initial='hidden'
                    animate='visible'
                    className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  >
                    {relatedPhotos.map((relatedPhoto) => (
                      <motion.div
                        key={relatedPhoto._id}
                        variants={childVariants}
                        whileHover={{ y: -4, scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className='group cursor-pointer'
                        onClick={() =>
                          handleRelatedPhotoClick(relatedPhoto._id)
                        }
                      >
                        <Card className='overflow-hidden border-0 shadow-md group-hover:shadow-xl transition-all duration-300'>
                          <div className='relative overflow-hidden'>
                            <img
                              src={relatedPhoto.images?.[0]?.src || ""}
                              alt={
                                relatedPhoto.images?.[0]?.alt ||
                                relatedPhoto.title
                              }
                              className='w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500'
                              loading='lazy'
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                            <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                              <div className='bg-white/90 backdrop-blur-sm rounded-full p-1'>
                                <ExternalLink className='w-3 h-3 text-gray-700' />
                              </div>
                            </div>
                          </div>
                          <CardContent className='p-4'>
                            <h3 className='font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-2'>
                              {relatedPhoto.title}
                            </h3>
                            <div className='flex items-center justify-between text-sm text-gray-600'>
                              <span className='flex items-center gap-1'>
                                <Calendar className='w-3 h-3' />
                                {formatDate(relatedPhoto.date)}
                              </span>
                              {relatedPhoto.location && (
                                <span className='flex items-center gap-1 truncate max-w-24'>
                                  <MapPin className='w-3 h-3 flex-shrink-0' />
                                  {relatedPhoto.location}
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className='text-center py-8'>
                    <div className='text-gray-500 mb-2'>
                      No related photos found in this category
                    </div>
                    <Button
                      variant='outline'
                      onClick={() => navigate("/photo-gallery")}
                      size='sm'
                    >
                      Browse All Photos
                    </Button>
                  </div>
                )}

                {relatedPhotos.length >= 6 && (
                  <div className='text-center mt-6'>
                    <Button
                      variant='outline'
                      onClick={handleBrowseCategory}
                      size='lg'
                      className='hover:bg-blue-50 hover:border-blue-300'
                    >
                      View All {categoryInfo?.name} Photos
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Lightbox Modal */}
          {showLightbox && photo.images && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4'
              onClick={() => setShowLightbox(false)}
            >
              <div
                className='relative max-w-7xl max-h-full'
                onClick={(e) => e.stopPropagation()}
              >
                {/* Controls */}
                <div className='absolute top-4 right-4 z-10 flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20'
                    onClick={handleDownload}
                  >
                    <Download className='w-4 h-4' />
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20'
                    onClick={() => setShowLightbox(false)}
                  >
                    <X className='w-4 h-4' />
                  </Button>
                </div>

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
                      className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20'
                      onClick={prevImage}
                      disabled={currentImageIndex === 0}
                    >
                      <ChevronLeft className='w-5 h-5' />
                    </Button>

                    <Button
                      variant='outline'
                      size='sm'
                      className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20'
                      onClick={nextImage}
                      disabled={currentImageIndex === photo.images.length - 1}
                    >
                      <ChevronRight className='w-5 h-5' />
                    </Button>

                    {/* Counter with thumbnails */}
                    <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2'>
                      <div className='bg-black/70 text-white px-4 py-2 rounded-full backdrop-blur-sm flex items-center gap-4'>
                        <span className='text-sm font-medium'>
                          {currentImageIndex + 1} / {photo.images.length}
                        </span>
                        <div className='flex gap-1'>
                          {photo.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentImageIndex
                                  ? "bg-white"
                                  : "bg-white/40"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ViewPhotoId;
