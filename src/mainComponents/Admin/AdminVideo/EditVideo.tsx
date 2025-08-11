import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  Save,
  Video,
  Image,
  Loader2,
  Calendar,
  Clock,
  AlertCircle,
  Upload,
  Trash2,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectAuth, selectIsAdmin } from "@/redux-store/slices/authSlice";
import { Navigate } from "react-router-dom";
import {
  useGetVideoQuery,
  useUpdateVideoMutation,
} from "@/redux-store/services/videoApi";
import { useGetCategoriesByTypeQuery } from "@/redux-store/services/categoryApi";
import { VideoUpdateData } from "@/types/video.types";
import { BackNavigation } from "@/config/navigation/BackNavigation";

const EditVideo = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);

  const videoFileRef = useRef<HTMLInputElement>(null);
  const thumbnailFileRef = useRef<HTMLInputElement>(null);

  // Fetch video categories
  const { data: categories = [], isLoading: categoriesLoading } =
    useGetCategoriesByTypeQuery("video");

  // Form state
  const [formData, setFormData] = useState<VideoUpdateData>({
    title: "",
    description: "",
    category: "",
    date: "",
    duration: "",
    isActive: true,
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [videoRemoved, setVideoRemoved] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/admin/login' />;
  }

  // Redirect if no ID provided
  if (!id) {
    return <Navigate to='/admin/videoDashboard' />;
  }

  const {
    data: videoData,
    isLoading: loadingVideo,
    error: videoError,
    refetch,
  } = useGetVideoQuery(id);

  const [updateVideo, { isLoading: updating }] = useUpdateVideoMutation();

  const video = videoData?.data?.video;

  // Populate form when video data is loaded
  React.useEffect(() => {
    if (video) {
      const formattedDate = new Date(video.date).toISOString().split("T")[0];

      setFormData({
        title: video.title,
        description: video.description,
        category:
          typeof video.category === "string"
            ? video.category
            : video.category._id,
        date: formattedDate,
        duration: video.duration,
        isActive: video.isActive,
      });
      setThumbnailPreview(video.thumbnail);
      setVideoPreview(video.videoUrl);
    }
  }, [video]);

  const handleInputChange = (field: keyof VideoUpdateData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      setVideoRemoved(false);
      setHasChanges(true);

      // Auto-populate duration if possible
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        const duration = Math.floor(video.duration);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        handleInputChange(
          "duration",
          `${minutes}:${seconds.toString().padStart(2, "0")}`
        );
      };
      video.src = url;
    }
  };

  const handleThumbnailFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
      setHasChanges(true);
    }
  };

  const handleRemoveVideo = () => {
    if (
      confirm(
        "Are you sure you want to remove the current video? You'll need to upload a new one."
      )
    ) {
      setVideoRemoved(true);
      setVideoPreview("");
      setVideoFile(null);
      setHasChanges(true);
      if (videoFileRef.current) {
        videoFileRef.current.value = "";
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.duration?.trim()) {
      newErrors.duration = "Duration is required";
    }

    if (videoRemoved && !videoFile) {
      newErrors.videoFile = "Please upload a new video file";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Check if we need to upload files or just update text
      const hasFileUploads = videoFile || thumbnailFile;

      if (hasFileUploads) {
        // Handle file uploads with FormData
        const uploadFormData = new FormData();

        // Add text fields
        uploadFormData.append("title", formData.title || "");
        uploadFormData.append("description", formData.description || "");
        uploadFormData.append("category", formData.category || "");
        uploadFormData.append("date", formData.date || "");
        uploadFormData.append("duration", formData.duration || "");

        // Add files if present
        if (videoFile) {
          uploadFormData.append("video", videoFile);
        }
        if (thumbnailFile) {
          uploadFormData.append("thumbnail", thumbnailFile);
        }

        // Use fetch for file upload since RTK Query doesn't handle FormData well
        const response = await fetch(`/api/videos/${id}`, {
          method: "PUT",
          body: uploadFormData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to update video");
        }

        const result = await response.json();
        console.log("Video updated successfully:", result);
      } else {
        // Use RTK Query for text-only updates
        const updateData: VideoUpdateData = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          date: formData.date,
          duration: formData.duration,
          isActive: formData.isActive,
        };

        await updateVideo({
          id: id!,
          data: updateData,
        }).unwrap();
      }

      // Success - navigate back to dashboard
      navigate("/admin/videoDashboard");
    } catch (error: any) {
      console.error("Update failed:", error);
      setErrors({
        submit:
          error.message ||
          error.data?.message ||
          "Failed to update video. Please try again.",
      });
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmed) return;
    }

    // Clean up object URLs
    if (videoFile && videoPreview) URL.revokeObjectURL(videoPreview);
    if (thumbnailFile && thumbnailPreview)
      URL.revokeObjectURL(thumbnailPreview);

    navigate("/admin/videoDashboard");
  };

  // Loading state
  if (loadingVideo) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
        <BackNavigation />
        <div className='container py-6 px-4 sm:px-6 max-w-4xl mx-auto'>
          <Skeleton className='h-8 w-64 mb-6' />
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2'>
              <Card>
                <CardContent className='p-6 space-y-6'>
                  <Skeleton className='h-10 w-full' />
                  <Skeleton className='h-32 w-full' />
                  <div className='grid grid-cols-2 gap-4'>
                    <Skeleton className='h-10 w-full' />
                    <Skeleton className='h-10 w-full' />
                  </div>
                  <Skeleton className='h-10 w-full' />
                </CardContent>
              </Card>
            </div>
            <div className='space-y-6'>
              <Card>
                <CardContent className='p-6'>
                  <Skeleton className='aspect-video w-full' />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (videoError || !video) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
        <BackNavigation />
        <div className='container py-6 px-4 sm:px-6 max-w-4xl mx-auto'>
          <Alert variant='destructive' className='max-w-md mx-auto mt-8'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              Video not found or failed to load. Please try again.
            </AlertDescription>
          </Alert>
          <div className='flex justify-center mt-4 gap-2'>
            <Button
              onClick={() => navigate("/admin/videoDashboard")}
              variant='outline'
            >
              Back to Videos
            </Button>
            <Button onClick={refetch}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <BackNavigation />

      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
        <div className='container py-6 px-4 sm:px-6 max-w-4xl mx-auto'>
          {/* Header */}
          <motion.div
            className='mb-6'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className='text-3xl font-bold text-slate-900'>Edit Video</h1>
              <p className='text-slate-600 mt-1'>
                Update video details and settings
              </p>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* Main Form */}
              <motion.div
                className='lg:col-span-2'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Video className='w-5 h-5' />
                      Video Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    {/* Title */}
                    <div>
                      <Label htmlFor='title'>Title *</Label>
                      <Input
                        id='title'
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        placeholder='Enter video title'
                        className={errors.title ? "border-red-500" : ""}
                      />
                      {errors.title && (
                        <p className='text-sm text-red-600 mt-1'>
                          {errors.title}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <Label htmlFor='description'>Description *</Label>
                      <Textarea
                        id='description'
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        placeholder='Enter video description'
                        className={`min-h-[120px] ${
                          errors.description ? "border-red-500" : ""
                        }`}
                      />
                      {errors.description && (
                        <p className='text-sm text-red-600 mt-1'>
                          {errors.description}
                        </p>
                      )}
                    </div>

                    {/* Category and Date */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <Label htmlFor='category'>Category *</Label>
                        <select
                          id='category'
                          value={formData.category}
                          onChange={(e) =>
                            handleInputChange("category", e.target.value)
                          }
                          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                            errors.category ? "border-red-500" : ""
                          }`}
                        >
                          <option value='' disabled>
                            Select category
                          </option>
                          {categoriesLoading ? (
                            <option value='' disabled>
                              Loading categories...
                            </option>
                          ) : (
                            categories.map((category) => (
                              <option key={category._id} value={category._id}>
                                {category.name}
                              </option>
                            ))
                          )}
                        </select>
                        {errors.category && (
                          <p className='text-sm text-red-600 mt-1'>
                            {errors.category}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor='date'>Date *</Label>
                        <div className='relative'>
                          <Calendar className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4' />
                          <Input
                            id='date'
                            type='date'
                            value={formData.date}
                            onChange={(e) =>
                              handleInputChange("date", e.target.value)
                            }
                            className={`pl-10 ${
                              errors.date ? "border-red-500" : ""
                            }`}
                          />
                        </div>
                        {errors.date && (
                          <p className='text-sm text-red-600 mt-1'>
                            {errors.date}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Duration */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <Label htmlFor='duration'>Duration *</Label>
                        <div className='relative'>
                          <Clock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4' />
                          <Input
                            id='duration'
                            value={formData.duration}
                            onChange={(e) =>
                              handleInputChange("duration", e.target.value)
                            }
                            placeholder='e.g., 5:30 or 1:25:45'
                            className={`pl-10 ${
                              errors.duration ? "border-red-500" : ""
                            }`}
                          />
                        </div>
                        {errors.duration && (
                          <p className='text-sm text-red-600 mt-1'>
                            {errors.duration}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Error Messages */}
                    {errors.submit && (
                      <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                        <div className='flex items-center gap-2'>
                          <AlertCircle className='w-5 h-5 text-red-600' />
                          <p className='text-red-700'>{errors.submit}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Sidebar */}
              <motion.div
                className='space-y-6'
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {/* Video Preview/Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Video className='w-5 h-5' />
                      Video File
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <input
                        ref={videoFileRef}
                        type='file'
                        accept='video/*'
                        onChange={handleVideoFileChange}
                        className='hidden'
                      />

                      {!videoRemoved && videoPreview ? (
                        <div className='space-y-2'>
                          <video
                            controls
                            className='w-full rounded-lg'
                            poster={thumbnailPreview}
                          >
                            <source src={videoPreview} type='video/mp4' />
                            Your browser does not support the video tag.
                          </video>
                          <div className='flex gap-2'>
                            <Button
                              type='button'
                              variant='outline'
                              onClick={() => videoFileRef.current?.click()}
                              className='flex-1'
                            >
                              <Upload className='w-4 h-4 mr-2' />
                              Replace Video
                            </Button>
                            <Button
                              type='button'
                              variant='outline'
                              onClick={handleRemoveVideo}
                              className='text-red-600 hover:text-red-700'
                            >
                              <Trash2 className='w-4 h-4' />
                            </Button>
                          </div>
                          {videoFile && (
                            <p className='text-sm text-slate-600'>
                              New file: {videoFile.name}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className='space-y-2'>
                          <Button
                            type='button'
                            variant='outline'
                            onClick={() => videoFileRef.current?.click()}
                            className='w-full h-24 border-dashed'
                          >
                            <div className='text-center'>
                              <Video className='w-8 h-8 mx-auto mb-2 text-slate-400' />
                              <p className='text-sm'>
                                Click to upload new video
                              </p>
                            </div>
                          </Button>
                          {errors.videoFile && (
                            <p className='text-sm text-red-600'>
                              {errors.videoFile}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Thumbnail Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Image className='w-5 h-5' />
                      Thumbnail
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <input
                        ref={thumbnailFileRef}
                        type='file'
                        accept='image/*'
                        onChange={handleThumbnailFileChange}
                        className='hidden'
                      />

                      <div className='space-y-2'>
                        <img
                          src={thumbnailPreview}
                          alt='Thumbnail'
                          className='w-full rounded-lg'
                        />
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() => thumbnailFileRef.current?.click()}
                          className='w-full'
                        >
                          <Upload className='w-4 h-4 mr-2' />
                          {thumbnailFile
                            ? "Change Thumbnail"
                            : "Update Thumbnail"}
                        </Button>
                        {thumbnailFile && (
                          <p className='text-sm text-slate-600'>
                            New file: {thumbnailFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Save Actions */}
                <Card>
                  <CardContent className='p-4'>
                    <div className='space-y-3'>
                      <Button
                        type='submit'
                        className='w-full'
                        disabled={updating || !hasChanges}
                      >
                        {updating ? (
                          <>
                            <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className='w-4 h-4 mr-2' />
                            Save Changes
                          </>
                        )}
                      </Button>

                      <Button
                        type='button'
                        variant='outline'
                        onClick={handleCancel}
                        disabled={updating}
                        className='w-full'
                      >
                        Cancel
                      </Button>

                      {hasChanges && (
                        <p className='text-sm text-amber-600 text-center'>
                          You have unsaved changes
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditVideo;
