// src/mainComponents/BlogPosts/AddBlogForm.tsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Navigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2, Plus, Check, X } from "lucide-react";
import { selectIsAdmin } from "@/redux-store/slices/authSlice";
import {
  useCreateBlogPostMutation,
  useGetBlogPostByIdQuery,
  useUpdateBlogPostMutation,
} from "@/redux-store/services/blogApi";
import {
  useGetCategoriesByTypeQuery,
  useCreateCategoryMutation,
} from "@/redux-store/services/categoryApi";
import { useDeleteImageMutation } from "@/redux-store/services/cloudinaryApi";
import cloudinaryService from "@/redux-store/slices/cloudinaryService";
import { getBlogCategoryId } from "@/types/blogs.types";
import ImageUpload from "./ImageUpload";
import { BackNavigation } from "@/config/navigation/BackNavigation";

const AddBlogForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isAdmin = useSelector(selectIsAdmin);
  const isEditMode = Boolean(id);

  // RTK Query hooks
  const [createBlogPost, { isLoading: isCreating }] =
    useCreateBlogPostMutation();
  const [updateBlogPost, { isLoading: isUpdating }] =
    useUpdateBlogPostMutation();
  const [deleteImage] = useDeleteImageMutation();
  const [createCategory, { isLoading: creatingCategory }] =
    useCreateCategoryMutation();
  const { data: existingPost, isLoading: isFetching } = useGetBlogPostByIdQuery(
    id!,
    {
      skip: !isEditMode,
    }
  );

  // Fetch blog categories
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useGetCategoriesByTypeQuery("blogs");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [previousImage, setPreviousImage] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Category management state
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // If not an admin, redirect to login
  if (!isAdmin) {
    return <Navigate to='/admin/login' />;
  }

  // Populate form with existing data when in edit mode
  useEffect(() => {
    if (isEditMode && existingPost) {
      setTitle(existingPost.title);
      setContent(existingPost.content);
      setCategory(getBlogCategoryId(existingPost.category));
      setImage(existingPost.image);
      setPreviousImage(existingPost.image);
    }
  }, [isEditMode, existingPost]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!title || !content || !category) {
        setError("All fields are required");
        return;
      }

      const blogData = {
        title,
        content,
        category,
        image,
      };

      // If we're in edit mode and the image has changed, we should delete the old image
      if (isEditMode && previousImage && image !== previousImage) {
        try {
          const publicId = cloudinaryService.extractPublicId(previousImage);
          if (publicId) {
            await deleteImage(publicId).unwrap();
            console.log("Previous image deleted successfully");
          }
        } catch (deleteError) {
          console.error("Failed to delete previous image:", deleteError);
          // Don't block the post update if image deletion fails
        }
      }

      if (isEditMode && id) {
        // Update existing blog post
        await updateBlogPost({ id, data: blogData }).unwrap();
      } else {
        // Create new blog post
        await createBlogPost(blogData).unwrap();
      }

      // Navigate back to the blogs dashboard after successful operation
      navigate("/admin/blogsDashboard");
    } catch (err: any) {
      setError(
        err.data?.message || "Failed to save blog post. Please try again."
      );
      console.error("Error saving blog post:", err);
    }
  };

  // Create new category
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setError("Please enter a category name");
      return;
    }

    try {
      const result = await createCategory({
        name: newCategoryName.trim(),
        type: "blogs",
      }).unwrap();

      console.log("Created category:", result);
      setNewCategoryName("");
      setShowAddCategory(false);

      // Auto-select the newly created category
      setCategory(result._id);
    } catch (error: any) {
      console.error("Create category error:", error);
      setError(
        error?.data?.message || error?.message || "Failed to create category"
      );
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    setImage(imageUrl);
  };

  const isLoading = isCreating || isUpdating || isFetching;

  return (
    <>
      <BackNavigation />
      <div className='min-h-screen bg-gray-50'>
        <div className='bg-white'>
          <div className='container mx-auto px-22 py-2 flex'>
            <div className='flex items-center gap-2'>
              <h1 className='text-xl font-bold'>Add New Blog Post</h1>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className='container mx-auto px-4 py-8'>
          <div className='max-w-3xl mx-auto bg-white rounded-lg shadow p-6'>
            {isFetching ? (
              <div className='flex justify-center items-center py-20'>
                <Loader2 className='h-8 w-8 text-orange-500 animate-spin' />
                <span className='ml-2'>Loading post data...</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-6'>
                {error && (
                  <div className='bg-red-50 text-red-500 p-3 rounded-md text-sm'>
                    {error}
                  </div>
                )}

                <div className='space-y-2'>
                  <Label htmlFor='title'>Title</Label>
                  <Input
                    id='title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='Enter blog post title'
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='category'>Category</Label>
                  <div className='flex gap-2'>
                    <select
                      id='category'
                      name='category'
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className='flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                      required
                      disabled={isCategoriesLoading}
                    >
                      <option value=''>
                        {isCategoriesLoading
                          ? "Loading categories..."
                          : categories.length === 0
                          ? "No categories available"
                          : "Select category"}
                      </option>
                      {!isCategoriesLoading &&
                        categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                    <Button
                      type='button'
                      onClick={() => setShowAddCategory(!showAddCategory)}
                      className='px-3 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-1'
                      title='Add new category'
                    >
                      <Plus className='w-4 h-4' />
                    </Button>
                  </div>

                  {/* Add Category Input */}
                  {showAddCategory && (
                    <div className='mt-2 p-3 bg-gray-50 rounded-lg border'>
                      <div className='flex gap-2'>
                        <Input
                          type='text'
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder='Enter category name'
                          className='flex-1'
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleCreateCategory()
                          }
                        />
                        <Button
                          type='button'
                          onClick={handleCreateCategory}
                          disabled={creatingCategory}
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
                        >
                          <X className='w-4 h-4' />
                        </Button>
                      </div>
                    </div>
                  )}

                  {categoriesError && (
                    <p className='text-sm text-red-500 mt-1'>
                      Failed to load categories. Please refresh and try again.
                    </p>
                  )}

                  {!isCategoriesLoading && categories.length === 0 && (
                    <p className='text-sm text-gray-500'>
                      No blog categories available. Please create some
                      categories first.
                    </p>
                  )}
                </div>

                {/* Replace file input with our new ImageUpload component */}
                <ImageUpload
                  currentImageUrl={image}
                  onImageUploaded={handleImageUploaded}
                  label='Featured Image'
                />

                <div className='space-y-2'>
                  <Label htmlFor='content'>Content</Label>
                  <Textarea
                    id='content'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder='Write your blog post content here...'
                    rows={12}
                    required
                  />
                </div>

                <div className='flex justify-end'>
                  <Button
                    type='submit'
                    className='bg-gray-500 hover:bg-orange-500'
                    disabled={isLoading || categories.length === 0}
                  >
                    {isLoading ? (
                      <span className='flex items-center gap-2'>
                        <Loader2 className='h-4 w-4 animate-spin' />
                        {isEditMode ? "Updating..." : "Saving..."}
                      </span>
                    ) : (
                      <>
                        <Save className='h-4 w-4 mr-2' />
                        {isEditMode ? "Update Blog Post" : "Save Blog Post"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* Writing Guidelines */}
            <div className='border-t pt-4 mt-6'>
              <h4 className='font-semibold text-gray-800 mb-3'>
                Writing Guidelines:
              </h4>
              <ul className='space-y-2 text-xs text-gray-600'>
                <li>
                  • <strong>Title:</strong> Make it engaging and specific
                  (include pet names when possible)
                </li>

                <li>
                  • <strong>Content:</strong> Use subheadings, tell a complete
                  story, include emotional moments
                </li>
                <li>
                  • <strong>Length:</strong> Aim for 300-800 words depending on
                  the story
                </li>
                <li>
                  • <strong>Images:</strong> Include high-quality photos of the
                  pets mentioned
                </li>
                <li>
                  • <strong>Call to Action:</strong> End with how readers can
                  help or get involved
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AddBlogForm;
