// src/mainComponents/BlogPosts/EditBlogPost.tsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Navigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PawPrint, Save, ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { selectIsAdmin } from "@/redux-store/slices/authSlice";
import {
  useGetBlogPostByIdQuery,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
} from "@/redux-store/services/blogApi";
import { useGetCategoriesByTypeQuery } from "@/redux-store/services/categoryApi";
import { useDeleteImageMutation } from "@/redux-store/services/cloudinaryApi";
import cloudinaryService from "@/redux-store/slices/cloudinaryService";
import { getBlogCategoryId } from "@/types/blogs.types";
import ImageUpload from "./ImageUpload";

const EditBlogPost: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isAdmin = useSelector(selectIsAdmin);

  // RTK Query hooks
  const [updateBlogPost, { isLoading: isUpdating }] =
    useUpdateBlogPostMutation();
  const [deleteBlogPost, { isLoading: isDeleting }] =
    useDeleteBlogPostMutation();
  const [deleteImage] = useDeleteImageMutation();

  const {
    data: existingPost,
    isLoading: isFetching,
    error: fetchError,
  } = useGetBlogPostByIdQuery(id!, { skip: !id });

  // Fetch blog categories
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useGetCategoriesByTypeQuery("blogs");

  // Form state
  const [title, setTitle] = useState("");

  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [previousImage, setPreviousImage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to='/admin/login' />;
  }

  // Redirect if blog post not found
  if (!isFetching && !existingPost && !fetchError) {
    return <Navigate to='/admin/blogsDashboard' />;
  }

  // Populate form with existing data
  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title);
      setContent(existingPost.content);
      setCategory(getBlogCategoryId(existingPost.category));
      setImage(existingPost.image);
      setPreviousImage(existingPost.image);
    }
  }, [existingPost]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!id) {
      setError("Blog post ID is required");
      return;
    }

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

      // Delete old image if it changed
      if (previousImage && image !== previousImage) {
        try {
          const publicId = cloudinaryService.extractPublicId(previousImage);
          if (publicId) {
            await deleteImage(publicId).unwrap();
            console.log("Previous image deleted successfully");
          }
        } catch (deleteError) {
          console.error("Failed to delete previous image:", deleteError);
          // Don't block the update if image deletion fails
        }
      }

      await updateBlogPost({ id, data: blogData }).unwrap();
      navigate("/admin/blogsDashboard");
    } catch (err: any) {
      setError(
        err.data?.message || "Failed to update blog post. Please try again."
      );
      console.error("Error updating blog post:", err);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      setError(null);

      // Delete associated image if it exists
      if (image) {
        try {
          const publicId = cloudinaryService.extractPublicId(image);
          if (publicId) {
            await deleteImage(publicId).unwrap();
            console.log("Blog image deleted successfully");
          }
        } catch (deleteError) {
          console.error("Failed to delete blog image:", deleteError);
          // Continue with blog deletion even if image deletion fails
        }
      }

      await deleteBlogPost(id).unwrap();
      navigate("/admin/blogsDashboard");
    } catch (err: any) {
      setError(
        err.data?.message || "Failed to delete blog post. Please try again."
      );
      console.error("Error deleting blog post:", err);
      setShowDeleteConfirm(false);
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    setImage(imageUrl);
  };

  const isLoading = isUpdating || isFetching || isDeleting;

  if (fetchError) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center p-10 bg-red-50 rounded-lg text-red-500 max-w-md'>
          <h2 className='text-xl font-semibold mb-2'>
            Error Loading Blog Post
          </h2>
          <p className='mb-4'>The blog post could not be found or loaded.</p>
          <Button
            onClick={() => navigate("/admin/blogsDashboard")}
            variant='outline'
          >
            Back to Blogs Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Admin Header */}
      <header className='bg-white border-b shadow-sm'>
        <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <PawPrint className='h-8 w-8 text-orange-500' />
            <h1 className='text-xl font-bold'>Edit Blog Post</h1>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              onClick={() => setShowDeleteConfirm(true)}
              className='text-red-600 hover:text-red-700 hover:bg-red-50'
              disabled={isLoading}
            >
              <Trash2 className='h-4 w-4 mr-2' />
              Delete Post
            </Button>

            <Button
              variant='ghost'
              onClick={() => navigate("/admin/blogsDashboard")}
              className='text-gray-600'
              disabled={isLoading}
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Blogs
            </Button>
          </div>
        </div>
      </header>

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
                  disabled={isLoading}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='category'>Category</Label>
                <Select
                  value={category}
                  onValueChange={setCategory}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                  <SelectContent>
                    {isCategoriesLoading ? (
                      <SelectItem value='' disabled>
                        Loading categories...
                      </SelectItem>
                    ) : categories.length === 0 ? (
                      <SelectItem value='' disabled>
                        No blog categories found
                      </SelectItem>
                    ) : (
                      categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {!isCategoriesLoading && categories.length === 0 && (
                  <p className='text-sm text-gray-500'>
                    No blog categories available. Please create some categories
                    first.
                  </p>
                )}
              </div>

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
                  disabled={isLoading}
                />
              </div>

              <div className='flex justify-end'>
                <Button
                  type='submit'
                  className='bg-orange-500 hover:bg-orange-600'
                  disabled={isLoading || categories.length === 0}
                >
                  {isUpdating ? (
                    <span className='flex items-center gap-2'>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      Updating...
                    </span>
                  ) : (
                    <>
                      <Save className='h-4 w-4 mr-2' />
                      Update Blog Post
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
                • <strong>Title:</strong> Make it engaging and specific (include
                pet names when possible)
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
                • <strong>Call to Action:</strong> End with how readers can help
                or get involved
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
            <h3 className='text-lg font-semibold mb-4 text-gray-900'>
              Delete Blog Post
            </h3>
            <p className='text-gray-600 mb-6'>
              Are you sure you want to delete this blog post? This action cannot
              be undone.
            </p>
            <div className='flex justify-end gap-3'>
              <Button
                variant='outline'
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant='destructive'
                onClick={handleDelete}
                disabled={isDeleting}
                className='bg-red-600 hover:bg-red-700'
              >
                {isDeleting ? (
                  <span className='flex items-center gap-2'>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    Deleting...
                  </span>
                ) : (
                  <>
                    <Trash2 className='h-4 w-4 mr-2' />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditBlogPost;
