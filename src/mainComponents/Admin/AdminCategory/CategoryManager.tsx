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
import { Card, CardContent } from "@/components/ui/card";
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
  AlertCircle,
  Blend,
  Trophy,
  Ambulance,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { BackNavigation } from "@/config/navigation/BackNavigation";

interface CategoryFormData {
  name: string;
  type: "photo" | "video" | "blogs" | "award" | "rescue";
}

const CategoryManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "photo" | "video" | "blogs" | "award" | "rescue"
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
      case "blogs":
        return <Blend className='w-4 h-4' />;
      case "award":
        return <Trophy className='w-4 h-4' />;
      case "rescue":
        return <Ambulance className='w-4 h-4' />;
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
      case "blogs":
        return "outline";
      case "award":
        return "outline";
      case "rescue":
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
      type: category.type as "photo" | "video" | "blogs" | "award" | "rescue",
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

  // Statistics Cards
  const statsCards = [
    {
      title: "Total Categories",
      value: categories.length,
      icon: Folder,
      color: "bg-blue-500",
    },
    {
      title: "Photo Categories",
      value: categoryStats.photo || 0,
      icon: Image,
      color: "bg-green-500",
    },
    {
      title: "Video Categories",
      value: categoryStats.video || 0,
      icon: Video,
      color: "bg-purple-500",
    },
    {
      title: "Blogs Categories",
      value: categoryStats.blogs || 0,
      icon: FileText,
      color: "bg-yellow-500",
    },
    {
      title: "Award Categories",
      value: categoryStats.blogs || 0,
      icon: FileText,
      color: "bg-red-500",
    },
    {
      title: "Rescue Categories",
      value: categoryStats.blogs || 0,
      icon: FileText,
      color: "bg-cyan-500",
    },
  ];

  if (error) {
    return (
      <>
        <BackNavigation />
        <div className='container mx-auto p-6'>
          <div className='flex items-center justify-center h-64'>
            <div className='text-center'>
              <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Error Loading Categories
              </h3>
              <p className='text-gray-600 mb-4'>
                Failed to load category data. Please try again.
              </p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <BackNavigation />
      <div className='container mx-auto p-6 space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Category Management
            </h1>
            <p className='text-gray-600'>
              Manage categories for photos, videos, and blogs articles
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {statsCards.map((stat) => (
            <Card
              key={stat.title}
              className='border-l-3 border-l-orange-500 hover:scale-105'
            >
              <CardContent className='p-6 '>
                <div className='flex items-center'>
                  <div className={`${stat.color} p-2 rounded-lg`}>
                    <stat.icon className='w-4 h-4 text-white' />
                  </div>
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-gray-600'>
                      {stat.title}
                    </p>
                    <p className='text-1xl font-bold text-gray-900'>
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Controls */}
        <Card>
          <CardContent className='p-6'>
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
                    <SelectItem value='blogs'>Blogs</SelectItem>
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
          <CardContent className='p-0'>
            {isLoading ? (
              <div className='flex items-center justify-center h-64'>
                <Loader2 className='w-8 h-8 animate-spin' />
              </div>
            ) : filteredCategories.length === 0 ? (
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
                    <TableHead>Actions</TableHead>
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
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleEdit(category)}
                          >
                            <Edit2 className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleDelete(category)}
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
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
              <DialogDescription>
                Add a new category for organizing your content.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit}>
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='name'>Category Name *</Label>
                  <Input
                    id='name'
                    placeholder='Enter category name'
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    maxLength={100}
                    className='mt-2'
                  />
                </div>
                <div>
                  <Label htmlFor='type'>Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(
                      value: "photo" | "video" | "blogs" | "award" | "rescue"
                    ) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger className='mt-2'>
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
                      <SelectItem value='blogs'>
                        <div className='flex items-center gap-2'>
                          <FileText className='w-4 h-4' />
                          Blogs
                        </div>
                      </SelectItem>
                      <SelectItem value='award'>
                        <div className='flex items-center gap-2'>
                          <FileText className='w-4 h-4' />
                          Award
                        </div>
                      </SelectItem>
                      <SelectItem value='rescue'>
                        <div className='flex items-center gap-2'>
                          <FileText className='w-4 h-4' />
                          Rescue
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className='mt-6'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setShowCreateDialog(false);
                    resetForm();
                  }}
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
                  Create
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update the category name. Type cannot be changed.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit}>
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='edit-name'>Category Name *</Label>
                  <Input
                    id='edit-name'
                    placeholder='Enter category name'
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    maxLength={100}
                    className='mt-2'
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <div className='flex items-center gap-2 p-3 bg-gray-50 rounded-md mt-2'>
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
              <DialogFooter className='mt-6'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setShowEditDialog(false);
                    resetForm();
                  }}
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
                  Update
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default CategoryManager;
