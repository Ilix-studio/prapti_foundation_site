import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Loader2,
  Play,
  Clock,
  AlertCircle,
  X,
  Camera,
  PlayCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Footer from "../Footer";
import { Header } from "../Header";

// Import API hooks
import {
  useGetPhotosQuery,
  useGetPhotosByCategoryQuery,
} from "@/redux-store/services/photoApi";
import {
  useGetVideosByCategoryQuery,
  useGetVideosQuery,
} from "@/redux-store/services/videoApi";
import { useGetCategoriesByTypeQuery } from "@/redux-store/services/categoryApi";

// Import types
import { Video, getVideoCategoryName } from "@/types/video.types";
import { Photo } from "@/types/photo.types";
import { getPhotoCategoryName } from "./galleryHelper";
import { getCategoryColor } from "./getColor";
import { formatDate } from "./galleryHelper";
import { cn } from "@/constants/utils";

const GalleryPage: React.FC = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch categories for photos and videos
  const {
    data: photoCategories = [],
    isLoading: loadingPhotoCategories,
    error: photoCategoriesError,
  } = useGetCategoriesByTypeQuery("photo");

  const {
    data: videoCategories = [],
    isLoading: loadingVideoCategories,
    error: videoCategoriesError,
  } = useGetCategoriesByTypeQuery("video");

  // Create filter options with "All" prepended
  const photoFilterOptions = useMemo(
    () => [
      { _id: "All", name: "All", type: "photo" as const },
      ...photoCategories,
    ],
    [photoCategories]
  );

  const videoFilterOptions = useMemo(
    () => [
      { _id: "All", name: "All", type: "video" as const },
      ...videoCategories,
    ],
    [videoCategories]
  );

  // Helper function to get category name for filtering
  const getCategoryFilterValue = (categoryId: string, isPhoto: boolean) => {
    if (categoryId === "All") return "All";

    const categories = isPhoto ? photoCategories : videoCategories;
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : categoryId;
  };

  // API hooks for photos
  const {
    data: photosData,
    isLoading: loadingPhotos,
    error: photosError,
  } = useGetPhotosQuery({
    page: 1,
    limit: 50,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // API hook for category-filtered photos
  const {
    data: categoryPhotosData,
    isLoading: loadingCategoryPhotos,
    error: categoryPhotosError,
  } = useGetPhotosByCategoryQuery(
    {
      category: getCategoryFilterValue(selectedCategory!, true),
      limit: 50,
    },
    {
      skip: !selectedCategory || activeTab !== "photos",
    }
  );

  // API hooks for videos
  const {
    data: videosData,
    isLoading: loadingVideos,
    error: videosError,
  } = useGetVideosQuery({
    page: "1",
    limit: "50",
    sortBy: "date",
    sortOrder: "desc",
  });

  // API hook for category-filtered videos
  const {
    data: categoryVideosData,
    isLoading: loadingCategoryVideos,
    error: categoryVideosError,
  } = useGetVideosByCategoryQuery(
    {
      category: getCategoryFilterValue(selectedCategory!, false),
      limit: 50,
    },
    {
      skip: !selectedCategory || activeTab !== "videos",
    }
  );

  // Helper function to get photo primary image
  const getPhotoMainImage = (photo: Photo) => {
    if (photo.images && photo.images.length > 0) {
      const firstImage = photo.images[0];
      if (typeof firstImage === "string") {
        return { src: firstImage, alt: photo.title };
      } else if (firstImage && typeof firstImage === "object") {
        return {
          src: firstImage.src || "",
          alt: firstImage.alt || photo.title,
        };
      }
    }
    return { src: "/placeholder-image.jpg", alt: photo.title };
  };

  // Handle navigation
  const handlePhotoClick = (photo: Photo) => {
    navigate(`/view/photo/${photo._id}`);
  };

  const handleVideoClick = (video: Video) => {
    navigate(`/view/video/${video._id}`);
  };

  // Handle category filtering
  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const clearCategoryFilter = () => {
    setSelectedCategory(null);
  };

  // Get filtered data
  const photos =
    selectedCategory && activeTab === "photos"
      ? categoryPhotosData?.data?.photos || []
      : photosData?.data?.photos || [];

  const videos =
    selectedCategory && activeTab === "videos"
      ? categoryVideosData?.data?.videos || []
      : videosData?.data?.videos || [];

  // Loading and error states
  const isLoading =
    loadingPhotos ||
    loadingVideos ||
    loadingCategoryPhotos ||
    loadingCategoryVideos ||
    loadingPhotoCategories ||
    loadingVideoCategories;

  const hasError =
    photosError ||
    videosError ||
    categoryPhotosError ||
    categoryVideosError ||
    photoCategoriesError ||
    videoCategoriesError;

  // Get category name for filtered view
  const selectedCategoryName = selectedCategory
    ? activeTab === "photos" && photos[0]
      ? getPhotoCategoryName(photos[0].category)
      : activeTab === "videos" && videos[0]
      ? getVideoCategoryName(videos[0].category)
      : "Category"
    : null;

  // Loading state
  if (isLoading && !selectedCategory) {
    return (
      <>
        <Header />
        <section className='w-full py-12 md:py-24 lg:py-32 bg-slate-50'>
          <div className='container px-4 md:px-6'>
            <div className='text-center mb-12'>
              <div className='inline-block px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-600 font-medium text-sm mb-4'>
                Gallery
              </div>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4'>
                Our Gallery
              </h2>
              <p className='text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-3xl mx-auto'>
                Witness the incredible journey of rescue, recovery, and love.
                Every photo and video tells a story of hope, healing, and the
                unbreakable bond between humans and animals.
              </p>
            </div>
            <div className='flex justify-center'>
              <Loader2 className='w-8 h-8 animate-spin text-orange-500' />
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  // Error state
  if (hasError) {
    return (
      <>
        <Header />
        <section className='w-full py-12 md:py-24 lg:py-32 bg-slate-50'>
          <div className='container px-4 md:px-6'>
            <div className='text-center mb-12'>
              <div className='inline-block px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-600 font-medium text-sm mb-4'>
                Gallery
              </div>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4'>
                Our Gallery
              </h2>
            </div>
            <Alert variant='destructive' className='max-w-md mx-auto'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>
                Failed to load gallery content. Please try again later.
              </AlertDescription>
            </Alert>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <section className='w-full py-12 md:py-24 lg:py-32 bg-slate-50'>
        <div className='container px-4 md:px-6'>
          {/* Header */}
          <div className='text-center max-w-3xl mx-auto mb-10 md:mb-12'>
            <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight'>
              {selectedCategory
                ? `${selectedCategoryName} ${
                    activeTab === "photos" ? "Photos" : "Videos"
                  }`
                : "Our Gallery"}
            </h2>
            <p className='text-muted-foreground mt-4 px-2'>
              {selectedCategory
                ? `${
                    activeTab === "photos" ? "Photos" : "Videos"
                  } from ${selectedCategoryName} category`
                : "Witness the incredible journey of rescue, recovery, and love. Every photo and video tells a story of hope, healing, and the unbreakable bond between humans and animals."}
            </p>
            {selectedCategory && (
              <button
                onClick={clearCategoryFilter}
                className='mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
              >
                <X className='w-4 h-4' />
                Back to {activeTab === "photos" ? "Photos" : "Videos"}
              </button>
            )}
          </div>

          {selectedCategory ? (
            // Category filtered view
            <div className='w-full'>
              {(loadingCategoryPhotos && activeTab === "photos") ||
              (loadingCategoryVideos && activeTab === "videos") ? (
                <div className='flex justify-center'>
                  <Loader2 className='w-8 h-8 animate-spin text-orange-500' />
                </div>
              ) : (activeTab === "photos" ? photos : videos).length === 0 ? (
                <div className='text-center py-12'>
                  <p className='text-muted-foreground text-lg'>
                    No {activeTab} available in this category.
                  </p>
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto'>
                  {activeTab === "photos"
                    ? photos.map((photo, index) => {
                        const mainImage = getPhotoMainImage(photo);
                        const categoryName = getPhotoCategoryName(
                          photo.category
                        );

                        return (
                          <motion.div
                            key={photo._id}
                            onClick={() => handlePhotoClick(photo)}
                            onMouseEnter={() => setHovered(index)}
                            onMouseLeave={() => setHovered(null)}
                            className={cn(
                              "rounded-xl relative bg-gray-100 overflow-hidden h-60 md:h-80 w-full transition-all duration-300 ease-out cursor-pointer",
                              hovered !== null &&
                                hovered !== index &&
                                "blur-sm scale-[0.98]"
                            )}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className='absolute inset-0'>
                              <img
                                src={mainImage.src}
                                alt={mainImage.alt}
                                className='w-full h-full object-cover'
                                loading='lazy'
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/placeholder-image.jpg";
                                }}
                              />
                            </div>

                            {/* Category badge */}
                            <div className='absolute top-4 left-4'>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                                  categoryName
                                )}`}
                              >
                                {categoryName.charAt(0).toUpperCase() +
                                  categoryName.slice(1)}
                              </span>
                            </div>

                            {/* Hover overlay */}
                            <div
                              className={cn(
                                "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 transition-opacity duration-300",
                                hovered === index ? "opacity-100" : "opacity-0"
                              )}
                            >
                              <div className='text-white'>
                                <h3 className='text-xl md:text-2xl font-bold mb-2 line-clamp-2'>
                                  {photo.title}
                                </h3>
                                <div className='flex items-center gap-4 text-sm opacity-90'>
                                  <div className='flex items-center gap-1'>
                                    <Calendar className='h-4 w-4' />
                                    {formatDate(photo.date)}
                                  </div>
                                  {photo.location && (
                                    <div className='flex items-center gap-1'>
                                      <MapPin className='h-4 w-4' />
                                      <span className='truncate max-w-24'>
                                        {photo.location}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {photo.images && photo.images.length > 1 && (
                                  <div className='mt-2 text-xs opacity-75'>
                                    +{photo.images.length - 1} more photos
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    : videos.map((video, index) => {
                        const categoryName = getVideoCategoryName(
                          video.category
                        );

                        return (
                          <motion.div
                            key={video._id}
                            onClick={() => handleVideoClick(video)}
                            onMouseEnter={() => setHovered(index + 1000)}
                            onMouseLeave={() => setHovered(null)}
                            className={cn(
                              "rounded-xl relative bg-gray-100 overflow-hidden h-60 md:h-80 w-full transition-all duration-300 ease-out cursor-pointer group",
                              hovered !== null &&
                                hovered !== index + 1000 &&
                                "blur-sm scale-[0.98]"
                            )}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className='absolute inset-0'>
                              <img
                                src={
                                  video.thumbnail || "/placeholder-video.jpg"
                                }
                                alt={video.title}
                                className='w-full h-full object-cover'
                                loading='lazy'
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/placeholder-video.jpg";
                                }}
                              />

                              {/* Play button overlay */}
                              <div className='absolute inset-0 flex items-center justify-center'>
                                <div className='w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform'>
                                  <Play
                                    className='w-8 h-8 text-orange-500 ml-1'
                                    fill='currentColor'
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Category badge */}
                            <div className='absolute top-4 left-4'>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                                  categoryName
                                )}`}
                              >
                                {categoryName.charAt(0).toUpperCase() +
                                  categoryName.slice(1)}
                              </span>
                            </div>

                            {/* Hover overlay */}
                            <div
                              className={cn(
                                "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 transition-opacity duration-300",
                                hovered === index + 1000
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            >
                              <div className='text-white'>
                                <h3 className='text-xl md:text-2xl font-bold mb-2 line-clamp-2'>
                                  {video.title}
                                </h3>
                                <div className='flex items-center gap-4 text-sm opacity-90 flex-wrap'>
                                  <div className='flex items-center gap-1'>
                                    <Calendar className='h-4 w-4' />
                                    {formatDate(video.date)}
                                  </div>
                                  {video.duration && (
                                    <div className='flex items-center gap-1'>
                                      <Clock className='h-4 w-4' />
                                      {video.duration}
                                    </div>
                                  )}
                                </div>
                                {video.description && (
                                  <p className='mt-2 text-xs opacity-75 line-clamp-2'>
                                    {video.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                </div>
              )}
            </div>
          ) : (
            // Regular gallery view with tabs
            <Tabs
              defaultValue='photos'
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as "photos" | "videos")
              }
              className='w-full'
            >
              <TabsList className='grid w-full max-w-md mx-auto grid-cols-2 mb-8'>
                <TabsTrigger value='photos' className='flex items-center gap-2'>
                  <Camera className='h-4 w-4' />
                  Photos ({photos.length})
                </TabsTrigger>
                <TabsTrigger value='videos' className='flex items-center gap-2'>
                  <PlayCircle className='h-4 w-4' />
                  Videos ({videos.length})
                </TabsTrigger>
              </TabsList>

              {/* Photos Tab Content */}
              <TabsContent value='photos' className='w-full'>
                {/* Photo Filters */}
                <div className='flex flex-wrap gap-2 justify-center mb-8'>
                  {photoFilterOptions.map((category) => (
                    <Button
                      key={category._id}
                      variant={
                        (!selectedCategory && category._id === "All") ||
                        selectedCategory === category._id
                          ? "default"
                          : "outline"
                      }
                      size='sm'
                      onClick={() => {
                        if (category._id === "All") {
                          clearCategoryFilter();
                        } else {
                          handleCategoryFilter(category._id);
                        }
                      }}
                      className={
                        (!selectedCategory && category._id === "All") ||
                        selectedCategory === category._id
                          ? "bg-orange-500 hover:bg-orange-600"
                          : ""
                      }
                      disabled={loadingPhotoCategories}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>

                {photos.length === 0 ? (
                  <div className='text-center py-12'>
                    <p className='text-muted-foreground text-lg'>
                      No photos available at the moment.
                    </p>
                  </div>
                ) : (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto'>
                    {photos.map((photo, index) => {
                      const mainImage = getPhotoMainImage(photo);
                      const categoryName = getPhotoCategoryName(photo.category);

                      return (
                        <motion.div
                          key={photo._id}
                          onMouseEnter={() => setHovered(index)}
                          onMouseLeave={() => setHovered(null)}
                          className={cn(
                            "rounded-xl relative bg-gray-100 overflow-hidden h-60 md:h-80 w-full transition-all duration-300 ease-out",
                            hovered !== null &&
                              hovered !== index &&
                              "blur-sm scale-[0.98]"
                          )}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div
                            className='absolute inset-0 cursor-pointer'
                            onClick={() => handlePhotoClick(photo)}
                          >
                            <img
                              src={mainImage.src}
                              alt={mainImage.alt}
                              className='w-full h-full object-cover'
                              loading='lazy'
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder-image.jpg";
                              }}
                            />
                          </div>

                          {/* Category badge with view all button */}
                          <div className='absolute top-4 left-4 flex items-center gap-2'>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                                categoryName
                              )}`}
                            >
                              {categoryName.charAt(0).toUpperCase() +
                                categoryName.slice(1)}
                            </span>
                            {!selectedCategory && (
                              <button
                                className='text-xs text-white bg-black/80 px-2 py-1 rounded-lg cursor-pointer hover:bg-black/70 transition-colors'
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCategoryFilter(categoryName);
                                }}
                              >
                                View All
                              </button>
                            )}
                          </div>

                          {/* Hover overlay */}
                          <div
                            className={cn(
                              "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 transition-opacity duration-300 pointer-events-none",
                              hovered === index ? "opacity-100" : "opacity-0"
                            )}
                          >
                            <div className='text-white'>
                              <h3 className='text-xl md:text-2xl font-bold mb-2 line-clamp-2'>
                                {photo.title}
                              </h3>
                              <div className='flex items-center gap-4 text-sm opacity-90'>
                                <div className='flex items-center gap-1'>
                                  <Calendar className='h-4 w-4' />
                                  {formatDate(photo.date)}
                                </div>
                                {photo.location && (
                                  <div className='flex items-center gap-1'>
                                    <MapPin className='h-4 w-4' />
                                    <span className='truncate max-w-24'>
                                      {photo.location}
                                    </span>
                                  </div>
                                )}
                              </div>
                              {photo.images && photo.images.length > 1 && (
                                <div className='mt-2 text-xs opacity-75'>
                                  +{photo.images.length - 1} more photos
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              {/* Videos Tab Content */}
              <TabsContent value='videos' className='w-full'>
                {/* Video Filters */}
                <div className='flex flex-wrap gap-2 justify-center mb-8'>
                  {videoFilterOptions.map((category) => (
                    <Button
                      key={category._id}
                      variant={
                        (!selectedCategory && category._id === "All") ||
                        selectedCategory === category._id
                          ? "default"
                          : "outline"
                      }
                      size='sm'
                      onClick={() => {
                        if (category._id === "All") {
                          clearCategoryFilter();
                        } else {
                          handleCategoryFilter(category._id);
                        }
                      }}
                      className={
                        (!selectedCategory && category._id === "All") ||
                        selectedCategory === category._id
                          ? "bg-orange-500 hover:bg-orange-600"
                          : ""
                      }
                      disabled={loadingVideoCategories}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>

                {videos.length === 0 ? (
                  <div className='text-center py-12'>
                    <p className='text-muted-foreground text-lg'>
                      No videos available at the moment.
                    </p>
                  </div>
                ) : (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto'>
                    {videos.map((video, index) => {
                      const categoryName = getVideoCategoryName(video.category);

                      return (
                        <motion.div
                          key={video._id}
                          onClick={() => handleVideoClick(video)}
                          onMouseEnter={() => setHovered(index + 1000)}
                          onMouseLeave={() => setHovered(null)}
                          className={cn(
                            "rounded-xl relative bg-gray-100 overflow-hidden h-60 md:h-80 w-full transition-all duration-300 ease-out cursor-pointer group",
                            hovered !== null &&
                              hovered !== index + 1000 &&
                              "blur-sm scale-[0.98]"
                          )}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className='absolute inset-0'>
                            <img
                              src={video.thumbnail || "/placeholder-video.jpg"}
                              alt={video.title}
                              className='w-full h-full object-cover'
                              loading='lazy'
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder-video.jpg";
                              }}
                            />

                            {/* Play button overlay */}
                            <div className='absolute inset-0 flex items-center justify-center'>
                              <div className='w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform'>
                                <Play
                                  className='w-8 h-8 text-orange-500 ml-1'
                                  fill='currentColor'
                                />
                              </div>
                            </div>
                          </div>

                          {/* Category badge with view all button */}
                          <div className='absolute top-4 left-4 flex items-center gap-2'>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                                categoryName
                              )}`}
                            >
                              {categoryName.charAt(0).toUpperCase() +
                                categoryName.slice(1)}
                            </span>
                            {!selectedCategory && (
                              <button
                                className='text-xs text-white bg-black/80 px-2 py-1 rounded-lg cursor-pointer hover:bg-black/70 transition-colors'
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCategoryFilter(categoryName);
                                }}
                              >
                                View All
                              </button>
                            )}
                          </div>

                          {/* Hover overlay */}
                          <div
                            className={cn(
                              "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 transition-opacity duration-300",
                              hovered === index + 1000
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          >
                            <div className='text-white'>
                              <h3 className='text-xl md:text-2xl font-bold mb-2 line-clamp-2'>
                                {video.title}
                              </h3>
                              <div className='flex items-center gap-4 text-sm opacity-90 flex-wrap'>
                                <div className='flex items-center gap-1'>
                                  <Calendar className='h-4 w-4' />
                                  {formatDate(video.date)}
                                </div>
                                {video.duration && (
                                  <div className='flex items-center gap-1'>
                                    <Clock className='h-4 w-4' />
                                    {video.duration}
                                  </div>
                                )}
                              </div>
                              {video.description && (
                                <p className='mt-2 text-xs opacity-75 line-clamp-2'>
                                  {video.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default GalleryPage;
