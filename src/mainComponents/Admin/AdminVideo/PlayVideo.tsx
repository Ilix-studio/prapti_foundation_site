import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Clock, ArrowLeft, AlertCircle, Share2 } from "lucide-react";
import { useGetVideoQuery } from "@/redux-store/services/videoApi";
import { getVideoCategoryName } from "@/types/video.types";

const PlayVideo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: videoData, isLoading, error } = useGetVideoQuery(id!);

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleShare = async () => {
    if (!videoData?.success) return;

    const video = videoData.data.video;

    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: video.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

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
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <div className='max-w-6xl mx-auto space-y-6'>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-10 w-20' />
            <div className='flex gap-2'>
              <Skeleton className='h-10 w-10' />
              <Skeleton className='h-10 w-10' />
            </div>
          </div>
          <Card>
            <CardContent className='p-0'>
              <Skeleton className='w-full aspect-video' />
              <div className='p-6 space-y-4'>
                <Skeleton className='h-8 w-3/4' />
                <div className='flex gap-2'>
                  <Skeleton className='h-6 w-20' />
                  <Skeleton className='h-6 w-16' />
                </div>
                <Skeleton className='h-20 w-full' />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !videoData?.success) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4'>
        <Alert variant='destructive' className='max-w-md'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            Failed to load video. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const video = videoData.data.video;
  const categoryName = getVideoCategoryName(video.category);

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
            <Button variant='outline' size='sm' onClick={handleShare}>
              <Share2 className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </div>

      <div className='container mx-auto p-4 pt-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='max-w-6xl mx-auto'
        >
          <Card className='overflow-hidden shadow-xl'>
            <CardContent className='p-0'>
              {/* Video Player */}
              <div className='relative aspect-video bg-black'>
                <video
                  className='w-full h-full'
                  controls
                  poster={video.thumbnail}
                  preload='metadata'
                >
                  <source src={video.videoUrl} type='video/mp4' />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Video Information */}
              <div className='p-6'>
                {/* Header */}
                <div className='flex items-start justify-between mb-4'>
                  <div className='space-y-2 flex-1'>
                    <div className='flex items-center gap-3'>
                      <h1 className='text-3xl font-bold text-gray-900'>
                        {video.title}
                      </h1>
                    </div>
                    <div className='flex items-center gap-4 text-sm text-gray-600'>
                      <Badge variant='outline' className='text-sm'>
                        {categoryName.toUpperCase()}
                      </Badge>
                      <div className='flex items-center gap-1'>
                        <Calendar className='w-4 h-4' />
                        {formatDate(video.date)}
                      </div>
                      <div className='flex items-center gap-1'>
                        <Clock className='w-4 h-4' />
                        {video.duration}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className='mb-6'>
                  <h3 className='text-lg font-semibold mb-2'>Description</h3>
                  <p className='text-gray-700 leading-relaxed whitespace-pre-wrap'>
                    {video.description}
                  </p>
                </div>

                {/* Video Details Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3'>
                  <Card className='bg-gray-50'>
                    <CardContent className='p-3'>
                      <div className='flex items-center gap-2 mb-2'>
                        <Calendar className='w-5 h-5 text-blue-600' />
                        <h4 className='font-medium'>Date</h4>
                      </div>
                      <p className='text-gray-700'>{formatDate(video.date)}</p>
                    </CardContent>
                  </Card>

                  <Card className='bg-gray-50'>
                    <CardContent className='p-4'>
                      <div className='flex items-center gap-2 mb-2'>
                        <Clock className='w-5 h-5 text-green-600' />
                        <h4 className='font-medium'>Duration</h4>
                      </div>
                      <p className='text-gray-700'>{video.duration}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Additional Information */}
                <div className='pt-4 border-t border-gray-200'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-500'>
                    <div>
                      <span className='font-medium'>Created:</span>{" "}
                      {formatDate(video.createdAt)}
                    </div>
                    <div>
                      <span className='font-medium'>Last Updated:</span>{" "}
                      {formatDate(video.updatedAt)}
                    </div>
                    <div>
                      <span className='font-medium'>Video ID:</span> {video._id}
                    </div>
                    <div>
                      <span className='font-medium'>Public ID:</span>{" "}
                      {video.publicId}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PlayVideo;
