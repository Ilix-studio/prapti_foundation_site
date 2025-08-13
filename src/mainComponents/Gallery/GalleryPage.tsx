import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Play,
  Calendar,
  MapPin,
  Camera,
  Loader2,
  AlertCircle,
  PlayCircle,
} from "lucide-react";
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

// Import types
import { Video, getVideoCategoryName } from "@/types/video.types";
import { Photo } from "@/types/photo.types";
import { getPhotoCategoryName } from "./galleryHelper";

const categories = [
  "All",
  "Rescues",
  "Adoptions",
  "Medical",
  "Community",
  "Daily Life",
  "Training",
];

const GalleryPage: React.FC = () => {
  const [photoFilter, setPhotoFilter] = useState("All");
  const [videoFilter, setVideoFilter] = useState("All");

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
      category: photoFilter,
      limit: 50,
    },
    {
      skip: photoFilter === "All",
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
      category: videoFilter,
      limit: 50,
    },
    {
      skip: videoFilter === "All",
    }
  );

  // Helper function to get photo primary image
  const getPhotoMainImage = (photo: Photo) => {
    return photo.images && photo.images.length > 0
      ? photo.images[0]
      : { src: "/placeholder-image.jpg", alt: photo.title };
  };

  // Get filtered data
  const photos =
    photoFilter === "All"
      ? photosData?.data?.photos || []
      : categoryPhotosData?.data?.photos || [];

  const videos =
    videoFilter === "All"
      ? videosData?.data?.videos || []
      : categoryVideosData?.data?.videos || [];

  const filteredPhotos = photos;
  const filteredVideos = videos;

  const PhotoCard = ({ photo }: { photo: Photo }) => {
    const mainImage = getPhotoMainImage(photo);
    const categoryName = getPhotoCategoryName(photo.category);

    return (
      <div className='group relative overflow-hidden rounded-lg transition-transform hover:scale-105 shadow-lg'>
        <img
          src={mainImage.src}
          alt={mainImage.alt}
          className='w-full h-64 object-cover transition-transform group-hover:scale-110'
        />
        <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center'>
          <div className='opacity-0 group-hover:opacity-100 transition-opacity text-white text-center p-4'>
            <h3 className='font-semibold text-lg mb-2'>{photo.title}</h3>
            <p className='text-sm'>{photo.description}</p>
          </div>
        </div>
        <div className='absolute top-2 right-2'>
          <Badge className='bg-orange-500 text-white'>{categoryName}</Badge>
        </div>
        <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4'>
          <div className='text-white'>
            <h4 className='font-medium text-sm mb-1'>{photo.title}</h4>
            <div className='flex items-center gap-2 text-xs opacity-90'>
              <div className='flex items-center gap-1'>
                <Calendar className='h-3 w-3' />
                {new Date(photo.date).toLocaleDateString()}
              </div>
              {photo.location && (
                <div className='flex items-center gap-1'>
                  <MapPin className='h-3 w-3' />
                  <span className='truncate'>{photo.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const VideoCard = ({ video }: { video: Video }) => {
    const categoryName = getVideoCategoryName(video.category);

    return (
      <div className='group relative overflow-hidden rounded-lg shadow-lg'>
        <div className='relative'>
          <img
            src={video.thumbnail}
            alt={video.title}
            className='w-full h-64 object-cover transition-transform group-hover:scale-105'
          />
          <div className='absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center'>
            <div className='bg-white bg-opacity-90 rounded-full p-4 group-hover:scale-110 transition-transform'>
              <Play className='h-8 w-8 text-orange-500' />
            </div>
          </div>
          <div className='absolute bottom-2 right-2'>
            <Badge className='bg-black bg-opacity-70 text-white'>
              {video.duration}
            </Badge>
          </div>
          <div className='absolute top-2 right-2'>
            <Badge className='bg-orange-500 text-white'>{categoryName}</Badge>
          </div>
          <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4'>
            <div className='text-white'>
              <h4 className='font-medium text-sm mb-1'>{video.title}</h4>
              <div className='flex items-center gap-2 text-xs opacity-90'>
                <div className='flex items-center gap-1'>
                  <Calendar className='h-3 w-3' />
                  {new Date(video.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  const isLoading =
    loadingPhotos ||
    loadingVideos ||
    loadingCategoryPhotos ||
    loadingCategoryVideos;
  const hasError =
    photosError || videosError || categoryPhotosError || categoryVideosError;

  if (isLoading) {
    return (
      <>
        <Header />
        <section className='w-full py-12 md:py-24 lg:py-32 bg-white'>
          <div className='container px-4 md:px-6'>
            <div className='text-center mb-12'>
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
        <section className='w-full py-12 md:py-24 lg:py-32 bg-white'>
          <div className='container px-4 md:px-6'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4'>
                Our Gallery
              </h2>
              <p className='text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-3xl mx-auto'>
                Witness the incredible journey of rescue, recovery, and love.
                Every photo and video tells a story of hope, healing, and the
                unbreakable bond between humans and animals.
              </p>
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

      <section className='w-full py-12 md:py-24 lg:py-32 bg-white'>
        <div className='container px-4 md:px-6'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4'>
              Our Gallery
            </h2>
            <p className='text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-3xl mx-auto'>
              Witness the incredible journey of rescue, recovery, and love.
              Every photo and video tells a story of hope, healing, and the
              unbreakable bond between humans and animals.
            </p>
          </div>

          <Tabs defaultValue='photos' className='w-full'>
            <TabsList className='grid w-full max-w-md mx-auto grid-cols-2 mb-8'>
              <TabsTrigger value='photos' className='flex items-center gap-2'>
                <Camera className='h-4 w-4' />
                Photos
              </TabsTrigger>
              <TabsTrigger value='videos' className='flex items-center gap-2'>
                <PlayCircle className='h-4 w-4' />
                Videos
              </TabsTrigger>
            </TabsList>

            <TabsContent value='photos'>
              {/* Photo Filters */}
              <div className='flex flex-wrap gap-2 justify-center mb-8'>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={photoFilter === category ? "default" : "outline"}
                    size='sm'
                    onClick={() => setPhotoFilter(category)}
                    className={
                      photoFilter === category
                        ? "bg-orange-500 hover:bg-orange-600"
                        : ""
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Photos Grid */}
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredPhotos.map((photo) => (
                  <PhotoCard key={photo._id} photo={photo} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value='videos'>
              {/* Video Filters */}
              <div className='flex flex-wrap gap-2 justify-center mb-8'>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={videoFilter === category ? "default" : "outline"}
                    size='sm'
                    onClick={() => setVideoFilter(category)}
                    className={
                      videoFilter === category
                        ? "bg-orange-500 hover:bg-orange-600"
                        : ""
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Videos Grid */}
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredVideos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default GalleryPage;
