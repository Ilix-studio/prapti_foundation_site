import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Edit2,
  Trash2,
  Play,
  Calendar,
  Clock,
  Loader2,
} from "lucide-react";
import { Video, getVideoCategoryName } from "@/types/video.types";
import { useNavigate } from "react-router-dom";

interface VideoCardProps {
  video: Video;
  onEdit?: (video: Video) => void;
  onDelete?: (videoId: string) => void;
  onView?: (video: Video) => void;

  showActions?: boolean;
  viewMode?: "grid" | "list";
  isDeleting?: boolean;
  isToggling?: boolean;
}

const VideoCard = ({
  video,
  onEdit,
  onDelete,
  onView,
  showActions = false,
  viewMode = "grid",
  isDeleting = false,
}: VideoCardProps) => {
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const navigate = useNavigate();

  const getCategoryColor = (categoryName: string) => {
    const lowerName = categoryName.toLowerCase();
    switch (lowerName) {
      case "speech":
        return "bg-blue-100 text-blue-800";
      case "event":
        return "bg-green-100 text-green-800";
      case "interview":
        return "bg-purple-100 text-purple-800";
      case "initiative":
        return "bg-orange-100 text-orange-800";
      case "campaign":
        return "bg-red-100 text-red-800";
      case "press conference":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const categoryName = getVideoCategoryName(video.category);

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.3 }}
      >
        <Card className='hover:shadow-lg transition-shadow'>
          <CardContent className='p-4'>
            <div className='flex items-center gap-4'>
              {/* Thumbnail */}
              <div className='relative w-32 h-20 flex-shrink-0'>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className='w-full h-full object-cover rounded-lg'
                />
                <div className='absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer'>
                  <Play className='w-6 h-6 text-white' />
                </div>
                <div className='absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded'>
                  {video.duration}
                </div>
              </div>

              {/* Content */}
              <div className='flex-1 min-w-0'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-semibold text-slate-900 truncate text-lg'>
                      {video.title}
                    </h3>
                    <p className='text-sm text-slate-600 mt-1 line-clamp-2'>
                      {video.description}
                    </p>
                  </div>

                  {showActions && (
                    <div className='flex items-center gap-2 ml-4'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => onView?.(video)}
                      >
                        <Eye className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => onEdit?.(video)}
                      >
                        <Edit2 className='w-4 h-4' />
                      </Button>

                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => onDelete?.(video._id)}
                        disabled={isDeleting}
                        className='text-red-600 hover:text-red-700 hover:bg-red-50'
                      >
                        {isDeleting ? (
                          <Loader2 className='w-4 h-4 animate-spin' />
                        ) : (
                          <Trash2 className='w-4 h-4' />
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Meta information */}
                <div className='flex items-center gap-4 mt-3'>
                  <Badge className={getCategoryColor(categoryName)}>
                    {categoryName}
                  </Badge>

                  <div className='flex items-center gap-1 text-sm text-slate-500'>
                    <Calendar className='w-4 h-4' />
                    {formatDate(video.date)}
                  </div>

                  <div className='flex items-center gap-1 text-sm text-slate-500'>
                    <Clock className='w-4 h-4' />
                    {video.duration}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className='hover:shadow-lg transition-shadow h-full flex flex-col'>
        {/* Thumbnail */}
        <div className='relative aspect-video'>
          <img
            src={video.thumbnail}
            alt={video.title}
            className='w-full h-full object-cover rounded-t-lg'
          />
          <div className='absolute inset-0 bg-black bg-opacity-20 rounded-t-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer'>
            <Play className='w-8 h-8 text-white' />
          </div>

          <div className='absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded'>
            {video.duration}
          </div>
        </div>

        <CardContent className='p-4 flex-1 flex flex-col'>
          {/* Category Badge */}
          <Badge className={`${getCategoryColor(categoryName)} w-fit mb-2`}>
            {categoryName}
          </Badge>

          {/* Title */}
          <h3 className='font-semibold text-slate-900 line-clamp-2 text-lg mb-2'>
            {video.title}
          </h3>

          {/* Description */}
          <p className='text-sm text-slate-600 line-clamp-3 mb-4 flex-1'>
            {video.description}
          </p>

          {/* Meta information */}
          <div className='space-y-2 mb-4'>
            <div className='flex items-center gap-1 text-sm text-slate-500'>
              <Calendar className='w-4 h-4' />
              {formatDate(video.date)}
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className='flex items-center gap-2 pt-2 border-t'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onView?.(video)}
                className='flex-1'
              >
                <Eye className='w-4 h-4 mr-1' />
                View
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => navigate(`/admin/editVideo/${video._id}`)}
              >
                <Edit2 className='w-4 h-4' />
              </Button>

              <Button
                variant='outline'
                size='sm'
                onClick={() => onDelete?.(video._id)}
                disabled={isDeleting}
                className='text-red-600 hover:text-red-700 hover:bg-red-50'
              >
                {isDeleting ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Trash2 className='w-4 h-4' />
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VideoCard;
