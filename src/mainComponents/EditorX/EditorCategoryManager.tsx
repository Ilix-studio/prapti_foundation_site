import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/redux-store/services/categoryApi";
import { Category, CategoryCreateData } from "@/types/category.types";
import {
  selectAuth,
  selectIsAdmin,
  selectIsEditor,
} from "@/redux-store/slices/authSlice";
import { useLogoutEditorMutation } from "@/redux-store/services/editorApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Edit2,
  Trash2,
  Folder,
  Image as ImageIcon,
  Video,
  FileText,
  Loader2,
  Search,
  AlertCircle,
  Trophy,
  Ambulance,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { toast } from "react-hot-toast";

type CategoryType = "photo" | "video" | "blogs" | "award" | "rescue";
const TYPES: CategoryType[] = ["photo", "video", "blogs", "award", "rescue"];
const NAME_MAX = 100;

interface FormState {
  name: string;
  type: CategoryType;
}

const EMPTY_FORM: FormState = { name: "", type: "photo" };

const getTypeIcon = (type: string) => {
  switch (type) {
    case "photo":
      return <ImageIcon className='w-4 h-4' />;
    case "video":
      return <Video className='w-4 h-4' />;
    case "blogs":
      return <FileText className='w-4 h-4' />;
    case "award":
      return <Trophy className='w-4 h-4' />;
    case "rescue":
      return <Ambulance className='w-4 h-4' />;
    default:
      return <Folder className='w-4 h-4' />;
  }
};

const EditorCategoryManager: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);
  const isEditor = useSelector(selectIsEditor);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | CategoryType>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState<Category | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const {
    data: categories = [],
    isLoading,
    error,
  } = useGetAllCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

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

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return categories.filter((c) => {
      const matchesType = filterType === "all" || c.type === filterType;
      const matchesTerm = !term || c.name.toLowerCase().includes(term);
      return matchesType && matchesTerm;
    });
  }, [categories, searchTerm, filterType]);

  const resetForm = () => setForm(EMPTY_FORM);

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

  // ── Create ───────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      await createCategory({
        name: form.name.trim(),
        type: form.type,
      } as CategoryCreateData).unwrap();
      toast.success("Category created");
      setShowCreate(false);
      resetForm();
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to create category");
    }
  };

  // ── Edit (name only; type immutable) ─────────────────────────
  const openEdit = (cat: Category) => {
    setSelected(cat);
    setForm({ name: cat.name, type: cat.type as CategoryType });
    setShowEdit(true);
  };

  const handleUpdate = async () => {
    if (!selected || !form.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      await updateCategory({
        id: selected._id,
        data: { name: form.name.trim() },
      }).unwrap();
      toast.success("Category updated");
      setShowEdit(false);
      setSelected(null);
      resetForm();
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to update category");
    }
  };

  // ── Delete ───────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!selected) return;
    try {
      await deleteCategory(selected._id).unwrap();
      toast.success("Category deleted");
    } catch (e: any) {
      toast.error(
        e?.data?.message || "Failed to delete category. It may be in use.",
      );
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
            <Folder className='w-6 h-6 text-[#FF9933]' />
            <h1 className='text-2xl font-bold'>Manage Categories</h1>
            <Badge variant='outline' className='ml-2'>
              {categories.length}
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
            Add Category
          </Button>
        </div>

        {/* Filters */}
        <div className='flex flex-col sm:flex-row gap-3 mb-4'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            <Input
              placeholder='Search by name'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-9'
            />
          </div>
          <select
            className='rounded-md border border-input bg-background px-3 py-2 text-sm'
            value={filterType}
            onChange={(e) =>
              setFilterType(e.target.value as "all" | CategoryType)
            }
          >
            <option value='all'>All types</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
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
              <p className='text-muted-foreground'>
                Failed to load categories.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className='p-0'>
              {filtered.length === 0 ? (
                <div className='text-center py-12'>
                  <Folder className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                  <p className='text-gray-500 text-lg mb-2'>
                    {searchTerm || filterType !== "all"
                      ? "No categories found"
                      : "No categories yet"}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((category) => (
                      <TableRow key={category._id}>
                        <TableCell className='font-medium'>
                          {category.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant='outline' className='gap-1'>
                            {getTypeIcon(category.type)}
                            {category.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(category.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className='text-right'>
                          <div className='flex items-center justify-end gap-2'>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => openEdit(category)}
                            >
                              <Edit2 className='w-4 h-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='text-red-600 hover:text-red-700'
                              onClick={() => {
                                setSelected(category);
                                setShowDelete(true);
                              }}
                            >
                              <Trash2 className='w-4 h-4' />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
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
              <DialogTitle>Create Category</DialogTitle>
              <DialogDescription>
                Add a new category for organizing content.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='c-name'>Name *</Label>
                <Input
                  id='c-name'
                  className='mt-2'
                  maxLength={NAME_MAX}
                  placeholder='Enter category name'
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor='c-type'>Type *</Label>
                <select
                  id='c-type'
                  className='mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value as CategoryType })
                  }
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
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
                disabled={isCreating || !form.name.trim()}
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

        {/* Edit Dialog */}
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
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update the name. Type cannot be changed.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='e-name'>Name *</Label>
                <Input
                  id='e-name'
                  className='mt-2'
                  maxLength={NAME_MAX}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Type</Label>
                <div className='flex items-center gap-2 p-3 bg-gray-50 rounded-md mt-2'>
                  {getTypeIcon(form.type)}
                  <span className='font-medium capitalize'>{form.type}</span>
                  <Badge variant='outline' className='ml-auto'>
                    Cannot be changed
                  </Badge>
                </div>
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
                disabled={isUpdating || !form.name.trim()}
                className='bg-[#FF9933] hover:bg-[#FF9933]/90'
              >
                {isUpdating && (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                )}
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Category</AlertDialogTitle>
              <AlertDialogDescription>
                Delete "<strong>{selected?.name}</strong>"? This cannot be
                undone and will fail if the category is currently in use.
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

export default EditorCategoryManager;
