import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useGetVideosQuery,
  useUploadVideoMutation,
  useDeleteVideoMutation,
} from "@/redux-store/services/videoApi";
import { useGetCategoriesByTypeQuery } from "@/redux-store/services/categoryApi";
import { useLogoutEditorMutation } from "@/redux-store/services/editorApi";
import { Video, getVideoCategoryName } from "@/types/video.types";
import {
  selectAuth,
  selectIsAdmin,
  selectIsEditor,
} from "@/redux-store/slices/authSlice";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Video as VideoIcon,
  ArrowLeft,
  LogOut,
  Upload,
  PlayCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

const TITLE_MAX = 160;
const MAX_VIDEO_BYTES = 200 * 1024 * 1024; // 200MB
const MAX_THUMB_BYTES = 5 * 1024 * 1024; // 5MB
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const THUMB_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface FormState {
  title: string;
  description: string;
  category: string; // category _id
  date: string; // yyyy-mm-dd
  duration: string; // e.g. "3:45"
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  category: "",
  date: "",
  duration: "",
};

const EditorVideoManager: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);
  const isEditor = useSelector(selectIsEditor);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState<Video | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string>("");

  const {
    data: videosResp,
    isLoading,
    error,
  } = useGetVideosQuery({
    page: "1",
    limit: "100",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const { data: categories = [] } = useGetCategoriesByTypeQuery("video");

  const [uploadVideo, { isLoading: isCreating }] = useUploadVideoMutation();
  const [deleteVideo, { isLoading: isDeleting }] = useDeleteVideoMutation();
  const [logoutEditor, { isLoading: isLoggingOut }] = useLogoutEditorMutation();

  const handleLogout = async () => {
    try {
      await logoutEditor().unwrap();
    } catch {
      // best-effort; auth cleared by slice regardless
    } finally {
      navigate("/editor/login", { replace: true });
    }
  };

  const TopBar = (
    <div className='sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm'>
      <div className='container mx-auto px-4 sm:px-6'>
        <div className='flex items-center justify-between h-16'>
          <Button
            variant='ghost'
            onClick={() => navigate(-1)}
            className='flex items-center gap-2 hover:bg-[#FF9933]/10'
          >
            <ArrowLeft className='w-5 h-5' />
            <span className='font-medium hidden sm:inline'>Back</span>
          </Button>
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            variant='ghost'
            size='sm'
            className='text-red-600 hover:text-red-700 hover:bg-red-50'
          >
            {isLoggingOut ? (
              <Loader2 className='w-4 h-4 mr-2 animate-spin' />
            ) : (
              <LogOut className='w-4 h-4 mr-2' />
            )}
            <span className='hidden sm:inline'>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );

  if (!isAuthenticated || (!isEditor && !isAdmin)) {
    return (
      <div className='container mx-auto p-6'>
        {TopBar}
        <Alert className='max-w-md mx-auto mt-8'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>Editor access required.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const videoList: Video[] = videosResp?.data?.videos ?? [];

  const clearThumbObjectUrl = () => {
    if (thumbPreview.startsWith("blob:")) URL.revokeObjectURL(thumbPreview);
  };

  const resetForm = () => {
    clearThumbObjectUrl();
    setForm(EMPTY_FORM);
    setVideoFile(null);
    setThumbFile(null);
    setThumbPreview("");
    if (videoInputRef.current) videoInputRef.current.value = "";
    if (thumbInputRef.current) thumbInputRef.current.value = "";
  };

  const openCreate = () => {
    resetForm();
    setSelected(null);
    setShowForm(true);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!VIDEO_TYPES.includes(f.type)) {
      toast.error("Only MP4, WebM, or MOV videos are allowed");
      e.target.value = "";
      return;
    }
    if (f.size > MAX_VIDEO_BYTES) {
      toast.error("Video must be 200MB or smaller");
      e.target.value = "";
      return;
    }
    setVideoFile(f);
  };

  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!THUMB_TYPES.includes(f.type)) {
      toast.error("Thumbnail must be JPEG, PNG, or WebP");
      e.target.value = "";
      return;
    }
    if (f.size > MAX_THUMB_BYTES) {
      toast.error("Thumbnail must be 5MB or smaller");
      e.target.value = "";
      return;
    }
    clearThumbObjectUrl();
    setThumbFile(f);
    setThumbPreview(URL.createObjectURL(f));
  };

  const validate = (): string | null => {
    if (!form.title.trim()) return "Title is required";
    if (form.title.trim().length > TITLE_MAX)
      return `Title cannot exceed ${TITLE_MAX} characters`;
    if (!form.category) return "Please select a category";
    if (!form.description.trim()) return "Description is required";
    if (!form.duration.trim()) return "Duration is required";
    if (!videoFile) return "A video file is required";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    try {
      const res = await uploadVideo({
        videoFile: videoFile as File,
        thumbnailFile: thumbFile ?? undefined,
        data: {
          title: form.title.trim(),
          description: form.description.trim(),
          category: form.category,
          // VideoUploadData requires date as string; default to today if blank.
          date: form.date || new Date().toISOString().slice(0, 10),
          duration: form.duration.trim(),
        },
      }).unwrap();
      toast.success(res.message || "Video created");
      setShowForm(false);
      resetForm();
    } catch (e: any) {
      toast.error(e?.data?.message || e?.message || "Upload failed");
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      const res = await deleteVideo(selected._id).unwrap();
      toast.success(res?.message || "Video deleted");
    } catch (e: any) {
      toast.error(e?.data?.message || e?.message || "Failed to delete video");
    } finally {
      setShowDelete(false);
      setSelected(null);
    }
  };

  return (
    <>
      {TopBar}
      <div className='container mx-auto px-4 py-6'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-2'>
            <VideoIcon className='w-6 h-6 text-[#FF9933]' />
            <h1 className='text-2xl font-bold'>Manage Videos</h1>
            <Badge variant='outline' className='ml-2'>
              {videoList.length}
            </Badge>
          </div>
          <Button
            onClick={openCreate}
            className='bg-[#FF9933] hover:bg-[#FF9933]/90'
          >
            <Plus className='w-4 h-4 mr-2' />
            Add Video
          </Button>
        </div>

        {/* States */}
        {isLoading ? (
          <div className='flex items-center justify-center py-16'>
            <Loader2 className='w-6 h-6 animate-spin text-[#FF9933]' />
          </div>
        ) : error ? (
          <Card>
            <CardContent className='flex flex-col items-center gap-3 py-12'>
              <AlertCircle className='w-8 h-8 text-red-500' />
              <p className='text-muted-foreground'>Failed to load videos.</p>
            </CardContent>
          </Card>
        ) : videoList.length === 0 ? (
          <Card>
            <CardContent className='flex flex-col items-center gap-2 py-12'>
              <VideoIcon className='w-8 h-8 text-muted-foreground' />
              <p className='text-muted-foreground'>No videos yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {videoList.map((video) => (
              <Card key={video._id} className='overflow-hidden'>
                <div className='aspect-video bg-gray-100 relative'>
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      loading='lazy'
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <VideoIcon className='w-8 h-8 text-gray-300' />
                    </div>
                  )}
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <PlayCircle className='w-10 h-10 text-white/80 drop-shadow' />
                  </div>
                  {video.duration && (
                    <span className='absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white'>
                      {video.duration}
                    </span>
                  )}
                </div>
                <CardContent className='p-4 space-y-3'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <Badge className='text-orange-500 border-orange-200 bg-orange-50'>
                      {getVideoCategoryName(video.category)}
                    </Badge>
                    {!video.isActive && (
                      <Badge variant='outline' className='text-gray-500'>
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <h3 className='font-semibold line-clamp-1'>{video.title}</h3>
                  {video.description && (
                    <p className='text-sm text-muted-foreground line-clamp-2'>
                      {video.description}
                    </p>
                  )}
                  <div className='flex items-center gap-2 pt-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        navigate(`/editor/videos/edit/${video._id}`)
                      }
                    >
                      <Edit className='w-4 h-4 mr-1' />
                      Edit
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className='text-red-600 hover:text-red-700'
                      onClick={() => {
                        setSelected(video);
                        setShowDelete(true);
                      }}
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Dialog */}
        <Dialog
          open={showForm}
          onOpenChange={(o) => {
            setShowForm(o);
            if (!o) resetForm();
          }}
        >
          <DialogContent className='max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>Add Video</DialogTitle>
              <DialogDescription>
                Upload a video file and fill in the details. A thumbnail is
                optional.
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-4'>
              {/* Video file */}
              <div>
                <Label>Video File *</Label>
                <input
                  ref={videoInputRef}
                  type='file'
                  accept={VIDEO_TYPES.join(",")}
                  className='hidden'
                  onChange={handleVideoChange}
                />
                <div className='mt-2 flex items-center gap-3'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <Upload className='w-4 h-4 mr-2' />
                    {videoFile ? "Change Video" : "Select Video"}
                  </Button>
                  {videoFile && (
                    <span className='text-sm text-muted-foreground truncate'>
                      {videoFile.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail (optional) */}
              <div>
                <Label>Thumbnail (optional)</Label>
                <div className='mt-2 space-y-2'>
                  <div className='aspect-video bg-gray-100 rounded-md overflow-hidden max-w-xs'>
                    {thumbPreview ? (
                      <img
                        src={thumbPreview}
                        alt='Thumbnail preview'
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center'>
                        <VideoIcon className='w-8 h-8 text-gray-300' />
                      </div>
                    )}
                  </div>
                  <input
                    ref={thumbInputRef}
                    type='file'
                    accept={THUMB_TYPES.join(",")}
                    className='hidden'
                    onChange={handleThumbChange}
                  />
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => thumbInputRef.current?.click()}
                  >
                    <Upload className='w-4 h-4 mr-2' />
                    {thumbPreview ? "Change Thumbnail" : "Select Thumbnail"}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor='v-title'>Title *</Label>
                <Input
                  id='v-title'
                  className='mt-2'
                  maxLength={TITLE_MAX}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor='v-cat'>Category *</Label>
                <select
                  id='v-cat'
                  className='mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  <option value=''>Select a category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='v-date'>Date</Label>
                  <Input
                    id='v-date'
                    type='date'
                    className='mt-2'
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor='v-duration'>Duration *</Label>
                  <Input
                    id='v-duration'
                    className='mt-2'
                    placeholder='e.g. 3:45'
                    value={form.duration}
                    onChange={(e) =>
                      setForm({ ...form, duration: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor='v-desc'>Description *</Label>
                <Textarea
                  id='v-desc'
                  className='mt-2'
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder='Describe the video...'
                />
              </div>
            </div>

            <DialogFooter className='mt-6'>
              <Button
                variant='outline'
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isCreating}
                className='bg-[#FF9933] hover:bg-[#FF9933]/90'
              >
                {isCreating && (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                )}
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Video</AlertDialogTitle>
              <AlertDialogDescription>
                Delete <strong>{selected?.title}</strong>? This cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelected(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className='bg-red-600 hover:bg-red-700'
              >
                {isDeleting && (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                )}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default EditorVideoManager;
