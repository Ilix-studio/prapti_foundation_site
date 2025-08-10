import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { selectAuth, selectIsAdmin } from "@/redux-store/slices/authSlice";
import {
  useDeleteBlogPostMutation,
  useGetBlogPostsQuery,
} from "@/redux-store/services/blogApi";

const AllBlogs: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);

  // Blog Posts State
  const {
    data: blogPosts,
    isLoading: blogsLoading,
    error: blogsError,
  } = useGetBlogPostsQuery();
  const [deleteBlogPost, { isLoading: isDeletingBlog }] =
    useDeleteBlogPostMutation();

  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null);
  const [showBlogDeleteConfirm, setShowBlogDeleteConfirm] = useState<
    string | null
  >(null);
  const [blogDeleteError, setBlogDeleteError] = useState<string | null>(null);

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/admin/login' />;
  }

  // Blog Post Handlers
  const handleBlogDeleteClick = (postId: string) => {
    setShowBlogDeleteConfirm(postId);
    setBlogDeleteError(null);
  };

  const handleBlogDeleteConfirm = async (postId: string) => {
    try {
      setDeletingBlogId(postId);
      await deleteBlogPost(postId).unwrap();
      setShowBlogDeleteConfirm(null);
    } catch (err: any) {
      console.error("Failed to delete post:", err);
      setBlogDeleteError(
        err.data?.message || "Failed to delete post. Please try again."
      );
    } finally {
      setDeletingBlogId(null);
    }
  };

  const handleBlogDeleteCancel = () => {
    setShowBlogDeleteConfirm(null);
    setBlogDeleteError(null);
  };

  const handleEditPost = (postId: string) => {
    navigate(`/admin/blog/edit/${postId}`);
  };

  return (
    <div className='space-y-8'>
      {/* Header with Add New Button */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h2 className='text-3xl font-bold text-gray-900'>Blog Posts</h2>
          <p className='mt-1 text-sm text-gray-600'>
            Manage and organize your blog content
          </p>
        </div>
        <Link to='/admin/blog/new'>
          <Button className='bg-orange-500 hover:bg-orange-600 shadow-sm'>
            <Plus className='h-4 w-4 mr-2' />
            Add New Blog Post
          </Button>
        </Link>
      </div>

      {/* Blog Delete Error Alert */}
      {blogDeleteError && (
        <div className='p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 flex items-start gap-3'>
          <AlertCircle className='h-5 w-5 mt-0.5 flex-shrink-0' />
          <div>
            <p className='font-medium'>Error deleting blog post</p>
            <p className='text-sm text-red-600/80'>{blogDeleteError}</p>
          </div>
        </div>
      )}

      {/* Blog Posts Table */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
        {blogsLoading ? (
          <div className='p-12 text-center text-gray-500 flex flex-col items-center gap-3'>
            <Loader2 className='h-8 w-8 animate-spin text-orange-500' />
            <p className='text-lg font-medium'>Loading posts...</p>
            <p className='text-sm text-gray-400'>
              Please wait while we fetch your blog posts
            </p>
          </div>
        ) : blogsError ? (
          <div className='p-12 text-center text-red-500 flex flex-col items-center gap-3'>
            <AlertCircle className='h-8 w-8' />
            <p className='text-lg font-medium'>Error loading blog posts</p>
            <p className='text-sm text-red-400'>
              Please try refreshing the page
            </p>
          </div>
        ) : blogPosts && blogPosts.length > 0 ? (
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Title
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Category
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Author
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Created
                </th>
                <th className='px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {blogPosts.map((post) => (
                <tr
                  key={post._id}
                  className='hover:bg-gray-50 transition-colors duration-150'
                >
                  <td className='px-6 py-5'>
                    <div className='text-sm font-semibold text-gray-900 max-w-xs truncate'>
                      {post.title}
                    </div>
                    <div className='text-xs text-gray-500 mt-1 max-w-xs truncate'>
                      {post.excerpt}
                    </div>
                  </td>
                  <td className='px-6 py-5'>
                    <span className='px-3 py-1 inline-flex text-xs font-medium rounded-full bg-orange-100 text-orange-800'>
                      {post.category}
                    </span>
                  </td>
                  <td className='px-6 py-5 text-sm text-gray-600 font-medium'>
                    {post.author}
                  </td>
                  <td className='px-6 py-5 text-sm text-gray-500'>
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className='px-6 py-5 text-right'>
                    {showBlogDeleteConfirm === post._id ? (
                      <div className='flex justify-end items-center gap-3'>
                        <span className='text-sm text-gray-700 font-medium'>
                          Confirm delete?
                        </span>
                        <div className='flex gap-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            className='text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400'
                            onClick={() => handleBlogDeleteConfirm(post._id)}
                            disabled={
                              isDeletingBlog && deletingBlogId === post._id
                            }
                          >
                            {isDeletingBlog && deletingBlogId === post._id ? (
                              <Loader2 className='h-3 w-3 animate-spin mr-1' />
                            ) : null}
                            Yes
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            className='text-gray-600 border-gray-300 hover:bg-gray-50'
                            onClick={handleBlogDeleteCancel}
                            disabled={
                              isDeletingBlog && deletingBlogId === post._id
                            }
                          >
                            No
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className='flex justify-end gap-2'>
                        <Link to={`/blog/${post._id}`}>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                            title='View Post'
                          >
                            <BookOpen className='h-4 w-4' />
                            <span className='sr-only'>View</span>
                          </Button>
                        </Link>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='text-amber-600 hover:text-amber-800 hover:bg-amber-50'
                          onClick={() => handleEditPost(post._id)}
                          title='Edit Post'
                        >
                          <Edit className='h-4 w-4' />
                          <span className='sr-only'>Edit</span>
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='text-red-600 hover:text-red-800 hover:bg-red-50'
                          onClick={() => handleBlogDeleteClick(post._id)}
                          title='Delete Post'
                        >
                          <Trash2 className='h-4 w-4' />
                          <span className='sr-only'>Delete</span>
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className='p-6 text-center text-gray-500'>
            <div className='flex flex-col items-center'>
              <BookOpen className='h-12 w-12 text-gray-300 mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                No blog posts found
              </h3>
              <p className='text-gray-500 mb-4'>
                Get started by creating your first blog post.
              </p>
              <Link to='/admin/blog/new'>
                <Button className='bg-orange-500 hover:bg-orange-600'>
                  <Plus className='h-4 w-4 mr-2' />
                  Create First Post
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      {blogPosts && blogPosts.length > 0 && (
        <div className='bg-white p-4 rounded-lg shadow'>
          <div className='text-sm text-gray-600'>
            Total blog posts:{" "}
            <span className='font-medium'>{blogPosts.length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBlogs;
