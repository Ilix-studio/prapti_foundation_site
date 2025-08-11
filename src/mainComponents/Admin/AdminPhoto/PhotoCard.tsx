// src/components/PhotoCard.tsx
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar, MapPin, Loader2 } from "lucide-react";
import { useDeletePhotoMutation } from "@/redux-store/services/photoApi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Updated Photo interface to match API response
export interface Photo {
  _id: string;
  title: string;
  description?: string;
  src: string;
  alt: string;
  date: string;
  location?: string;
  category: {
    _id: string;
    name: string;
    type: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface PhotoCardProps {
  photo: Photo;
  viewMode: "grid" | "list";
  onView: (photo: Photo) => void;
  onEdit?: (photo: Photo) => void;
  showEditButton?: boolean;
}

const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  viewMode,
  onView,
  onEdit,
  showEditButton = false,
}) => {
  // Use the delete mutation hook
  const [deletePhoto, { isLoading: isDeleting }] = useDeletePhotoMutation();
  const navigate = useNavigate();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this photo?")) {
      return;
    }

    try {
      await deletePhoto(photo._id).unwrap();
      toast.success("Photo deleted successfully");
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast.error("Failed to delete photo");
    }
  };

  const handleEdit = () => {
    navigate(`/admin/edit/${photo._id}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -4 }}
      className='group'
    >
      <Card className='overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300'>
        {viewMode === "grid" ? (
          <>
            {/* Image Section */}
            <div className='relative aspect-[4/3] overflow-hidden'>
              <img
                src={photo.src}
                alt={photo.alt}
                className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                loading='lazy'
              />

              {/* Gradient Overlay */}
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
            </div>

            {/* Content Section */}
            <CardContent className='p-5 space-y-3'>
              <div className='space-y-2'>
                <h3 className='font-bold text-lg text-gray-900 line-clamp-1'>
                  {photo.title}
                </h3>

                {/* Category Badge */}
                <Badge variant='outline' className='text-xs'>
                  {photo.category.name.toUpperCase()}
                </Badge>
              </div>

              {photo.description && (
                <p className='text-sm text-gray-600 line-clamp-2 leading-relaxed'>
                  {photo.description}
                </p>
              )}

              <div className='flex items-center justify-between text-xs text-gray-500'>
                <div className='flex items-center gap-1'>
                  <Calendar className='w-3 h-3' />
                  <span>{formatDate(photo.date)}</span>
                </div>
                {photo.location && (
                  <div className='flex items-center gap-1'>
                    <MapPin className='w-3 h-3' />
                    <span className='truncate max-w-20'>{photo.location}</span>
                  </div>
                )}
              </div>

              <div className='flex gap-3'>
                <Button
                  size='sm'
                  variant='secondary'
                  className='bg-white/90 hover:bg-white backdrop-blur-sm border-0 shadow-lg'
                  onClick={() => onView(photo)}
                >
                  <span className='text-sm'>View Photo</span>
                </Button>

                {showEditButton && onEdit && (
                  <Button
                    size='sm'
                    variant='outline'
                    className='bg-white/90 hover:bg-white backdrop-blur-sm border-0 shadow-lg'
                    onClick={handleEdit}
                  >
                    <Edit className='w-4 h-4' />
                  </Button>
                )}

                {showEditButton && (
                  <Button
                    size='sm'
                    variant='destructive'
                    className='bg-red-500/90 hover:bg-red-500 backdrop-blur-sm border-0 shadow-lg'
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className='w-4 h-4 animate-spin' />
                    ) : (
                      <Trash2 className='w-4 h-4' />
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </>
        ) : (
          // List View
          <div className='flex p-5 gap-4'>
            <div className='relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden'>
              <img
                src={photo.src}
                alt={photo.alt}
                className='w-full h-full object-cover'
                loading='lazy'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent' />
            </div>

            <div className='flex-1 min-w-0 space-y-2'>
              <div className='flex items-start justify-between'>
                <div className='space-y-1'>
                  <h3 className='font-bold text-lg text-gray-900 truncate'>
                    {photo.title}
                  </h3>
                  <Badge variant='outline' className='text-xs'>
                    {photo.category.name.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {photo.description && (
                <p className='text-sm text-gray-600 line-clamp-2'>
                  {photo.description}
                </p>
              )}

              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4 text-xs text-gray-500'>
                  <div className='flex items-center gap-1'>
                    <Calendar className='w-3 h-3' />
                    <span>{formatDate(photo.date)}</span>
                  </div>
                  {photo.location && (
                    <div className='flex items-center gap-1'>
                      <MapPin className='w-3 h-3' />
                      <span>{photo.location}</span>
                    </div>
                  )}
                </div>

                <div className='flex gap-2'>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => onView(photo)}
                  >
                    <span className='text-sm'>View Photo</span>
                  </Button>

                  {showEditButton && onEdit && (
                    <Button size='sm' variant='outline' onClick={handleEdit}>
                      <Edit className='w-4 h-4' />
                    </Button>
                  )}

                  {showEditButton && (
                    <Button
                      size='sm'
                      variant='destructive'
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className='w-4 h-4 animate-spin' />
                      ) : (
                        <Trash2 className='w-4 h-4' />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default PhotoCard;
