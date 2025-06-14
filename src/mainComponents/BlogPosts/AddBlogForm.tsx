// src/mainComponents/BlogPosts/AddBlogForm.tsx
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
import { PawPrint, Save, ArrowLeft, Loader2 } from "lucide-react";
import { selectIsAdmin } from "@/redux-store/slices/authSlice";
import {
  useCreateBlogPostMutation,
  useGetBlogPostByIdQuery,
  useUpdateBlogPostMutation,
} from "@/redux-store/services/blogApi";

import { useDeleteImageMutation } from "@/redux-store/services/cloudinaryApi";
import cloudinaryService from "@/redux-store/slices/cloudinaryService";
import ImageUpload from "./ImageUpload";

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
  const { data: existingPost, isLoading: isFetching } = useGetBlogPostByIdQuery(
    id!,
    {
      skip: !isEditMode,
    }
  );

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [previousImage, setPreviousImage] = useState("");
  const [error, setError] = useState<string | null>(null);

  // If not an admin, redirect to login
  if (!isAdmin) {
    return <Navigate to='/admin/login' />;
  }

  // Populate form with existing data when in edit mode
  useEffect(() => {
    if (isEditMode && existingPost) {
      setTitle(existingPost.title);
      setExcerpt(existingPost.excerpt);
      setContent(existingPost.content);
      setCategory(existingPost.category);
      setImage(existingPost.image);
      setPreviousImage(existingPost.image);
    }
  }, [isEditMode, existingPost]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!title || !excerpt || !content || !category) {
        setError("All fields are required");
        return;
      }

      const blogData = {
        title,
        excerpt,
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

      // Navigate back to the admin dashboard after successful operation
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(
        err.data?.message || "Failed to save blog post. Please try again."
      );
      console.error("Error saving blog post:", err);
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    setImage(imageUrl);
  };

  const categories = [
    "Adoption Stories",
    "Dog Care",
    "Training Tips",
    "Shelter News",
    "Health & Wellness",
    "Rescue Stories",
  ];

  const isLoading = isCreating || isUpdating || isFetching;

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Admin Header */}
      <header className='bg-white border-b shadow-sm'>
        <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <PawPrint className='h-8 w-8 text-orange-500' />
            <h1 className='text-xl font-bold'>
              {isEditMode ? "Edit Blog Post" : "Add New Blog Post"}
            </h1>
          </div>

          <Button
            variant='ghost'
            onClick={() => navigate("/admin/dashboard")}
            className='text-gray-600'
          >
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Dashboard
          </Button>
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
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='category'>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='excerpt'>Excerpt</Label>
                <Textarea
                  id='excerpt'
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder='Enter a brief summary of the blog post'
                  rows={3}
                  required
                />
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
                  className='bg-orange-500 hover:bg-orange-600'
                  disabled={isLoading}
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
                • <strong>Title:</strong> Make it engaging and specific (include
                pet names when possible)
              </li>
              <li>
                • <strong>Excerpt:</strong> Summarize the main story in 1-2
                sentences
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
    </div>
  );
};

export default AddBlogForm;
