import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useGetBlogPostsQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
} from "@/redux-store/services/blogApi";
import { useGetCategoriesByTypeQuery } from "@/redux-store/services/categoryApi";
import {
  BlogPost,
  BlogFormData,
  getBlogCategoryName,
  getBlogCategoryId,
} from "@/types/blogs.types";
import {
  selectAuth,
  selectIsAdmin,
  selectIsEditor,
} from "@/redux-store/slices/authSlice";
import { useLogoutEditorMutation } from "@/redux-store/services/editorApi";
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
  BookOpen,
  ArrowLeft,
  LogOut,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
// Reuse the existing Cloudinary-backed uploader.
import ImageUpload from "@/mainComponents/Admin/AdminBlogs/ImageUpload";

const TITLE_MAX = 160;

type DialogMode = "create" | "edit";

interface FormState {
  title: string;
  content: string;
  category: string; // category _id
  image: string; // Cloudinary secure_url
}

const EMPTY_FORM: FormState = {
  title: "",
  content: "",
  category: "",
  image: "",
};

const EditorBlogManager: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);
  const isEditor = useSelector(selectIsEditor);

  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState<DialogMode>("create");
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const { data: posts, isLoading, error } = useGetBlogPostsQuery();
  const { data: categories = [] } = useGetCategoriesByTypeQuery("blogs");

  const [createPost, { isLoading: isCreating }] = useCreateBlogPostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdateBlogPostMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeleteBlogPostMutation();

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

  // ── Access gate ──────────────────────────────────────────────
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

  const postList: BlogPost[] = Array.isArray(posts) ? posts : [];

  const resetForm = () => setForm(EMPTY_FORM);

  const openCreate = () => {
    setMode("create");
    resetForm();
    setSelected(null);
    setShowForm(true);
  };

  const openEdit = (post: BlogPost) => {
    setMode("edit");
    setSelected(post);
    setForm({
      title: post.title ?? "",
      content: post.content ?? "",
      category: getBlogCategoryId(post.category),
      image: post.image ?? "",
    });
    setShowForm(true);
  };

  const validate = (): string | null => {
    if (!form.title.trim()) return "Title is required";
    if (form.title.trim().length > TITLE_MAX)
      return `Title cannot exceed ${TITLE_MAX} characters`;
    if (!form.category) return "Please select a category";
    if (!form.content.trim()) return "Content is required";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    const payload: BlogFormData = {
      title: form.title.trim(),
      content: form.content.trim(),
      category: form.category, // _id
      image: form.image || undefined,
      // author omitted — backend records the logged-in user's name
    };

    try {
      if (mode === "create") {
        const res = await createPost(payload).unwrap();
        toast.success(res.message || "Blog created");
      } else if (selected) {
        const res = await updatePost({
          id: selected._id,
          data: payload,
        }).unwrap();
        toast.success(res.message || "Blog updated");
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
      const res = await deletePost(selected._id).unwrap();
      toast.success(res?.message || "Blog deleted");
    } catch (e: any) {
      toast.error(e?.data?.message || e?.message || "Failed to delete blog");
    } finally {
      setShowDelete(false);
      setSelected(null);
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <>
      {TopBar}
      <div className='container mx-auto px-4 py-6'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-2'>
            <BookOpen className='w-6 h-6 text-[#FF9933]' />
            <h1 className='text-2xl font-bold'>Manage Blogs</h1>
            <Badge variant='outline' className='ml-2'>
              {postList.length}
            </Badge>
          </div>
          <Button
            onClick={openCreate}
            className='bg-[#FF9933] hover:bg-[#FF9933]/90'
          >
            <Plus className='w-4 h-4 mr-2' />
            Add Blog
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
              <p className='text-muted-foreground'>Failed to load blogs.</p>
            </CardContent>
          </Card>
        ) : postList.length === 0 ? (
          <Card>
            <CardContent className='flex flex-col items-center gap-2 py-12'>
              <BookOpen className='w-8 h-8 text-muted-foreground' />
              <p className='text-muted-foreground'>No blog posts yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {postList.map((post) => (
              <Card key={post._id} className='overflow-hidden'>
                <div className='aspect-video bg-gray-100'>
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
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
                      {getBlogCategoryName(post.category)}
                    </Badge>
                  </div>
                  <h3 className='font-semibold line-clamp-1'>{post.title}</h3>
                  {post.content && (
                    <p className='text-sm text-muted-foreground line-clamp-2'>
                      {post.content}
                    </p>
                  )}
                  <div className='flex items-center gap-2 pt-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => openEdit(post)}
                    >
                      <Edit className='w-4 h-4 mr-1' />
                      Edit
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className='text-red-600 hover:text-red-700'
                      onClick={() => {
                        setSelected(post);
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
                {mode === "create" ? "Add Blog Post" : "Edit Blog Post"}
              </DialogTitle>
              <DialogDescription>
                {mode === "create"
                  ? "Fill in the details to publish a new post."
                  : "Update the post details."}
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-4'>
              <div>
                <Label htmlFor='b-title'>Title *</Label>
                <Input
                  id='b-title'
                  className='mt-2'
                  maxLength={TITLE_MAX}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor='b-cat'>Category *</Label>
                <select
                  id='b-cat'
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

              {/* Reuses the existing Cloudinary uploader; returns a secure_url */}
              <ImageUpload
                currentImageUrl={form.image}
                onImageUploaded={(url) => setForm({ ...form, image: url })}
                label='Featured Image'
              />

              <div>
                <Label htmlFor='b-content'>Content *</Label>
                <Textarea
                  id='b-content'
                  className='mt-2'
                  rows={10}
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  placeholder='Write your blog post content here...'
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
              <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
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

export default EditorBlogManager;
