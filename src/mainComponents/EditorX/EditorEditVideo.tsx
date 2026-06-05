import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetVideoQuery,
  useUpdateVideoMutation,
} from "@/redux-store/services/videoApi";
import { useGetCategoriesByTypeQuery } from "@/redux-store/services/categoryApi";
import { VideoUpdateData, getVideoCategoryId } from "@/types/video.types";
import {
  selectAuth,
  selectIsAdmin,
  selectIsEditor,
} from "@/redux-store/slices/authSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Save,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Upload,
  Video as VideoIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";

const TITLE_MAX = 160;
const MAX_VIDEO_BYTES = 200 * 1024 * 1024; // 200MB
const MAX_THUMB_BYTES = 5 * 1024 * 1024; // 5MB
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const THUMB_TYPES = ["image/jpeg", "image/png", "image/webp"];

const BACK_ROUTE = "/editor/videos";

interface FormState {
  title: string;
  description: string;
  category: string; // category _id
  date: string; // yyyy-mm-dd
  duration: string;
  isActive: boolean;
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  category: "",
  date: "",
  duration: "",
  isActive: true,
};

const EditorEditVideo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);
  const isEditor = useSelector(selectIsEditor);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const {
    data: videoResp,
    isLoading: isFetching,
    error: fetchError,
  } = useGetVideoQuery(id!, { skip: !id });
  const { data: categories = [] } = useGetCategoriesByTypeQuery("video");
  const [updateVideo, { isLoading: isUpdating }] = useUpdateVideoMutation();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string>(""); // existing or object URL
  const [savingFile, setSavingFile] = useState(false);

  // Hydrate form once the video loads.
  useEffect(() => {
    const video = videoResp?.data?.video;
    if (!video) return;
    setForm({
      title: video.title ?? "",
      description: video.description ?? "",
      category: getVideoCategoryId(video.category),
      date: video.date ? new Date(video.date).toISOString().slice(0, 10) : "",
      duration: video.duration ?? "",
      isActive: video.isActive ?? true,
    });
    setThumbPreview(video.thumbnail ?? "");
  }, [videoResp]);

  // Revoke object URLs on unmount.
  useEffect(() => {
    return () => {
      if (thumbPreview.startsWith("blob:")) URL.revokeObjectURL(thumbPreview);
    };
  }, [thumbPreview]);

  if (!isAuthenticated || (!isEditor && !isAdmin)) {
    return (
      <div className='container mx-auto p-6'>
        <Alert className='max-w-md mx-auto mt-8'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>Editor access required.</AlertDescription>
        </Alert>
      </div>
    );
  }

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
    if (thumbPreview.startsWith("blob:")) URL.revokeObjectURL(thumbPreview);
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
    return null;
  };

  const handleSubmit = async () => {
    if (!id) return;
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    const hasFiles = !!videoFile || !!thumbFile;

    try {
      if (hasFiles) {
        // Multipart path. RTK's updateVideo mutation sends JSON, so a new
        // video/thumbnail file goes through a direct multipart PUT.
        // credentials:"include" sends the auth cookie used by the API.
        const fd = new FormData();
        fd.append("title", form.title.trim());
        fd.append("description", form.description.trim());
        fd.append("category", form.category);
        fd.append("date", form.date || "");
        fd.append("duration", form.duration.trim());
        fd.append("isActive", String(form.isActive));
        if (videoFile) fd.append("video", videoFile);
        if (thumbFile) fd.append("thumbnail", thumbFile);

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
        // Metadata-only update via RTK Query.
        const data: VideoUpdateData = {
          title: form.title.trim(),
          description: form.description.trim(),
          category: form.category,
          date: form.date || undefined,
          duration: form.duration.trim(),
          isActive: form.isActive,
        };
        await updateVideo({ id, data }).unwrap();
      }
      toast.success("Video updated");
      navigate(BACK_ROUTE);
    } catch (e: any) {
      toast.error(e?.data?.message || e?.message || "Update failed");
    } finally {
      setSavingFile(false);
    }
  };

  const isSubmitting = isUpdating || savingFile;

  return (
    <div className='container mx-auto px-4 py-6 max-w-2xl'>
      <Button
        variant='ghost'
        onClick={() => navigate(BACK_ROUTE)}
        className='mb-4 flex items-center gap-2 hover:bg-[#FF9933]/10'
      >
        <ArrowLeft className='w-5 h-5' />
        <span className='font-medium'>Back to Videos</span>
      </Button>

      {isFetching ? (
        <div className='flex items-center justify-center py-16'>
          <Loader2 className='w-6 h-6 animate-spin text-[#FF9933]' />
        </div>
      ) : fetchError || !videoResp?.data?.video ? (
        <Card>
          <CardContent className='flex flex-col items-center gap-3 py-12'>
            <AlertCircle className='w-8 h-8 text-red-500' />
            <p className='text-muted-foreground'>Video not found.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <VideoIcon className='w-5 h-5 text-[#FF9933]' />
              Edit Video
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Replace video file (optional) */}
            <div>
              <Label>Replace Video (optional)</Label>
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

            {/* Thumbnail */}
            <div>
              <Label>Thumbnail</Label>
              <div className='mt-2 space-y-2'>
                <div className='aspect-video bg-gray-100 rounded-md overflow-hidden max-w-xs'>
                  {thumbPreview ? (
                    <img
                      src={thumbPreview}
                      alt='Thumbnail'
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
              <Label htmlFor='e-title'>Title *</Label>
              <Input
                id='e-title'
                className='mt-2'
                maxLength={TITLE_MAX}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor='e-cat'>Category *</Label>
              <select
                id='e-cat'
                className='mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
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
                <Label htmlFor='e-date'>Date</Label>
                <Input
                  id='e-date'
                  type='date'
                  className='mt-2'
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor='e-duration'>Duration *</Label>
                <Input
                  id='e-duration'
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
              <Label htmlFor='e-desc'>Description *</Label>
              <Textarea
                id='e-desc'
                className='mt-2'
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className='flex items-center gap-2'>
              <input
                id='e-active'
                type='checkbox'
                className='h-4 w-4'
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
              />
              <Label htmlFor='e-active' className='cursor-pointer'>
                Active (visible on the public site)
              </Label>
            </div>

            <div className='flex items-center justify-end gap-2 pt-2'>
              <Button variant='outline' onClick={() => navigate(BACK_ROUTE)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className='bg-[#FF9933] hover:bg-[#FF9933]/90'
              >
                {isSubmitting ? (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                ) : (
                  <Save className='w-4 h-4 mr-2' />
                )}
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EditorEditVideo;
