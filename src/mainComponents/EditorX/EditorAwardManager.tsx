import React, { useState, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  useGetAwardsQuery,
  useUploadAwardMutation,
  useUpdateAwardPostMutation,
  useDeleteAwardPostMutation,
} from "@/redux-store/services/awardApi";
import { useGetCategoriesByTypeQuery } from "@/redux-store/services/categoryApi";
import {
  AwardPost,
  getAwardCategoryName,
  getAwardCategoryId,
} from "@/types/award.types";
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
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Trophy,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import TopBar from "./TopBar";

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const TITLE_MAX = 120;

interface FormState {
  title: string;
  description: string;
  category: string; // category _id
}

const EMPTY_FORM: FormState = { title: "", description: "", category: "" };

const EditorAwardManager: React.FC = () => {
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);
  const isEditor = useSelector(selectIsEditor);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState<AwardPost | null>(null);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: awards, isLoading, error } = useGetAwardsQuery({});
  const { data: categories = [] } = useGetCategoriesByTypeQuery("award");

  const [uploadAward, { isLoading: isCreating }] = useUploadAwardMutation();
  const [updateAward, { isLoading: isUpdating }] = useUpdateAwardPostMutation();
  const [deleteAward, { isLoading: isDeleting }] = useDeleteAwardPostMutation();

  const awardList: AwardPost[] = useMemo(
    () => (Array.isArray(awards) ? awards : []),
    [awards],
  );

  // ── Access gate (Editor OR Admin) ────────────────────────────
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

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (!picked) return;

    if (!ACCEPTED.includes(picked.type)) {
      toast.error("Only JPEG, PNG, or WebP images are allowed");
      return;
    }
    if (picked.size === 0) {
      toast.error("Selected file is empty");
      return;
    }
    if (picked.size > MAX_FILE_BYTES) {
      toast.error("Image must be 5MB or smaller");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(picked);
    setPreviewUrl(URL.createObjectURL(picked));
  };

  const validateCreate = (): string | null => {
    if (!form.title.trim()) return "Title is required";
    if (form.title.trim().length > TITLE_MAX)
      return `Title cannot exceed ${TITLE_MAX} characters`;
    if (!form.category) return "Please select a category";
    if (!file) return "Please select an image";
    return null;
  };

  // ── Create (multipart upload) ────────────────────────────────
  const handleCreate = async () => {
    const err = validateCreate();
    if (err) {
      toast.error(err);
      return;
    }

    const fd = new FormData();
    fd.append("image", file as File);
    fd.append("title", form.title.trim());
    fd.append("category", form.category); // category _id
    fd.append("description", form.description.trim());
    fd.append("alt", form.title.trim()); // alt defaults to title

    try {
      const res = await uploadAward(fd).unwrap();
      toast.success(res.message || "Award created");
      setShowCreate(false);
      resetForm();
    } catch (e: any) {
      toast.error(e?.data?.message || e?.message || "Failed to create award");
    }
  };

  // ── Edit (text + category only) ──────────────────────────────
  const openEdit = (award: AwardPost) => {
    setSelected(award);
    setForm({
      title: award.title ?? "",
      description: award.description ?? "",
      category: getAwardCategoryId(award.category),
    });
    setShowEdit(true);
  };

  const handleUpdate = async () => {
    if (!selected) return;
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.category) {
      toast.error("Please select a category");
      return;
    }

    try {
      const res = await updateAward({
        id: selected._id,
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
      }).unwrap();
      toast.success(res.message || "Award updated");
      setShowEdit(false);
      setSelected(null);
      resetForm();
    } catch (e: any) {
      toast.error(e?.data?.message || e?.message || "Failed to update award");
    }
  };

  // ── Delete ───────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!selected) return;
    try {
      const res = await deleteAward(selected._id).unwrap();
      toast.success(res?.message || "Award deleted");
    } catch (e: any) {
      toast.error(e?.data?.message || e?.message || "Failed to delete award");
    } finally {
      setShowDelete(false);
      setSelected(null);
    }
  };

  return (
    <>
      <TopBar />
      <div className='container mx-auto px-4 py-6'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-2'>
            <Trophy className='w-6 h-6 text-[#FF9933]' />
            <h1 className='text-2xl font-bold'>Manage Awards</h1>
            <Badge variant='outline' className='ml-2'>
              {awardList.length}
            </Badge>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowCreate(true);
            }}
            className='bg-[#FF9933] hover:bg-[#FF9933]/90'
          >
            <Plus className='w-4 h-4 mr-2' />
            Add Award
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
              <p className='text-muted-foreground'>Failed to load awards.</p>
            </CardContent>
          </Card>
        ) : awardList.length === 0 ? (
          <Card>
            <CardContent className='flex flex-col items-center gap-2 py-12'>
              <Trophy className='w-8 h-8 text-muted-foreground' />
              <p className='text-muted-foreground'>No awards yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {awardList.map((award) => {
              const cover = award.images?.[0];
              return (
                <Card key={award._id} className='overflow-hidden'>
                  <div className='aspect-video bg-gray-100'>
                    {cover ? (
                      <img
                        src={cover.src}
                        alt={cover.alt || award.title}
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
                        {getAwardCategoryName(award.category)}
                      </Badge>
                    </div>
                    <h3 className='font-semibold line-clamp-1'>
                      {award.title}
                    </h3>
                    {award.description && (
                      <p className='text-sm text-muted-foreground line-clamp-2'>
                        {award.description}
                      </p>
                    )}
                    <div className='flex items-center gap-2 pt-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => openEdit(award)}
                      >
                        <Edit className='w-4 h-4 mr-1' />
                        Edit
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        className='text-red-600 hover:text-red-700'
                        onClick={() => {
                          setSelected(award);
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

        {/* Create Dialog */}
        <Dialog
          open={showCreate}
          onOpenChange={(o) => {
            setShowCreate(o);
            if (!o) resetForm();
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Award</DialogTitle>
              <DialogDescription>
                Upload one image with the award details.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='c-title'>Title *</Label>
                <Input
                  id='c-title'
                  className='mt-2'
                  maxLength={TITLE_MAX}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor='c-cat'>Category *</Label>
                {/* Native select — avoids shadcn empty-value issue */}
                <select
                  id='c-cat'
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
              <div>
                <Label htmlFor='c-desc'>Description</Label>
                <Input
                  id='c-desc'
                  className='mt-2'
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Image *</Label>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept={ACCEPTED.join(",")}
                  className='hidden'
                  onChange={handleFileSelect}
                />
                <Button
                  type='button'
                  variant='outline'
                  className='mt-2 w-full'
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className='w-4 h-4 mr-2' />
                  {file ? "Change image" : "Choose image"}
                </Button>
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt='preview'
                    className='mt-3 w-full aspect-video object-cover rounded-md'
                  />
                )}
              </div>
            </div>
            <DialogFooter className='mt-6'>
              <Button
                variant='outline'
                onClick={() => {
                  setShowCreate(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
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

        {/* Edit Dialog (text + category) */}
        <Dialog
          open={showEdit}
          onOpenChange={(o) => {
            setShowEdit(o);
            if (!o) {
              setSelected(null);
              resetForm();
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Award</DialogTitle>
              <DialogDescription>
                Update the title, description, or category. To change images,
                use the dedicated image editor.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
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
              <div>
                <Label htmlFor='e-desc'>Description</Label>
                <Input
                  id='e-desc'
                  className='mt-2'
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter className='mt-6'>
              <Button
                variant='outline'
                onClick={() => {
                  setShowEdit(false);
                  setSelected(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={isUpdating}
                className='bg-[#FF9933] hover:bg-[#FF9933]/90'
              >
                {isUpdating && (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                )}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Award</AlertDialogTitle>
              <AlertDialogDescription>
                Delete <strong>{selected?.title}</strong>? This also removes its
                images and cannot be undone.
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

export default EditorAwardManager;
