import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  AlertCircle,
  Grid3X3,
  List,
  Plus,
  RefreshCw,
  Video as VideoIcon,
} from "lucide-react";
import {
  useGetVideosQuery,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
} from "@/redux-store/services/videoApi";
import { useGetCategoriesByTypeQuery } from "@/redux-store/services/categoryApi";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "@/redux-store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import VideoCard from "./VideoCard";
import { BackNavigation } from "@/config/navigation/BackNavigation";
import { toast } from "react-hot-toast";

import {
  Video,
  VideoQueryParams,
  VideoUpdateData,
  VIDEO_SORT_OPTIONS,
} from "@/types/video.types";

// Skeleton Components
const VideoCardSkeleton: React.FC<{ viewMode: "grid" | "list" }> = ({
  viewMode,
}) => {
  if (viewMode === "grid") {
    return (
      <Card className='overflow-hidden'>
        <Skeleton className='aspect-video w-full' />
        <CardContent className='p-4 space-y-2'>
          <Skeleton className='h-5 w-3/4' />
          <Skeleton className='h-4 w-1/2' />
          <Skeleton className='h-3 w-1/3' />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <div className='flex p-4 gap-4'>
        <Skeleton className='w-32 h-20 rounded flex-shrink-0' />
        <div className='flex-1 space-y-2'>
          <Skeleton className='h-5 w-3/4' />
          <Skeleton className='h-4 w-1/2' />
          <Skeleton className='h-4 w-full' />
          <div className='flex gap-2 mt-2'>
            <Skeleton className='h-6 w-16' />
            <Skeleton className='h-6 w-20' />
          </div>
        </div>
        <div className='flex gap-2'>
          <Skeleton className='h-8 w-8' />
          <Skeleton className='h-8 w-8' />
          <Skeleton className='h-8 w-8' />
          <Skeleton className='h-8 w-8' />
        </div>
      </div>
    </Card>
  );
};

const VideoGridSkeleton: React.FC<{ viewMode: "grid" | "list" }> = ({
  viewMode,
}) => {
  return (
    <div
      className={`grid gap-6 ${
        viewMode === "grid"
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1"
      }`}
    >
      {Array.from({ length: 12 }, (_, i) => (
        <VideoCardSkeleton key={i} viewMode={viewMode} />
      ))}
    </div>
  );
};

const VideoDash: React.FC = () => {
  const navigate = useNavigate();
  const isAdmin = useSelector(selectIsAdmin);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);

  // Query parameters - Fixed to match PhotoDash pattern
  const [queryParams, setQueryParams] = useState<VideoQueryParams>({
    page: "1",
    limit: "12",
    category: "",
    search: "",
    sortBy: "date",
    sortOrder: "desc",
  });

  // Build clean query params that only include non-empty values - Following PhotoDash pattern
  const cleanQueryParams = React.useMemo(() => {
    const params: VideoQueryParams = {
      page: queryParams.page,
      limit: queryParams.limit,
      sortBy: queryParams.sortBy,
      sortOrder: queryParams.sortOrder,
    };

    // Only include category if it's not empty and not "all"
    if (
      queryParams.category &&
      queryParams.category !== "all" &&
      queryParams.category.trim() !== ""
    ) {
      params.category = queryParams.category;
    }

    // Only include search if it's not empty
    if (queryParams.search && queryParams.search.trim() !== "") {
      params.search = queryParams.search;
    }

    return params;
  }, [queryParams]);

  // API hooks
  const {
    data: videosData,
    isLoading: isLoadingVideos,
    error: videosError,
    refetch: refetchVideos,
  } = useGetVideosQuery(cleanQueryParams);

  const { data: categories = [], isLoading: isLoadingCategories } =
    useGetCategoriesByTypeQuery("video");

  const [updateVideo, { isLoading: isUpdating }] = useUpdateVideoMutation();
  const [deleteVideo] = useDeleteVideoMutation();

  if (!isAdmin) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <BackNavigation />
        <Alert className='max-w-md mx-auto mt-8'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>Admin access required.</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Handle error state
  if (videosError) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <BackNavigation />
        <Alert className='max-w-md mx-auto mt-8' variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            Failed to load videos. Please try again.
          </AlertDescription>
        </Alert>
        <div className='flex justify-center mt-4'>
          <Button onClick={() => refetchVideos()} variant='outline'>
            <RefreshCw className='w-4 h-4 mr-2' />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const handleSearch = (search: string) => {
    setQueryParams((prev) => ({
      ...prev,
      search: search.trim(),
      page: "1",
    }));
  };

  // Fixed category filter handler - Following PhotoDash pattern
  const handleCategoryFilter = (category: string) => {
    setQueryParams((prev) => ({
      ...prev,
      category: category === "all" ? "" : category,
      page: "1",
    }));
  };

  const handleSortChange = (sortValue: string) => {
    const sortOption = VIDEO_SORT_OPTIONS.find(
      (opt) => opt.value === sortValue
    );
    if (sortOption) {
      setQueryParams((prev) => ({
        ...prev,
        sortBy: sortOption.field,
        sortOrder: sortOption.order,
        page: "1",
      }));
    }
  };

  const handlePageChange = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page: page.toString() }));
  };

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video);
  };

  const handleUpdateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;

    try {
      const updateData: VideoUpdateData = {
        title: editingVideo.title,
        description: editingVideo.description,
        category:
          typeof editingVideo.category === "string"
            ? editingVideo.category
            : editingVideo.category._id,
        date: editingVideo.date.toString(),
        duration: editingVideo.duration,
      };

      await updateVideo({
        id: editingVideo._id,
        data: updateData,
      }).unwrap();

      toast.success("Video updated successfully!");
      setEditingVideo(null);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to update video");
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      setDeletingVideoId(videoId);
      await deleteVideo(videoId).unwrap();
      toast.success("Video deleted successfully!");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to delete video");
    } finally {
      setDeletingVideoId(null);
    }
  };

  const handleViewVideo = (video: Video) => {
    navigate(`/admin/play/${video._id}`);
  };

  const videos = videosData?.data.videos || [];
  const pagination = videosData?.data.pagination;

  return (
    <>
      <BackNavigation />
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white'>
        <div className='container py-3 px-4 sm:px-6 max-w-7xl mx-auto'>
          {/* Header */}
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3'>
            <div>
              <h1 className='text-2xl font-bold text-slate-900 flex items-center gap-2'>
                <VideoIcon className='w-8 h-8 text-blue-600' />
                Video Dashboard
              </h1>
              <p className='text-slate-600 mt-1'>Manage your video content</p>
            </div>
          </div>

          {/* Stats Card */}
          <Card>
            <CardContent className='pt-1'>
              <div className='grid grid-cols-3 md:grid-cols-3 gap-3 text-center'>
                <div>
                  <h3 className='text-2xl font-bold text-blue-600'>
                    {pagination?.totalVideos || 0}
                  </h3>
                  <p className='text-sm text-gray-600'>Total Videos</p>
                </div>
                <div>
                  <h3 className='text-2xl font-bold text-green-600'>
                    {categories.length}
                  </h3>
                  <p className='text-sm text-gray-600'>Categories</p>
                </div>
                <div>
                  <h3 className='text-2xl font-bold text-purple-600'>
                    {pagination?.totalPages || 0}
                  </h3>
                  <p className='text-sm text-gray-600'>Pages</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters and Controls - Improved layout following PhotoDash */}
          <Card>
            <CardContent className='pt-1'>
              <div className='flex flex-col sm:flex-row gap-4'>
                <div className='flex-1'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4' />
                    <Input
                      placeholder='Search videos...'
                      value={queryParams.search || ""}
                      onChange={(e) => handleSearch(e.target.value)}
                      className='pl-10'
                      disabled={isLoadingVideos}
                    />
                  </div>
                </div>

                {/* Category Filter - Using native select like PhotoDash */}
                <select
                  className='w-48 px-3 py-2 border rounded-md text-sm'
                  value={queryParams.category || "all"}
                  onChange={(e) => handleCategoryFilter(e.target.value)}
                  disabled={isLoadingVideos || isLoadingCategories}
                >
                  <option value='all'>All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {/* Sort - Keep the Select component for this */}
                <Select
                  value={`${queryParams.sortBy}-${queryParams.sortOrder}`}
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger className='w-48'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VIDEO_SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* View Mode Toggle */}
          <div className='flex justify-between items-center mb-6'>
            <div className='text-sm text-slate-600'>
              {pagination && (
                <>
                  Showing {videos.length} of {pagination.totalVideos} videos
                  {queryParams.category && categories.length > 0 && (
                    <span className='ml-2'>
                      in{" "}
                      {
                        categories.find((c) => c._id === queryParams.category)
                          ?.name
                      }
                    </span>
                  )}
                </>
              )}
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size='sm'
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className='w-4 h-4' />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size='sm'
                onClick={() => setViewMode("list")}
              >
                <List className='w-4 h-4' />
              </Button>
            </div>
          </div>

          {/* Content */}
          {isLoadingVideos ? (
            <VideoGridSkeleton viewMode={viewMode} />
          ) : videos.length === 0 ? (
            <Card className='p-12 text-center'>
              <VideoIcon className='w-12 h-12 text-slate-400 mx-auto mb-4' />
              <h3 className='text-lg font-semibold text-slate-900 mb-2'>
                No videos found
              </h3>
              <p className='text-slate-600 mb-4'>
                {queryParams.search || queryParams.category
                  ? "Try adjusting your filters or search terms."
                  : "Get started by uploading your first video."}
              </p>
              <Button
                onClick={() => navigate("/admin/addVideo")}
                className='bg-blue-600 hover:bg-blue-700'
              >
                <Plus className='w-4 h-4 mr-2' />
                Add Video
              </Button>
            </Card>
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {videos.map((video) => (
                <VideoCard
                  key={video._id}
                  video={video}
                  showActions={true}
                  viewMode={viewMode}
                  onEdit={handleEditVideo}
                  onDelete={handleDeleteVideo}
                  onView={handleViewVideo}
                  isDeleting={deletingVideoId === video._id}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className='flex justify-center mt-8'>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  Previous
                </Button>
                <span className='text-sm text-slate-600 px-4'>
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant='outline'
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Edit Dialog */}
          <Dialog
            open={editingVideo !== null}
            onOpenChange={() => setEditingVideo(null)}
          >
            <DialogContent className='max-w-2xl'>
              <DialogHeader>
                <DialogTitle>Edit Video</DialogTitle>
              </DialogHeader>
              {editingVideo && (
                <>
                  <form onSubmit={handleUpdateVideo} className='space-y-4'>
                    <div>
                      <label className='text-sm font-medium'>Title</label>
                      <Input
                        value={editingVideo.title}
                        onChange={(e) =>
                          setEditingVideo((prev) =>
                            prev ? { ...prev, title: e.target.value } : null
                          )
                        }
                      />
                    </div>

                    <div>
                      <label className='text-sm font-medium'>Description</label>
                      <textarea
                        className='w-full p-2 border rounded-md'
                        rows={3}
                        value={editingVideo.description}
                        onChange={(e) =>
                          setEditingVideo((prev) =>
                            prev
                              ? { ...prev, description: e.target.value }
                              : null
                          )
                        }
                      />
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <label className='text-sm font-medium'>Category</label>
                        <Select
                          value={
                            typeof editingVideo.category === "string"
                              ? editingVideo.category
                              : editingVideo.category._id
                          }
                          onValueChange={(value) =>
                            setEditingVideo((prev) =>
                              prev ? { ...prev, category: value } : null
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category._id}
                                value={category._id}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className='text-sm font-medium'>Duration</label>
                        <Input
                          value={editingVideo.duration}
                          onChange={(e) =>
                            setEditingVideo((prev) =>
                              prev
                                ? { ...prev, duration: e.target.value }
                                : null
                            )
                          }
                          placeholder='e.g., 5:30'
                        />
                      </div>
                    </div>

                    <div>
                      <label className='text-sm font-medium'>Date</label>
                      <Input
                        type='date'
                        value={
                          editingVideo.date instanceof Date
                            ? editingVideo.date.toISOString().split("T")[0]
                            : new Date(editingVideo.date)
                                .toISOString()
                                .split("T")[0]
                        }
                        onChange={(e) =>
                          setEditingVideo((prev) =>
                            prev
                              ? { ...prev, date: new Date(e.target.value) }
                              : null
                          )
                        }
                      />
                    </div>

                    <div className='flex gap-3'>
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => setEditingVideo(null)}
                        className='flex-1'
                      >
                        Cancel
                      </Button>
                      <Button
                        type='submit'
                        disabled={isUpdating}
                        className='flex-1'
                      >
                        {isUpdating ? "Updating..." : "Update Video"}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default VideoDash;
