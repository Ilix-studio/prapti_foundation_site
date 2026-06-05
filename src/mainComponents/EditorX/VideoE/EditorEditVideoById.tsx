import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Save,
  Video,
  Image,
  Loader2,
  Calendar,
  Clock,
  AlertCircle,
  X,
  Check,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  selectAuth,
  selectIsAdmin,
  selectIsEditor,
} from "@/redux-store/slices/authSlice";
import {
  useGetVideoQuery,
  useUpdateVideoMutation,
} from "@/redux-store/services/videoApi";
import {
  useGetCategoriesByTypeQuery,
  useCreateCategoryMutation,
} from "@/redux-store/services/categoryApi";
import { VideoUpdateData, getVideoCategoryId } from "@/types/video.types";
import TopBar from "../TopBar";

const VIDEOS_ROUTE = "/editor/videos";

interface FormState {
  title: string;
  description: string;
  category: string;
  date: string;
  duration: string;
  isActive: boolean;
}

const EditorEditVideoById: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);
  const isEditor = useSelector(selectIsEditor);

  const videoFileRef = useRef<HTMLInputElement>(null);
  const thumbnailFileRef = useRef<HTMLInputElement>(null);

  const { data: categories = [], isLoading: categoriesLoading } =
    useGetCategoriesByTypeQuery("video");
  const [createCategory, { isLoading: creatingCategory }] =
    useCreateCategoryMutation();
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const {
    data: videoData,
    isLoading: loadingVideo,
    error: videoError,
    refetch,
  } = useGetVideoQuery(id!, { skip: !id });
  const [updateVideo, { isLoading: updating }] = useUpdateVideoMutation();

  const [formData, setFormData] = useState<FormState>({
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
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(""); // existing or blob
  const [savingFile, setSavingFile] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Hydrate when the video loads.
  useEffect(() => {
    const video = videoData?.data?.video;
    if (!video) return;
    setFormData({
      title: video.title ?? "",
      description: video.description ?? "",
      category: getVideoCategoryId(video.category),
      date: video.date ? new Date(video.date).toISOString().split("T")[0] : "",
      duration: video.duration ?? "",
      isActive: video.isActive ?? true,
    });
    setThumbnailPreview(video.thumbnail ?? "");
  }, [videoData]);

  // Revoke object URLs on unmount.
  useEffect(() => {
    return () => {
      if (videoPreview.startsWith("blob:")) URL.revokeObjectURL(videoPreview);
      if (thumbnailPreview.startsWith("blob:"))
        URL.revokeObjectURL(thumbnailPreview);
    };
  }, [videoPreview, thumbnailPreview]);

  if (!isAuthenticated || (!isEditor && !isAdmin)) {
    return <Navigate to='/editor/login' />;
  }
  if (!id) {
    return <Navigate to={VIDEOS_ROUTE} />;
  }

  const isLoading = updating || savingFile;

  const handleInputChange = (field: keyof FormState, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    try {
      const result = await createCategory({
        name: newCategoryName.trim(),
        type: "video",
      }).unwrap();
      toast.success("Category created successfully");
      setNewCategoryName("");
      setShowAddCategory(false);
      handleInputChange("category", result._id);
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Failed to create category",
      );
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (videoPreview.startsWith("blob:")) URL.revokeObjectURL(videoPreview);
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleThumbnailFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (thumbnailPreview.startsWith("blob:"))
      URL.revokeObjectURL(thumbnailPreview);
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.duration.trim()) newErrors.duration = "Duration is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const hasFiles = !!videoFile || !!thumbnailFile;

    try {
      if (hasFiles) {
        // The updateVideo RTK mutation sends JSON; a replaced video/thumbnail
        // file must go through a multipart PUT. credentials:"include" carries
        // the auth cookie used by the API.
        const fd = new FormData();
        fd.append("title", formData.title.trim());
        fd.append("description", formData.description.trim());
        fd.append("category", formData.category);
        fd.append("date", formData.date);
        fd.append("duration", formData.duration.trim());
        fd.append("isActive", String(formData.isActive));
        if (videoFile) fd.append("video", videoFile);
        if (thumbnailFile) fd.append("thumbnail", thumbnailFile);

        setSavingFile(true);
        const res = await fetch(`/api/videos/${id}`, {
          method: "PUT",
          body: fd,
          credentials: "include",
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || "Failed to update video");
        }
      } else {
        const data: VideoUpdateData = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          date: formData.date,
          duration: formData.duration.trim(),
          isActive: formData.isActive,
        };
        await updateVideo({ id, data }).unwrap();
      }

      await refetch();
      toast.success("Video updated successfully!");
      navigate(VIDEOS_ROUTE);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Update failed");
      setErrors({
        submit: error?.data?.message || error?.message || "Update failed",
      });
    } finally {
      setSavingFile(false);
    }
  };

  if (loadingVideo) {
    return (
      <div className='min-h-screen bg-linear-to-br from-slate-50 to-white'>
        <TopBar />
        <div className='container py-6 px-4 sm:px-6 max-w-5xl mx-auto'>
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

  if (videoError || !videoData?.data?.video) {
    return (
      <div className='min-h-screen bg-linear-to-br from-slate-50 to-white'>
        <TopBar />
        <div className='container py-6 px-4 sm:px-6 max-w-5xl mx-auto'>
          <div className='flex flex-col items-center justify-center gap-3 py-16'>
            <AlertCircle className='w-8 h-8 text-red-500' />
            <p className='text-muted-foreground'>
              Video not found or failed to load.
            </p>
            <div className='flex gap-2'>
              <Button onClick={() => navigate(VIDEOS_ROUTE)} variant='outline'>
                Back to Videos
              </Button>
              <Button onClick={refetch}>Try Again</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <TopBar />
      <div className='min-h-screen bg-linear-to-br from-slate-50 to-white'>
        <div className='container py-6 px-4 sm:px-6 max-w-5xl mx-auto'>
          <motion.div
            className='mb-6'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className='text-3xl font-bold text-slate-900'>Edit Video</h1>
            <p className='text-slate-600 mt-1'>
              Update video details. Pick a new file only to replace media.
            </p>
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
                        <div className='flex gap-2'>
                          <select
                            id='category'
                            value={formData.category}
                            onChange={(e) =>
                              handleInputChange("category", e.target.value)
                            }
                            disabled={categoriesLoading || isLoading}
                            className={`flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                              errors.category ? "border-red-500" : ""
                            }`}
                          >
                            <option value='' disabled>
                              Select category
                            </option>
                            {categories.map((category) => (
                              <option key={category._id} value={category._id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                          <Button
                            type='button'
                            onClick={() => setShowAddCategory(!showAddCategory)}
                            className='px-3 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-1'
                            title='Add new category'
                            disabled={isLoading}
                          >
                            <Plus className='w-4 h-4' />
                          </Button>
                        </div>

                        {showAddCategory && (
                          <div className='mt-2 p-3 bg-gray-50 rounded-lg border'>
                            <div className='flex gap-2'>
                              <Input
                                type='text'
                                value={newCategoryName}
                                onChange={(e) =>
                                  setNewCategoryName(e.target.value)
                                }
                                placeholder='Enter category name'
                                className='flex-1'
                                onKeyDown={(e) =>
                                  e.key === "Enter" &&
                                  (e.preventDefault(), handleCreateCategory())
                                }
                                disabled={isLoading}
                              />
                              <Button
                                type='button'
                                onClick={handleCreateCategory}
                                disabled={creatingCategory || isLoading}
                                className='px-3 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-1'
                              >
                                {creatingCategory ? (
                                  <Loader2 className='w-4 h-4 animate-spin' />
                                ) : (
                                  <Check className='w-4 h-4' />
                                )}
                              </Button>
                              <Button
                                type='button'
                                onClick={() => {
                                  setShowAddCategory(false);
                                  setNewCategoryName("");
                                }}
                                className='px-3 py-2 bg-gray-500 text-white hover:bg-gray-600 transition-colors'
                                disabled={isLoading}
                              >
                                <X className='w-4 h-4' />
                              </Button>
                            </div>
                          </div>
                        )}

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
                          placeholder='e.g. 3:45'
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

                    {/* Active toggle */}
                    <div className='flex items-center gap-2'>
                      <input
                        id='isActive'
                        type='checkbox'
                        className='h-4 w-4'
                        checked={formData.isActive}
                        onChange={(e) =>
                          handleInputChange("isActive", e.target.checked)
                        }
                      />
                      <Label htmlFor='isActive' className='cursor-pointer'>
                        Active (visible on the public site)
                      </Label>
                    </div>

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

              {/* File Replacement Sidebar */}
              <motion.div
                className='space-y-6'
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {/* Video */}
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Video className='w-5 h-5' />
                      Replace Video (optional)
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
                      {videoPreview ? (
                        <div className='space-y-2'>
                          <video
                            src={videoPreview}
                            controls
                            className='w-full rounded-lg'
                            style={{ maxHeight: "200px" }}
                          />
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              if (videoPreview.startsWith("blob:"))
                                URL.revokeObjectURL(videoPreview);
                              setVideoFile(null);
                              setVideoPreview("");
                              if (videoFileRef.current)
                                videoFileRef.current.value = "";
                            }}
                          >
                            <X className='w-4 h-4 mr-1' />
                            Clear
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() => videoFileRef.current?.click()}
                          className='w-full h-24 border-dashed'
                        >
                          <div className='text-center'>
                            <Video className='w-8 h-8 mx-auto mb-2 text-slate-400' />
                            <p className='text-sm'>Click to replace video</p>
                          </div>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Thumbnail */}
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
                      {thumbnailPreview ? (
                        <div className='space-y-2'>
                          <img
                            src={thumbnailPreview}
                            alt='Thumbnail'
                            className='w-full rounded-lg'
                          />
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => thumbnailFileRef.current?.click()}
                          >
                            <Image className='w-4 h-4 mr-1' />
                            Change Thumbnail
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() => thumbnailFileRef.current?.click()}
                          className='w-full h-24 border-dashed'
                        >
                          <div className='text-center'>
                            <Image className='w-8 h-8 mx-auto mb-2 text-slate-400' />
                            <p className='text-sm'>Click to upload thumbnail</p>
                          </div>
                        </Button>
                      )}
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
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                            {savingFile ? "Uploading..." : "Saving..."}
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
                        onClick={() => navigate(VIDEOS_ROUTE)}
                        disabled={isLoading}
                        className='w-full'
                      >
                        Cancel
                      </Button>
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

export default EditorEditVideoById;
