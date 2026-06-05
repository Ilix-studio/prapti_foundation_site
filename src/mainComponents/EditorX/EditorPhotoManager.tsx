import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useGetPhotosQuery,
  useUploadPhotoMutation,
  useUpdatePhotoMutation,
  useUpdatePhotoWithFileMutation,
  useDeletePhotoMutation,
} from "@/redux-store/services/photoApi";
import { useGetCategoriesByTypeQuery } from "@/redux-store/services/categoryApi";
import { useLogoutEditorMutation } from "@/redux-store/services/editorApi";
import { Photo } from "@/types/photo.types";
import { getPhotoCategoryName } from "@/mainComponents/Gallery/galleryHelper";
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
  Camera,
  ArrowLeft,
  LogOut,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import { toast } from "react-hot-toast";

const TITLE_MAX = 160;
const ALT_MAX = 200;
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type DialogMode = "create" | "edit";

interface FormState {
  title: string;
  category: string; // category _id
  alt: string;
  location: string;
  description: string;
  date: string; // yyyy-mm-dd
}

const EMPTY_FORM: FormState = {
  title: "",
  category: "",
  alt: "",
  location: "",
  description: "",
  date: "",
};

const EditorPhotoManager: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);
  const isEditor = useSelector(selectIsEditor);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState<DialogMode>("create");
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState<Photo | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(""); // existing or object URL

  const {
    data: photosResp,
    isLoading,
    error,
  } = useGetPhotosQuery({
    page: 1,
    limit: 100,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const { data: categories = [] } = useGetCategoriesByTypeQuery("photo");

  const [uploadPhoto, { isLoading: isCreating }] = useUploadPhotoMutation();
  const [updatePhoto, { isLoading: isUpdating }] = useUpdatePhotoMutation();
  const [updatePhotoWithFile, { isLoading: isUpdatingFile }] =
    useUpdatePhotoWithFileMutation();
  const [deletePhoto, { isLoading: isDeleting }] = useDeletePhotoMutation();
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

  const photoList: Photo[] = photosResp?.data?.photos ?? [];

  // Revoke any object URL we created before replacing/clearing it.
  const clearPreviewObjectUrl = () => {
    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
  };

  const resetForm = () => {
    clearPreviewObjectUrl();
    setForm(EMPTY_FORM);
    setFile(null);
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openCreate = () => {
    setMode("create");
    resetForm();
    setSelected(null);
    setShowForm(true);
  };

  const openEdit = (photo: Photo) => {
    setMode("edit");
    setSelected(photo);
    clearPreviewObjectUrl();
    const firstImage = photo.images?.[0];
    setForm({
      title: photo.title ?? "",
      category:
        typeof photo.category === "string"
          ? photo.category
          : (photo.category?._id ?? ""),
      alt: firstImage?.alt ?? "",
      location: photo.location ?? "",
      description: photo.description ?? "",
      date: photo.date ? new Date(photo.date).toISOString().slice(0, 10) : "",
    });
    setFile(null);
    setPreview(firstImage?.src ?? "");
    setShowForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!ACCEPTED_TYPES.includes(f.type)) {
      toast.error("Only JPEG, PNG, or WebP images are allowed");
      e.target.value = "";
      return;
    }
    if (f.size > MAX_FILE_BYTES) {
      toast.error("Image must be 5MB or smaller");
      e.target.value = "";
      return;
    }
    clearPreviewObjectUrl();
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const validate = (): string | null => {
    if (!form.title.trim()) return "Title is required";
    if (form.title.trim().length > TITLE_MAX)
      return `Title cannot exceed ${TITLE_MAX} characters`;
    if (!form.category) return "Please select a category";
    if (!form.alt.trim()) return "Alt text is required for accessibility";
    if (form.alt.trim().length > ALT_MAX)
      return `Alt text cannot exceed ${ALT_MAX} characters`;
    if (mode === "create" && !file) return "An image file is required";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    try {
      if (mode === "create") {
        // file is guaranteed by validate()
        const res = await uploadPhoto({
          file: file as File,
          data: {
            title: form.title.trim(),
            category: form.category,
            alt: form.alt.trim(),
            date: form.date || undefined,
            location: form.location.trim() || undefined,
            description: form.description.trim() || undefined,
          },
        }).unwrap();
        toast.success(res.message || "Photo created");
      } else if (selected) {
        if (file) {
          // Image replaced -> multipart update path.
          const res = await updatePhotoWithFile({
            id: selected._id,
            file,
            data: {
              title: form.title.trim(),
              category: form.category,
              date: form.date || undefined,
              location: form.location.trim() || undefined,
              description: form.description.trim() || undefined,
              alt: form.alt.trim(),
            },
          }).unwrap();
          toast.success(res.message || "Photo updated");
        } else {
          // Metadata-only update (JSON).
          const res = await updatePhoto({
            id: selected._id,
            data: {
              title: form.title.trim(),
              category: form.category,
              date: form.date || undefined,
              location: form.location.trim() || undefined,
              description: form.description.trim() || undefined,
            },
          }).unwrap();
          toast.success(res.message || "Photo updated");
        }
      }
      setShowForm(false);
      setSelected(null);
      resetForm();
    } catch (e: any) {
      toast.error(e?.data?.message || e?.message || "Operation failed");
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      const res = await deletePhoto(selected._id).unwrap();
      toast.success(res?.message || "Photo deleted");
    } catch (e: any) {
      toast.error(e?.data?.message || e?.message || "Failed to delete photo");
    } finally {
      setShowDelete(false);
      setSelected(null);
    }
  };

  const isSubmitting = isCreating || isUpdating || isUpdatingFile;

  return (
    <>
      {TopBar}
      <div className='container mx-auto px-4 py-6'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-2'>
            <Camera className='w-6 h-6 text-[#FF9933]' />
            <h1 className='text-2xl font-bold'>Manage Photos</h1>
            <Badge variant='outline' className='ml-2'>
              {photoList.length}
            </Badge>
          </div>
          <Button
            onClick={openCreate}
            className='bg-[#FF9933] hover:bg-[#FF9933]/90'
          >
            <Plus className='w-4 h-4 mr-2' />
            Add Photo
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
              <p className='text-muted-foreground'>Failed to load photos.</p>
            </CardContent>
          </Card>
        ) : photoList.length === 0 ? (
          <Card>
            <CardContent className='flex flex-col items-center gap-2 py-12'>
              <Camera className='w-8 h-8 text-muted-foreground' />
              <p className='text-muted-foreground'>No photos yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {photoList.map((photo) => {
              const img = photo.images?.[0];
              return (
                <Card key={photo._id} className='overflow-hidden'>
                  <div className='aspect-video bg-gray-100'>
                    {img?.src ? (
                      <img
                        src={img.src}
                        alt={img.alt || photo.title}
                        loading='lazy'
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center'>
                        <ImageIcon className='w-8 h-8 text-gray-300' />
                      </div>
                    )}
                  </div>
                  <CardContent className='p-4 space-y-3'>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <Badge className='text-orange-500 border-orange-200 bg-orange-50'>
                        {getPhotoCategoryName(photo.category)}
                      </Badge>
                      {photo.images?.length > 1 && (
                        <Badge variant='outline'>
                          {photo.images.length} images
                        </Badge>
                      )}
                    </div>
                    <h3 className='font-semibold line-clamp-1'>
                      {photo.title}
                    </h3>
                    {photo.description && (
                      <p className='text-sm text-muted-foreground line-clamp-2'>
                        {photo.description}
                      </p>
                    )}
                    <div className='flex items-center gap-2 pt-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => openEdit(photo)}
                      >
                        <Edit className='w-4 h-4 mr-1' />
                        Edit
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        className='text-red-600 hover:text-red-700'
                        onClick={() => {
                          setSelected(photo);
                          setShowDelete(true);
                        }}
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Create / Edit Dialog */}
        <Dialog
          open={showForm}
          onOpenChange={(o) => {
            setShowForm(o);
            if (!o) {
              setSelected(null);
              resetForm();
            }
          }}
        >
          <DialogContent className='max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>
                {mode === "create" ? "Add Photo" : "Edit Photo"}
              </DialogTitle>
              <DialogDescription>
                {mode === "create"
                  ? "Upload an image and fill in the details."
                  : "Update the photo details. Pick a new file only to replace the image."}
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-4'>
              {/* Image picker (hidden native input triggered by button) */}
              <div>
                <Label>
                  {mode === "create" ? "Image *" : "Image (replace optional)"}
                </Label>
                <div className='mt-2 space-y-2'>
                  <div className='aspect-video bg-gray-100 rounded-md overflow-hidden'>
                    {preview ? (
                      <img
                        src={preview}
                        alt='Preview'
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center'>
                        <ImageIcon className='w-8 h-8 text-gray-300' />
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept={ACCEPTED_TYPES.join(",")}
                    className='hidden'
                    onChange={handleFileChange}
                  />
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className='w-4 h-4 mr-2' />
                    {preview ? "Change Image" : "Select Image"}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor='p-title'>Title *</Label>
                <Input
                  id='p-title'
                  className='mt-2'
                  maxLength={TITLE_MAX}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor='p-alt'>Alt Text *</Label>
                <Input
                  id='p-alt'
                  className='mt-2'
                  maxLength={ALT_MAX}
                  value={form.alt}
                  onChange={(e) => setForm({ ...form, alt: e.target.value })}
                  placeholder='Describe the image for accessibility'
                />
              </div>

              <div>
                <Label htmlFor='p-cat'>Category *</Label>
                <select
                  id='p-cat'
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
                  <Label htmlFor='p-date'>Date</Label>
                  <Input
                    id='p-date'
                    type='date'
                    className='mt-2'
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor='p-location'>Location</Label>
                  <Input
                    id='p-location'
                    className='mt-2'
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor='p-desc'>Description</Label>
                <Textarea
                  id='p-desc'
                  className='mt-2'
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder='Optional description...'
                />
              </div>
            </div>

            <DialogFooter className='mt-6'>
              <Button
                variant='outline'
                onClick={() => {
                  setShowForm(false);
                  setSelected(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className='bg-[#FF9933] hover:bg-[#FF9933]/90'
              >
                {isSubmitting && (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                )}
                {mode === "create" ? "Create" : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Photo</AlertDialogTitle>
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

export default EditorPhotoManager;
