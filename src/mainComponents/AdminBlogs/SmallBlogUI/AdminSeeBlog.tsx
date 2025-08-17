// /admin/blog/:id

// src/mainComponents/Admin/AdminBlogs/AdminSeeBlog.tsx
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, Navigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Tag, Loader2, Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { selectIsAdmin } from "@/redux-store/slices/authSlice";
import {
  useGetBlogPostByIdQuery,
  useDeleteBlogPostMutation,
} from "@/redux-store/services/blogApi";
import { getBlogCategoryName } from "@/types/blogs.types";
import { BackNavigation } from "@/config/navigation/BackNavigation";

const AdminSeeBlog: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isAdmin = useSelector(selectIsAdmin);

  // RTK Query hooks
  const {
    data: blogPost,
    isLoading,
    error,
  } = useGetBlogPostByIdQuery(id!, { skip: !id });

  const [deleteBlogPost, { isLoading: isDeleting }] =
    useDeleteBlogPostMutation();

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to='/admin/login' />;
  }

  // Handle delete
  const handleDelete = async () => {
    if (!id || !confirm("Are you sure you want to delete this blog post?"))
      return;

    try {
      await deleteBlogPost(id).unwrap();
      navigate("/admin/blogsDashboard");
    } catch (error) {
      console.error("Failed to delete blog post:", error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <Loader2 className='w-8 h-8 animate-spin text-[#FF9933]' />
          <p className='text-sm text-gray-600'>Loading blog post...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !blogPost) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>
            Blog Post Not Found
          </h2>
          <p className='text-gray-600 mb-6'>
            The blog post you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => navigate("/admin/blogsDashboard")}
            className='bg-[#FF9933] hover:bg-[#FF9933]/90'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to Blogs Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <BackNavigation />

      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50'>
        <div className='bg-white'>
          <div className='max-w-4xl mx-auto px-6 py-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-2'>
                  <h1 className='text-xl font-bold text-gray-800'>
                    View Blog Post
                  </h1>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <Link to={`/admin/blog/edit/${id}`}>
                  <Button
                    variant='outline'
                    className='border-gray-500 text-gray hover:bg-[#FF9933] hover:text-white'
                  >
                    <Edit className='w-4 h-4 mr-2' />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant='destructive'
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className='bg-red-600 hover:bg-red-700'
                >
                  {isDeleting ? (
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  ) : (
                    <Trash2 className='w-4 h-4 mr-2' />
                  )}
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='max-w-4xl mx-auto px-6 py-8'>
          <article className='bg-white rounded-xl shadow-lg overflow-hidden'>
            {/* Blog Image */}
            {blogPost.image && (
              <div className='aspect-video w-full overflow-hidden'>
                <img
                  src={blogPost.image}
                  alt={blogPost.title}
                  className='w-full h-full object-cover'
                />
              </div>
            )}

            {/* Blog Content */}
            <div className='p-8'>
              {/* Blog Header */}
              <div className='mb-6'>
                <h1 className='text-3xl font-bold text-gray-900 mb-4 leading-tight'>
                  {blogPost.title}
                </h1>

                {/* Metadata */}
                <div className='flex flex-wrap items-center gap-4 text-sm text-gray-600'>
                  <div className='flex items-center gap-2'>
                    <Calendar className='w-4 h-4' />
                    <span>
                      {new Date(blogPost.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>

                  <div className='flex items-center gap-2'>
                    <Tag className='w-4 h-4' />
                    <Badge
                      variant='secondary'
                      className='bg-[#FF9933]/10 text-[#FF9933]'
                    >
                      {getBlogCategoryName(blogPost.category)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Blog Content */}
              <div className='prose prose-lg max-w-none'>
                <div
                  className='text-gray-700 leading-relaxed whitespace-pre-wrap'
                  dangerouslySetInnerHTML={{ __html: blogPost.content }}
                />
              </div>
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

export default AdminSeeBlog;
