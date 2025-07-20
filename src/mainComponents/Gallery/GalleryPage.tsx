import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Calendar,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Video,
} from "lucide-react";
import Footer from "../Footer";
import { Header } from "../Header";

// Sample data - replace with real data from your API
const galleryData = {
  photos: [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop",
      alt: "Happy rescued dog playing in the garden",
      title: "Bella's First Day of Freedom",
      description: "Bella discovering joy after her rescue from the streets",
      category: "Rescues",
      date: "2024-05-15",
      location: "Prapti Foundation Shelter",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop",
      alt: "Volunteers feeding stray dogs",
      title: "Community Feeding Drive",
      description: "Our volunteers ensuring no dog goes hungry",
      category: "Community",
      date: "2024-05-10",
      location: "Various Locations",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop",
      alt: "Dog getting medical treatment",
      title: "Medical Care Excellence",
      description: "Providing top-notch veterinary care",
      category: "Medical",
      date: "2024-05-08",
      location: "Prapti Medical Center",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop",
      alt: "Dog adoption event",
      title: "Forever Homes Found",
      description: "Successful adoption event connecting hearts",
      category: "Adoptions",
      date: "2024-05-05",
      location: "City Park",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=600&h=400&fit=crop",
      alt: "Dogs playing together",
      title: "Social Hour Fun",
      description: "Our rescued dogs enjoying playtime together",
      category: "Daily Life",
      date: "2024-05-03",
      location: "Prapti Foundation Shelter",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop",
      alt: "Training session",
      title: "Training Success Stories",
      description: "Teaching good manners for better adoption chances",
      category: "Training",
      date: "2024-05-01",
      location: "Training Grounds",
    },
  ],
  videos: [
    {
      id: 1,
      thumbnail:
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop",
      title: "Rescue Mission: Saving Lives on the Streets",
      description:
        "Follow our team as they rescue abandoned dogs from harsh conditions",
      duration: "3:45",
      category: "Rescues",
      date: "2024-05-12",
    },
    {
      id: 2,
      thumbnail:
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop",
      title: "A Day in the Life at Prapti Foundation",
      description: "Experience the daily operations and love at our shelter",
      duration: "5:20",
      category: "Daily Life",
      date: "2024-05-08",
    },
    {
      id: 3,
      thumbnail:
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop",
      title: "Medical Miracles: Healing Stories",
      description: "Incredible recovery stories of dogs we've helped heal",
      duration: "4:15",
      category: "Medical",
      date: "2024-05-05",
      views: "12.3k",
    },
    {
      id: 4,
      thumbnail:
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop",
      title: "Happy Endings: Adoption Success Stories",
      description:
        "Heartwarming stories of dogs finding their forever families",
      duration: "6:30",
      category: "Adoptions",
      date: "2024-05-01",
    },
  ],
};

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
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [photoFilter, setPhotoFilter] = useState("All");
  const [videoFilter, setVideoFilter] = useState("All");

  const filteredPhotos =
    photoFilter === "All"
      ? galleryData.photos
      : galleryData.photos.filter((photo) => photo.category === photoFilter);

  const filteredVideos =
    videoFilter === "All"
      ? galleryData.videos
      : galleryData.videos.filter((video) => video.category === videoFilter);

  const openPhotoModal = (photo: any) => {
    setSelectedPhoto(photo);
  };

  const closePhotoModal = () => {
    setSelectedPhoto(null);
  };

  const navigatePhoto = (direction: "next" | "prev") => {
    if (!selectedPhoto) return;

    const currentIndex = filteredPhotos.findIndex(
      (photo) => photo.id === selectedPhoto.id
    );
    let newIndex;

    if (direction === "next") {
      newIndex = (currentIndex + 1) % filteredPhotos.length;
    } else {
      newIndex =
        currentIndex === 0 ? filteredPhotos.length - 1 : currentIndex - 1;
    }

    setSelectedPhoto(filteredPhotos[newIndex]);
  };

  const PhotoCard = ({ photo }: { photo: any }) => (
    <div
      className='group relative overflow-hidden rounded-lg cursor-pointer transition-transform hover:scale-105'
      onClick={() => openPhotoModal(photo)}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        className='w-full h-64 object-cover transition-transform group-hover:scale-110'
      />
      <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center'>
        <div className='opacity-0 group-hover:opacity-100 transition-opacity text-white text-center p-4'>
          <h3 className='font-semibold text-lg mb-2'>{photo.title}</h3>
          <p className='text-sm'>{photo.description}</p>
        </div>
      </div>
      <div className='absolute top-2 right-2'>
        <Badge className='bg-orange-500 text-white'>{photo.category}</Badge>
      </div>
    </div>
  );

  const VideoCard = ({ video }: { video: any }) => (
    <div className='group relative overflow-hidden rounded-lg cursor-pointer'>
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
          <Badge className='bg-orange-500 text-white'>{video.category}</Badge>
        </div>
      </div>
      <div className='p-4 bg-white'>
        <h3 className='font-semibold text-lg mb-2 line-clamp-1'>
          {video.title}
        </h3>
        <p className='text-gray-600 text-sm line-clamp-2 mb-2'>
          {video.description}
        </p>
        <div className='flex items-center justify-between text-xs text-gray-500'>
          <div className='flex items-center gap-2'>
            <Calendar className='h-3 w-3' />
            {new Date(video.date).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );

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
                <Video className='h-4 w-4' />
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
                  <PhotoCard key={photo.id} photo={photo} />
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
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Photo Modal */}
          {selectedPhoto && (
            <div className='fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4'>
              <div className='relative max-w-4xl max-h-full'>
                {/* Close button */}
                <Button
                  variant='ghost'
                  size='icon'
                  className='absolute top-4 right-4 z-10 text-white hover:bg-white hover:bg-opacity-20'
                  onClick={closePhotoModal}
                >
                  <X className='h-6 w-6' />
                </Button>

                {/* Navigation buttons */}
                <Button
                  variant='ghost'
                  size='icon'
                  className='absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white hover:bg-opacity-20'
                  onClick={() => navigatePhoto("prev")}
                >
                  <ChevronLeft className='h-8 w-8' />
                </Button>

                <Button
                  variant='ghost'
                  size='icon'
                  className='absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white hover:bg-opacity-20'
                  onClick={() => navigatePhoto("next")}
                >
                  <ChevronRight className='h-8 w-8' />
                </Button>

                {/* Image */}
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt}
                  className='max-w-full max-h-[80vh] object-contain mx-auto'
                />

                {/* Photo details */}
                <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 text-white'>
                  <div className='max-w-2xl'>
                    <div className='flex items-center gap-2 mb-2'>
                      <Badge className='bg-orange-500'>
                        {selectedPhoto.category}
                      </Badge>
                    </div>
                    <h3 className='text-2xl font-bold mb-2'>
                      {selectedPhoto.title}
                    </h3>
                    <p className='text-gray-300 mb-4'>
                      {selectedPhoto.description}
                    </p>
                    <div className='flex items-center gap-4 text-sm text-gray-400'>
                      <div className='flex items-center gap-1'>
                        <Calendar className='h-4 w-4' />
                        {new Date(selectedPhoto.date).toLocaleDateString()}
                      </div>
                      <div className='flex items-center gap-1'>
                        <MapPin className='h-4 w-4' />
                        {selectedPhoto.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default GalleryPage;
