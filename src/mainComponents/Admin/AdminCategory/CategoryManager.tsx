import React, { useState } from "react";
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../../redux-store/services/categoryApi";
import { Category, CategoryCreateData } from "@/types/category.types";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Edit2,
  Trash2,
  Folder,
  Image,
  Video,
  FileText,
  Loader2,
  Search,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { BackNavigation } from "@/config/navigation/BackNavigation";

interface CategoryFormData {
  name: string;
  type: "photo" | "video" | "blogs";
}

const CategoryManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "photo" | "video" | "blogs"
  >("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    type: "photo",
  });

  // RTK Query hooks
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

  // Filter categories based on search and type
  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || category.type === filterType;
    return matchesSearch && matchesType;
  });

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "photo":
        return <Image className='w-4 h-4' />;
      case "video":
        return <Video className='w-4 h-4' />;
      case "press":
        return <FileText className='w-4 h-4' />;
      default:
        return <Folder className='w-4 h-4' />;
    }
  };

  // Get type badge variant
  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "photo":
        return "default";
      case "video":
        return "secondary";
      case "press":
        return "outline";
      default:
        return "default";
    }
  };

  // Handle form reset
  const resetForm = () => {
    setFormData({ name: "", type: "photo" });
    setSelectedCategory(null);
  };

  // Handle create category
  const handleCreate = () => {
    resetForm();
    setShowCreateDialog(true);
  };

  // Handle edit category
  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      type: category.type as "photo" | "video" | "blogs",
    });
    setShowEditDialog(true);
  };

  // Handle delete category
  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteDialog(true);
  };

  // Submit create form
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      await createCategory({
        name: formData.name.trim(),
        type: formData.type,
      } as CategoryCreateData).unwrap();

      toast.success("Category created successfully");
      setShowCreateDialog(false);
      resetForm();
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to create category";
      toast.error(errorMessage);
    }
  };

  // Submit edit form
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      await updateCategory({
        id: selectedCategory._id,
        data: { name: formData.name.trim() },
      }).unwrap();

      toast.success("Category updated successfully");
      setShowEditDialog(false);
      resetForm();
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to update category";
      toast.error(errorMessage);
    }
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategory(selectedCategory._id).unwrap();
      toast.success("Category deleted successfully");
      setShowDeleteDialog(false);
      setSelectedCategory(null);
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to delete category";
      toast.error(errorMessage);
    }
  };

  // Group categories by type for stats
  const categoryStats = categories.reduce((acc, category) => {
    acc[category.type] = (acc[category.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <Loader2 className='w-8 h-8 animate-spin text-[#FF9933]' />
          <p className='text-sm text-gray-600'>Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-600 mb-4'>Failed to load categories</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <BackNavigation />

      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4'>
        <div className='max-w-7xl mx-auto'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-2xl font-bold text-gray-900 mb-2'>
              Category Management
            </h1>
            <p className='text-gray-600'>
              Manage categories for photos, videos, and press articles
            </p>
          </div>

          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Categories
                </CardTitle>
                <Folder className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{categories.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Photo Categories
                </CardTitle>
                <Image className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {categoryStats.photo || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Video Categories
                </CardTitle>
                <Video className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {categoryStats.video || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Press Categories
                </CardTitle>
                <FileText className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {categoryStats.press || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <Card className='mb-6'>
            <CardContent className='pt-6'>
              <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
                <div className='flex flex-col sm:flex-row gap-4 items-center flex-1'>
                  <div className='relative flex-1 max-w-sm'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                    <Input
                      placeholder='Search categories...'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className='pl-10'
                    />
                  </div>

                  <Select
                    value={filterType}
                    onValueChange={(value: any) => setFilterType(value)}
                  >
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder='Filter by type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Types</SelectItem>
                      <SelectItem value='photo'>Photo</SelectItem>
                      <SelectItem value='video'>Video</SelectItem>
                      <SelectItem value='press'>Press</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleCreate}
                  className='bg-[#FF9933] hover:bg-[#FF9933]/90'
                >
                  <Plus className='w-4 h-4 mr-2' />
                  Add Category
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Categories Table */}
          <Card>
            <CardContent className='pt-6'>
              {filteredCategories.length === 0 ? (
                <div className='text-center py-12'>
                  <Folder className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                  <p className='text-gray-500 text-lg mb-2'>
                    {searchTerm || filterType !== "all"
                      ? "No categories found"
                      : "No categories yet"}
                  </p>
                  <p className='text-gray-400 mb-4'>
                    {searchTerm || filterType !== "all"
                      ? "Try adjusting your search or filter"
                      : "Create your first category to get started"}
                  </p>
                  {!searchTerm && filterType === "all" && (
                    <Button
                      onClick={handleCreate}
                      className='bg-[#FF9933] hover:bg-[#FF9933]/90'
                    >
                      <Plus className='w-4 h-4 mr-2' />
                      Add Category
                    </Button>
                  )}
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
                    {filteredCategories.map((category) => (
                      <TableRow key={category._id}>
                        <TableCell className='font-medium'>
                          {category.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getTypeBadgeVariant(category.type)}
                            className='gap-1'
                          >
                            {getTypeIcon(category.type)}
                            {category.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(category.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className='text-right'>
                          <div className='flex justify-end gap-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleEdit(category)}
                              className='hover:bg-blue-50'
                            >
                              <Edit2 className='w-4 h-4' />
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleDelete(category)}
                              className='hover:bg-red-50 hover:text-red-600'
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

          {/* Create Category Dialog */}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
                <DialogDescription>
                  Add a new category for organizing your content.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateSubmit}>
                <div className='space-y-4 py-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Category Name</Label>
                    <Input
                      id='name'
                      placeholder='Enter category name'
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      maxLength={100}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='type'>Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "photo" | "video" | "blogs") =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='photo'>
                          <div className='flex items-center gap-2'>
                            <Image className='w-4 h-4' />
                            Photo
                          </div>
                        </SelectItem>
                        <SelectItem value='video'>
                          <div className='flex items-center gap-2'>
                            <Video className='w-4 h-4' />
                            Video
                          </div>
                        </SelectItem>
                        <SelectItem value='press'>
                          <div className='flex items-center gap-2'>
                            <FileText className='w-4 h-4' />
                            Press
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    disabled={isCreating || !formData.name.trim()}
                    className='bg-[#FF9933] hover:bg-[#FF9933]/90'
                  >
                    {isCreating && (
                      <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    )}
                    Create Category
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit Category Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogDescription>
                  Update the category name. Type cannot be changed.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditSubmit}>
                <div className='space-y-4 py-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='edit-name'>Category Name</Label>
                    <Input
                      id='edit-name'
                      placeholder='Enter category name'
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      maxLength={100}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>Type</Label>
                    <div className='flex items-center gap-2 p-3 bg-gray-50 rounded-md'>
                      {getTypeIcon(formData.type)}
                      <span className='font-medium capitalize'>
                        {formData.type}
                      </span>
                      <Badge variant='outline' className='ml-auto'>
                        Cannot be changed
                      </Badge>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setShowEditDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    disabled={isUpdating || !formData.name.trim()}
                    className='bg-[#FF9933] hover:bg-[#FF9933]/90'
                  >
                    {isUpdating && (
                      <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    )}
                    Update Category
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "
                  <strong>{selectedCategory?.name}</strong>"? This action cannot
                  be undone and will fail if the category is currently in use.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className='bg-red-600 hover:bg-red-700'
                >
                  {isDeleting && (
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  )}
                  Delete Category
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
};

export default CategoryManager;
