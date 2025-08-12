import { useState } from "react";
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

// Import API hooks from project knowledge
import {
  useGetPhotosQuery,
  useGetPhotosByCategoryQuery,
} from "@/redux-store/services/photoApi";
import {
  useGetVideosByCategoryQuery,
  useGetVideosQuery,
} from "@/redux-store/services/videoApi";

// Import types from project knowledge
import {
  Video,
  getVideoCategoryName,
  getVideoCategoryId,
} from "@/types/video.types";
import { Photo } from "@/types/photo.types";
import { formatDate, getPhotoCategoryName } from "./galleryHelper";
import { cn } from "@/constants/utils";
import { getCategoryColor } from "./getColor";

// Types for common props
interface MediaItemProps {
  item: Photo | Video;
  index: number;
  isHovered: boolean;
  onHover: (index: number | null) => void;
  onClick: (item: Photo | Video) => void;
  onCategoryFilter: (categoryId: string) => void;
}

const HomeGallery = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // API hooks for photos
  const {
    data: photosData,
    isLoading: loadingPhotos,
    error: photosError,
  } = useGetPhotosQuery({
    page: 1,
    limit: activeTab === "photos" && !selectedCategory ? 6 : 6,
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
      category: selectedCategory!,
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
    limit: activeTab === "videos" && !selectedCategory ? "6" : "6",
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
      category: selectedCategory!,
      limit: 50,
    },
    {
      skip: !selectedCategory || activeTab !== "videos",
    }
  );

  // Helper function to get photo primary image
  const getPhotoMainImage = (photo: Photo) => {
    return photo.images && photo.images.length > 0
      ? photo.images[0]
      : { src: "/placeholder-image.jpg", alt: photo.title };
  };

  // Unified handlers
  const handleItemClick = (item: Photo | Video) => {
    if ("images" in item) {
      navigate(`/view/photo/${item._id}`);
    } else {
      navigate(`/view/video/${item._id}`);
    }
  };

  const handleCategoryFilter = (categoryId: string) => {
    console.log(`${activeTab} category filter:`, categoryId);
    setSelectedCategory(categoryId);
  };

  const clearCategoryFilter = () => {
    setSelectedCategory(null);
  };

  // Data extraction
  const photos =
    selectedCategory && activeTab === "photos"
      ? categoryPhotosData?.data?.photos || []
      : photosData?.data?.photos || [];

  const videos =
    selectedCategory && activeTab === "videos"
      ? categoryVideosData?.data?.videos || []
      : videosData?.data?.videos || [];

  // States
  const isLoading =
    loadingPhotos ||
    loadingVideos ||
    loadingCategoryPhotos ||
    loadingCategoryVideos;
  const hasError =
    photosError || videosError || categoryPhotosError || categoryVideosError;

  // Get category name for filtered view
  const selectedCategoryName = selectedCategory
    ? activeTab === "photos" && photos[0]
      ? getPhotoCategoryName(photos[0].category)
      : activeTab === "videos" && videos[0]
      ? getVideoCategoryName(videos[0].category)
      : "Category"
    : null;

  // Common gallery metadata component
  const GalleryMetadata = ({ item }: { item: Photo | Video }) => (
    <div className='flex items-center gap-4 text-sm opacity-90 flex-wrap'>
      <div className='flex items-center gap-1'>
        <Calendar className='h-4 w-4' />
        {formatDate(item.date)}
      </div>

      {"location" in item && item.location && (
        <div className='flex items-center gap-1'>
          <MapPin className='h-4 w-4' />
          <span className='truncate max-w-24'>{item.location}</span>
        </div>
      )}

      {"duration" in item && item.duration && (
        <div className='flex items-center gap-1'>
          <Clock className='h-4 w-4' />
          {item.duration}
        </div>
      )}
    </div>
  );

  // Common category badge component
  const CategoryBadge = ({
    categoryName,
    onViewAll,
  }: {
    categoryName: string;
    onViewAll: () => void;
  }) => (
    <div className='absolute top-4 left-4 flex items-center gap-2'>
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
          categoryName
        )}`}
      >
        {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
      </span>

      {!selectedCategory && (
        <button
          className='text-xs text-white bg-black/80 px-2 py-1 rounded-lg cursor-pointer hover:bg-black/70 transition-colors'
          onClick={(e) => {
            e.stopPropagation();
            onViewAll();
          }}
        >
          View All
        </button>
      )}
    </div>
  );

  // Photo Card Component
  const PhotoCard = ({
    item,
    index,
    isHovered,
    onHover,
    onClick,
    onCategoryFilter,
  }: MediaItemProps) => {
    const photo = item as Photo;
    const mainImage = getPhotoMainImage(photo);
    const categoryName = getPhotoCategoryName(photo.category);

    return (
      <motion.div
        key={photo._id}
        onMouseEnter={() => onHover(index)}
        onMouseLeave={() => onHover(null)}
        className={cn(
          "rounded-xl relative bg-gray-100 overflow-hidden h-60 md:h-80 w-full transition-all duration-300 ease-out",
          hovered !== null && hovered !== index
        )}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className='absolute inset-0 cursor-pointer'
          onClick={() => onClick(photo)}
        >
          <img
            src={mainImage.src}
            alt={mainImage.alt}
            className='w-full h-full object-cover'
            loading='lazy'
          />
        </div>

        <CategoryBadge
          categoryName={categoryName}
          onViewAll={() => onCategoryFilter(categoryName)}
        />

        {/* Hover overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 transition-opacity duration-300 pointer-events-none",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          <div className='text-white'>
            <h3 className='text-xl md:text-2xl font-bold mb-2 line-clamp-2'>
              {photo.title}
            </h3>

            <GalleryMetadata item={photo} />

            {photo.images && photo.images.length > 1 && (
              <div className='mt-2 text-xs opacity-75'>
                +{photo.images.length - 1} more photos
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Video Card Component
  const VideoCard = ({
    item,
    index,
    isHovered,
    onHover,
    onClick,
    onCategoryFilter,
  }: MediaItemProps) => {
    const video = item as Video;
    const categoryName = getVideoCategoryName(video.category);

    return (
      <motion.div
        key={video._id}
        onClick={() => onClick(video)}
        onMouseEnter={() => onHover(index + 1000)}
        onMouseLeave={() => onHover(null)}
        className={cn(
          "rounded-xl relative bg-gray-100 overflow-hidden h-60 md:h-80 w-full transition-all duration-300 ease-out cursor-pointer group",
          hovered !== null && hovered !== index + 1000
        )}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className='absolute inset-0'>
          <img
            src={video.thumbnail}
            alt={video.title}
            className='w-full h-full object-cover'
            loading='lazy'
          />

          {/* Play button overlay */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform'>
              <Play
                className='w-8 h-8 text-[#FF9933] ml-1'
                fill='currentColor'
              />
            </div>
          </div>
        </div>

        <CategoryBadge
          categoryName={categoryName}
          onViewAll={() => {
            const categoryId = getVideoCategoryId(video.category);
            onCategoryFilter(categoryId);
          }}
        />

        {/* Hover overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          <div className='text-white'>
            <h3 className='text-xl md:text-2xl font-bold mb-2 line-clamp-2'>
              {video.title}
            </h3>

            <GalleryMetadata item={video} />

            {video.description && (
              <p className='mt-2 text-xs opacity-75 line-clamp-2'>
                {video.description}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Gallery Grid Component
  const GalleryGrid = ({
    items,
    isPhotos,
    isLoading: gridLoading,
  }: {
    items: (Photo | Video)[];
    isPhotos: boolean;
    isLoading: boolean;
  }) => {
    if (gridLoading) {
      return (
        <div className='flex justify-center'>
          <Loader2 className='w-8 h-8 animate-spin text-[#138808]' />
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className='text-center py-12'>
          <p className='text-muted-foreground text-lg'>
            No {isPhotos ? "photos" : "videos"} available
            {selectedCategory ? " in this category" : " at the moment"}.
          </p>
        </div>
      );
    }

    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto'>
        {items.map((item, index) => {
          const isHovered = hovered === (isPhotos ? index : index + 1000);

          return isPhotos ? (
            <PhotoCard
              key={item._id}
              item={item}
              index={index}
              isHovered={isHovered}
              onHover={setHovered}
              onClick={handleItemClick}
              onCategoryFilter={handleCategoryFilter}
            />
          ) : (
            <VideoCard
              key={item._id}
              item={item}
              index={index}
              isHovered={isHovered}
              onHover={setHovered}
              onClick={handleItemClick}
              onCategoryFilter={handleCategoryFilter}
            />
          );
        })}
      </div>
    );
  };

  // Header Component
  const GalleryHeader = () => (
    <div className='text-center max-w-3xl mx-auto mb-10 md:mb-12'>
      <div className='inline-block px-4 py-1.5 rounded-full bg-[#138808]/10 text-[#138808] font-medium text-sm mb-4'>
        {selectedCategory ? "Gallery" : "Our Pawfect Moments"}
      </div>

      <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight'>
        {selectedCategory
          ? `${selectedCategoryName} ${
              activeTab === "photos" ? "Photos" : "Videos"
            }`
          : selectedCategory
          ? "Pawprints of Love"
          : "Moments from the Journey"}
      </h2>

      <p className='text-muted-foreground mt-4 px-2'>
        {selectedCategory
          ? `${
              activeTab === "photos" ? "Photos" : "Videos"
            } from ${selectedCategoryName} category`
          : selectedCategory
          ? "Heartwarming moments from rescue to wagging tails."
          : "A glimpse into our work, community engagement, and public events."}
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
  );

  // Loading state
  if (isLoading && !selectedCategory) {
    return (
      <section id='gallery' className='py-12 md:py-16 lg:py-24 bg-slate-50'>
        <div className='container px-4 sm:px-6'>
          <GalleryHeader />
          <div className='flex justify-center'>
            <Loader2 className='w-8 h-8 animate-spin text-[#138808]' />
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (hasError) {
    return (
      <section id='gallery' className='py-12 md:py-16 lg:py-24 bg-slate-50'>
        <div className='container px-4 sm:px-6'>
          <GalleryHeader />
          <Alert variant='destructive' className='max-w-md mx-auto'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              Failed to load gallery content. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  return (
    <section id='gallery' className='py-12 md:py-16 lg:py-24 bg-slate-50'>
      <div className='container px-4 sm:px-6'>
        <GalleryHeader />

        {selectedCategory ? (
          // Category filtered view
          <GalleryGrid
            items={activeTab === "photos" ? photos : videos}
            isPhotos={activeTab === "photos"}
            isLoading={
              (loadingCategoryPhotos && activeTab === "photos") ||
              (loadingCategoryVideos && activeTab === "videos")
            }
          />
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
              <GalleryGrid items={photos} isPhotos={true} isLoading={false} />
            </TabsContent>

            {/* Videos Tab Content */}
            <TabsContent value='videos' className='w-full'>
              <GalleryGrid items={videos} isPhotos={false} isLoading={false} />
            </TabsContent>

            {/* See More Button */}
            <div className='text-center mt-8'>
              <button
                onClick={() => {
                  navigate(activeTab === "photos" ? "/gallery" : "/gallery");
                }}
                className='px-6 py-3 bg-white text-black font-medium rounded-lg hover:from-[#FF9933]/90 hover:to-[#138808]/90 transition-all duration-300 shadow-lg hover:shadow-xl'
              >
                See More {activeTab === "photos" ? "Photos" : "Videos"}
              </button>
            </div>
          </Tabs>
        )}
      </div>
    </section>
  );
};

export default HomeGallery;
