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
import { getBlogCategoryName } from "@/types/blogs.types";
import { BackNavigation } from "@/config/navigation/BackNavigation";

const BlogsDash: React.FC = () => {
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
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
      {/* Back Navigation */}
      <BackNavigation />

      {/* Main Content Container */}
      <div className='container mx-auto px-6 py-8 max-w-7xl'>
        {/* Header Section with improved spacing */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10'>
          <div className='space-y-2'>
            <h2 className='text-4xl font-bold bg-orange-500 bg-clip-text text-transparent'>
              Blog Posts
            </h2>
            <p className='text-lg text-gray-600 max-w-md'>
              Manage and organize your blog content with ease
            </p>
          </div>

          <div className='flex items-center gap-4'>
            <Link to='/admin/blog/new'>
              <Button className='bg-orange-400 hover:from-[#FF9933]/90 hover:to-[#138808]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 text-base'>
                <Plus className='h-5 w-5 mr-2' />
                Add New Post
              </Button>
            </Link>
          </div>
        </div>

        {/* Blog Delete Error Alert */}
        {blogDeleteError && (
          <div className='p-5 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-4 mb-8'>
            <AlertCircle className='h-6 w-6 mt-0.5 flex-shrink-0' />
            <div>
              <p className='font-semibold text-base'>
                Error deleting blog post
              </p>
              <p className='text-red-600/80 mt-1'>{blogDeleteError}</p>
            </div>
          </div>
        )}

        {/* Blog Posts Content Card */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden'>
          {blogsLoading ? (
            <div className='p-16 text-center text-gray-500'>
              <div className='flex flex-col items-center gap-6'>
                <div className='relative'>
                  <Loader2 className='h-10 w-10 animate-spin text-[#FF9933]' />
                  <div className='absolute inset-0 bg-[#FF9933] rounded-full opacity-20 animate-ping'></div>
                </div>
                <div className='space-y-2'>
                  <p className='text-xl font-semibold text-gray-700'>
                    Loading posts...
                  </p>
                  <p className='text-gray-500'>
                    Please wait while we fetch your blog posts
                  </p>
                </div>
              </div>
            </div>
          ) : blogsError ? (
            <div className='p-16 text-center'>
              <div className='flex flex-col items-center gap-6'>
                <div className='bg-red-100 p-4 rounded-full'>
                  <AlertCircle className='h-10 w-10 text-red-600' />
                </div>
                <div className='space-y-2'>
                  <p className='text-xl font-semibold text-red-700'>
                    Error loading blog posts
                  </p>
                  <p className='text-red-500'>Please try refreshing the page</p>
                </div>
              </div>
            </div>
          ) : blogPosts && blogPosts.length > 0 ? (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200'>
                  <tr>
                    <th className='px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                      Title
                    </th>
                    <th className='px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                      Category
                    </th>

                    <th className='px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                      Created
                    </th>
                    <th className='px-8 py-5 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                  {blogPosts.map((post) => (
                    <tr
                      key={post._id}
                      className='hover:bg-gradient-to-r hover:from-[#FF9933]/5 hover:to-[#138808]/5 transition-all duration-200'
                    >
                      <td className='px-8 py-6'>
                        <div className='max-w-sm'>
                          <div className='text-base font-semibold text-gray-900 truncate'>
                            {post.title}
                          </div>
                          <div className='text-sm text-gray-600 mt-1 line-clamp-2'>
                            {post.excerpt}
                          </div>
                        </div>
                      </td>
                      <td className='px-8 py-6'>
                        <span className='px-4 py-2 inline-flex text-sm font-medium rounded-full bg-white-500 text-orange-500 border border-[#FF9933]/30'>
                          {getBlogCategoryName(post.category)}
                        </span>
                      </td>

                      <td className='px-8 py-6 text-base text-gray-600'>
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className='px-8 py-6 text-right'>
                        {showBlogDeleteConfirm === post._id ? (
                          <div className='flex justify-end items-center gap-4'>
                            <span className='text-base text-gray-700 font-medium'>
                              Confirm delete?
                            </span>
                            <div className='flex gap-3'>
                              <Button
                                variant='outline'
                                size='sm'
                                className='text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 px-4 py-2'
                                onClick={() =>
                                  handleBlogDeleteConfirm(post._id)
                                }
                                disabled={
                                  isDeletingBlog && deletingBlogId === post._id
                                }
                              >
                                {isDeletingBlog &&
                                deletingBlogId === post._id ? (
                                  <Loader2 className='h-4 w-4 animate-spin mr-2' />
                                ) : null}
                                Yes
                              </Button>
                              <Button
                                variant='outline'
                                size='sm'
                                className='text-gray-600 border-gray-300 hover:bg-gray-50 px-4 py-2'
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
                          <div className='flex justify-end gap-3'>
                            <Link to={`/blog/${post._id}`}>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-3 rounded-xl transition-all duration-200'
                                title='View Post'
                              >
                                <BookOpen className='h-5 w-5' />
                                <span className='sr-only'>View</span>
                              </Button>
                            </Link>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-3 rounded-xl transition-all duration-200'
                              onClick={() => handleEditPost(post._id)}
                              title='Edit Post'
                            >
                              <Edit className='h-5 w-5' />
                              <span className='sr-only'>Edit</span>
                            </Button>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='text-red-600 hover:text-red-700 hover:bg-red-50 p-3 rounded-xl transition-all duration-200'
                              onClick={() => handleBlogDeleteClick(post._id)}
                              title='Delete Post'
                            >
                              <Trash2 className='h-5 w-5' />
                              <span className='sr-only'>Delete</span>
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='p-16 text-center'>
              <div className='flex flex-col items-center space-y-6'>
                <div className='bg-gradient-to-br from-[#FF9933]/20 to-[#138808]/20 p-6 rounded-full'>
                  <BookOpen className='h-16 w-16 text-[#FF9933]' />
                </div>
                <div className='space-y-3'>
                  <h3 className='text-2xl font-semibold text-gray-900'>
                    No blog posts found
                  </h3>
                  <p className='text-gray-600 max-w-md'>
                    Get started by creating your first blog post and share your
                    thoughts with the world.
                  </p>
                </div>
                <Link to='/admin/blog/new'>
                  <Button className='bg-gradient-to-r from-[#FF9933] to-[#138808] hover:from-[#FF9933]/90 hover:to-[#138808]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3'>
                    <Plus className='h-5 w-5 mr-2' />
                    Create First Post
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Statistics Card */}
        {blogPosts && blogPosts.length > 0 && (
          <div className='mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200/60'>
            <div className='flex items-center gap-4'>
              <div className='bg-white-500 border-2 p-3 rounded-full'>
                <BookOpen className='h-6 w-6 text-[#FF9933]' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Total blog posts</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {blogPosts.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsDash;
