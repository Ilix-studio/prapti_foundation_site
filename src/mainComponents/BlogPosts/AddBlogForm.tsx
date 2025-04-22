// ../../
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";

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
import { PawPrint, Save, ArrowLeft } from "lucide-react";
import { selectIsAdmin } from "../../redux-store/slices/authSlice";
import { useCreateBlogPostMutation } from "../../redux-store/services/blogApi";

const AddBlogPost: React.FC = () => {
  const navigate = useNavigate();
  const isAdmin = useSelector(selectIsAdmin);
  const [createBlogPost, { isLoading }] = useCreateBlogPostMutation();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("/placeholder.svg?height=450&width=800");
  const [error, setError] = useState<string | null>(null);

  // If not an admin, redirect to login
  if (!isAdmin) {
    return <Navigate to='/admin/login' />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!title || !excerpt || !content || !category) {
        setError("All fields are required");
        return;
      }

      // Call the RTK Query mutation to create a new blog post
      await createBlogPost({
        title,
        excerpt,
        content,
        category,
        image,
      }).unwrap();

      // Navigate back to the admin dashboard after successful creation
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Failed to create blog post. Please try again.");
      console.error("Error creating blog post:", err);
    }
  };

  const categories = [
    "Adoption Stories",
    "Dog Care",
    "Training Tips",
    "Shelter News",
    "Health & Wellness",
    "Rescue Stories",
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Admin Header */}
      <header className='bg-white border-b shadow-sm'>
        <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <PawPrint className='h-8 w-8 text-orange-500' />
            <h1 className='text-xl font-bold'>Add New Blog Post</h1>
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

            <div className='space-y-2'>
              <Label htmlFor='image'>Image URL</Label>
              <Input
                id='image'
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder='Enter image URL'
                required
              />
              <p className='text-xs text-gray-500'>
                For this demo, you can use placeholder images like:
                /placeholder.svg?height=450&width=800&text=Your+Text
              </p>
            </div>

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
                  "Saving..."
                ) : (
                  <>
                    <Save className='h-4 w-4 mr-2' />
                    Save Blog Post
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddBlogPost;
