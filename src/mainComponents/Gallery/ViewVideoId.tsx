// src/components/ViewVideoId.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  Clock,
  ArrowLeft,
  AlertCircle,
  Share2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Eye,
  ExternalLink,
  Loader2,
} from "lucide-react";
import {
  useGetVideoQuery,
  useGetVideosQuery,
} from "@/redux-store/services/videoApi";
import { Video } from "@/types/video.types";

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

const ViewVideoId: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isBuffering, setIsBuffering] = useState(false);

  // UI state
  const [showControls, setShowControls] = useState(true);
  const [isSharing, setIsSharing] = useState(false);

  // Fetch video data
  const {
    data: videoData,
    isLoading,
    error,
    refetch,
  } = useGetVideoQuery(id!, {
    skip: !id,
  });

  // Extract video data safely
  const video = videoData?.success
    ? "video" in videoData.data
      ? videoData.data.video
      : videoData.data
    : null;

  // Helper function to get category information
  const getCategoryInfo = useCallback((category: Video["category"]) => {
    if (!category) return { name: "", id: "" };

    if (typeof category === "string") {
      return { name: category, id: category };
    }

    return {
      name: category.name || "",
      id: category._id || "",
    };
  }, []);

  const categoryInfo = video ? getCategoryInfo(video.category) : null;

  // Fetch related videos by category
  const { data: relatedVideosData, isLoading: isRelatedLoading } =
    useGetVideosQuery(
      {
        category: categoryInfo?.name || "",
        limit: "9",
        page: "1",
        sortBy: "date",
        sortOrder: "desc",
      },
      {
        skip: !video || !categoryInfo?.name,
        refetchOnMountOrArgChange: true,
      }
    );

  // Enhanced related videos filtering
  const relatedVideos = React.useMemo(() => {
    if (
      !relatedVideosData?.success ||
      !relatedVideosData.data?.videos ||
      !video
    ) {
      return [];
    }

    return relatedVideosData.data.videos
      .filter((relatedVideo) => relatedVideo._id !== video._id)
      .slice(0, 6);
  }, [relatedVideosData, video]);

  // Enhanced date formatting
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

  // Enhanced duration formatting
  const formatDuration = useCallback((seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Enhanced sharing functionality
  const handleShare = useCallback(async () => {
    if (!videoData?.success || !video) return;

    setIsSharing(true);

    try {
      if (navigator.share && navigator.canShare) {
        const shareData = {
          title: video.title,
          text: video.description || `Check out this video: ${video.title}`,
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
  }, [videoData, video]);

  const handleRelatedVideoClick = useCallback(
    (videoId: string) => {
      navigate(`/view/video/${videoId}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [navigate]
  );

  const handleBrowseCategory = useCallback(() => {
    if (video && categoryInfo?.name) {
      navigate(`/video-gallery?category=${categoryInfo.name.toLowerCase()}`);
    }
  }, [video, categoryInfo, navigate]);

  // Enhanced video player controls
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;

    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  }, [isMuted]);

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!videoRef.current) return;

      const newVolume = parseFloat(e.target.value);
      videoRef.current.volume = newVolume;
      setVolume(newVolume);

      if (newVolume > 0 && isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    },
    [isMuted]
  );

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setVolume(videoRef.current.volume);
  }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newTime = parseFloat(e.target.value);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!videoRef.current) return;

    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullscreen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!videoRef.current) return;

      switch (event.code) {
        case "Space":
          event.preventDefault();
          togglePlay();
          break;
        case "KeyM":
          event.preventDefault();
          toggleMute();
          break;
        case "KeyF":
          event.preventDefault();
          toggleFullscreen();
          break;
        case "ArrowLeft":
          event.preventDefault();
          videoRef.current.currentTime = Math.max(0, currentTime - 10);
          break;
        case "ArrowRight":
          event.preventDefault();
          videoRef.current.currentTime = Math.min(duration, currentTime + 10);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [togglePlay, toggleMute, toggleFullscreen, currentTime, duration]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Auto-hide controls
  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      return;
    }

    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isPlaying, showControls]);

  // Error states
  if (!id) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4'>
        <Alert variant='destructive' className='max-w-md'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>Video ID not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
        <div className='container mx-auto p-4 pt-8'>
          <Card className='max-w-4xl mx-auto'>
            <CardContent className='p-6 space-y-6'>
              <div className='flex items-center justify-between'>
                <Skeleton className='h-8 w-32' />
                <div className='flex gap-2'>
                  <Skeleton className='h-8 w-8' />
                  <Skeleton className='h-8 w-8' />
                </div>
              </div>
              <Skeleton className='aspect-video w-full rounded-lg' />
              <div className='space-y-2'>
                <Skeleton className='h-8 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
                <Skeleton className='h-20 w-full' />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !videoData?.success || !video) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4'>
        <Alert variant='destructive' className='max-w-md'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            Failed to load video. Please try again later.
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
              {/* Video Header */}
              <div className='p-6 pb-4'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='space-y-2 flex-1'>
                    <div className='flex items-center gap-3 flex-wrap'>
                      <h1 className='text-3xl font-bold text-gray-900 leading-tight'>
                        {video.title}
                      </h1>
                    </div>
                    <div className='flex items-center gap-4 flex-wrap'>
                      <Badge variant='outline' className='text-sm'>
                        {categoryInfo?.name.toUpperCase()}
                      </Badge>
                      <div className='flex items-center gap-1 text-sm text-gray-500'>
                        <Calendar className='w-4 h-4' />
                        {formatDate(video.date)}
                      </div>
                      <div className='flex items-center gap-1 text-sm text-gray-500'>
                        <Clock className='w-4 h-4' />
                        {video.duration}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Video Player */}
              <div
                className='relative bg-black group'
                onMouseEnter={() => setShowControls(true)}
                onMouseMove={() => setShowControls(true)}
                onMouseLeave={() => isPlaying && setShowControls(false)}
              >
                <video
                  ref={videoRef}
                  src={video.videoUrl}
                  poster={video.thumbnail}
                  className='w-full aspect-video cursor-pointer'
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  onWaiting={() => setIsBuffering(true)}
                  onCanPlay={() => setIsBuffering(false)}
                  onClick={togglePlay}
                />

                {/* Loading indicator */}
                {isBuffering && (
                  <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
                    <Loader2 className='w-8 h-8 text-white animate-spin' />
                  </div>
                )}

                {/* Video Controls Overlay */}
                <div
                  className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 transition-opacity duration-300 ${
                    showControls ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {/* Progress Bar */}
                  <div className='mb-3'>
                    <input
                      type='range'
                      min={0}
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className='w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer hover:h-3 transition-all'
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                          (currentTime / duration) * 100
                        }%, rgba(255,255,255,0.3) ${
                          (currentTime / duration) * 100
                        }%, rgba(255,255,255,0.3) 100%)`,
                      }}
                    />
                  </div>

                  {/* Control Buttons */}
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={togglePlay}
                        className='text-white hover:bg-white/20 hover:scale-110 transition-all'
                      >
                        {isPlaying ? (
                          <Pause className='w-5 h-5' />
                        ) : (
                          <Play className='w-5 h-5' />
                        )}
                      </Button>

                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={toggleMute}
                        className='text-white hover:bg-white/20 hover:scale-110 transition-all'
                      >
                        {isMuted ? (
                          <VolumeX className='w-5 h-5' />
                        ) : (
                          <Volume2 className='w-5 h-5' />
                        )}
                      </Button>

                      {/* Volume Slider */}
                      <input
                        type='range'
                        min={0}
                        max={1}
                        step={0.1}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className='w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer'
                      />

                      <span className='text-white text-sm font-medium'>
                        {formatDuration(currentTime)} /{" "}
                        {formatDuration(duration)}
                      </span>
                    </div>

                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={toggleFullscreen}
                      className='text-white hover:bg-white/20 hover:scale-110 transition-all'
                    >
                      <Maximize className='w-5 h-5' />
                    </Button>
                  </div>
                </div>

                {/* Keyboard shortcuts hint */}
                <div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <div className='bg-black/70 text-white px-3 py-1 rounded text-xs backdrop-blur-sm'>
                    Space: Play/Pause • M: Mute • F: Fullscreen
                  </div>
                </div>
              </div>

              {/* Video Information */}
              <div className='p-6'>
                <div className='space-y-6'>
                  <div>
                    <h2 className='text-lg font-semibold text-gray-900 mb-3'>
                      Description
                    </h2>
                    <p className='text-gray-700 leading-relaxed text-base'>
                      {video.description}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Videos Section */}
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
                      Related Videos
                    </h2>
                    <p className='text-gray-600 mt-1'>
                      More videos from the {categoryInfo?.name} category
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
                ) : relatedVideos.length > 0 ? (
                  <motion.div
                    variants={staggerVariants}
                    initial='hidden'
                    animate='visible'
                    className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  >
                    {relatedVideos.map((relatedVideo) => (
                      <motion.div
                        key={relatedVideo._id}
                        variants={childVariants}
                        whileHover={{ y: -4, scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className='group cursor-pointer'
                        onClick={() =>
                          handleRelatedVideoClick(relatedVideo._id)
                        }
                      >
                        <Card className='overflow-hidden border-0 shadow-md group-hover:shadow-xl transition-all duration-300'>
                          <div className='relative overflow-hidden'>
                            <img
                              src={relatedVideo.thumbnail}
                              alt={relatedVideo.title}
                              className='w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500'
                              loading='lazy'
                            />

                            {/* Play button overlay */}
                            <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300'>
                              <div className='w-16 h-16 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300'>
                                <Play
                                  className='w-8 h-8 text-blue-600 ml-1'
                                  fill='currentColor'
                                />
                              </div>
                            </div>

                            <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

                            {/* Video duration badge */}
                            {relatedVideo.duration && (
                              <div className='absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm'>
                                {relatedVideo.duration}
                              </div>
                            )}

                            {/* External link indicator */}
                            <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                              <div className='bg-white/90 backdrop-blur-sm rounded-full p-1'>
                                <ExternalLink className='w-3 h-3 text-gray-700' />
                              </div>
                            </div>
                          </div>

                          <CardContent className='p-4'>
                            <h3 className='font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-2'>
                              {relatedVideo.title}
                            </h3>

                            <div className='flex items-center justify-between mb-2 text-sm text-gray-600'>
                              <span className='flex items-center gap-1'>
                                <Calendar className='w-3 h-3' />
                                {formatDate(relatedVideo.date)}
                              </span>
                            </div>

                            {relatedVideo.description && (
                              <p className='text-xs text-gray-500 line-clamp-2 leading-relaxed'>
                                {relatedVideo.description}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className='text-center py-8'>
                    <div className='text-gray-500 mb-2'>
                      No related videos found in this category
                    </div>
                    <Button
                      variant='outline'
                      onClick={() => navigate("/video-gallery")}
                      size='sm'
                    >
                      Browse All Videos
                    </Button>
                  </div>
                )}

                {/* Show more videos button */}
                {relatedVideos.length >= 6 && (
                  <div className='text-center mt-6'>
                    <Button
                      variant='outline'
                      onClick={handleBrowseCategory}
                      size='lg'
                      className='hover:bg-blue-50 hover:border-blue-300'
                    >
                      View All {categoryInfo?.name} Videos
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ViewVideoId;
