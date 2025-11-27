import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
    return (
      <div className='container mx-auto p-6'>
        <BackNavigation />
        <Alert className='max-w-md mx-auto mt-8'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>Admin access required.</AlertDescription>
        </Alert>
      </div>
    );
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

  if (blogsError) {
    return (
      <div className='container mx-auto p-6'>
        <BackNavigation />
        <div className='flex items-center justify-center h-64'>
          <div className='text-center'>
            <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              Error Loading Blog Posts
            </h3>
            <p className='text-gray-600 mb-4'>
              Failed to load blog posts. Please try again.
            </p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <BackNavigation />
      <div className='container mx-auto p-6 space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
              Blog Posts
            </h1>
            <p className='text-gray-600'>
              Manage and organize your blog content with ease
            </p>
          </div>
          <Link to='/admin/blog/new'>
            <Button className='bg-gray-500 hover:bg-orange-500 text-white'>
              <Plus className='h-5 w-5 mr-2' />
              Add New Post
            </Button>
          </Link>
        </div>

        {/* Error Alert */}
        {blogDeleteError && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>{blogDeleteError}</AlertDescription>
          </Alert>
        )}

        {/* Statistics Card */}
        {blogPosts && blogPosts.length > 0 && (
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center gap-4'>
                <div className='bg-orange-100 p-3 rounded-full'>
                  <BookOpen className='h-6 w-6 text-orange-500' />
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Total blog posts</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {blogPosts.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Blog Posts Table */}
        <Card>
          <CardContent className='p-0'>
            {blogsLoading ? (
              <div className='flex items-center justify-center h-64'>
                <Loader2 className='w-8 h-8 animate-spin' />
              </div>
            ) : blogPosts && blogPosts.length > 0 ? (
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-gray-50 border-b border-gray-200'>
                    <tr>
                      <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                        Title
                      </th>
                      <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                        Category
                      </th>
                      <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                        Created
                      </th>
                      <th className='px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-100'>
                    {blogPosts.map((post) => (
                      <tr
                        key={post._id}
                        className='hover:bg-gray-50 transition-all duration-200'
                      >
                        <td className='px-6 py-4'>
                          <div className='max-w-sm'>
                            <div className='text-base font-semibold text-gray-900 truncate'>
                              {post.title}
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <span className='px-3 py-1 inline-flex text-sm font-medium rounded-full bg-orange-100 text-orange-600 border border-orange-200'>
                            {getBlogCategoryName(post.category)}
                          </span>
                        </td>
                        <td className='px-6 py-4 text-base text-gray-600'>
                          {new Date(post.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </td>
                        <td className='px-6 py-4 text-right'>
                          {showBlogDeleteConfirm === post._id ? (
                            <div className='flex justify-end items-center gap-4'>
                              <span className='text-base text-gray-700 font-medium'>
                                Confirm delete?
                              </span>
                              <div className='flex gap-2'>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  className='text-red-600 border-red-300 hover:bg-red-50'
                                  onClick={() =>
                                    handleBlogDeleteConfirm(post._id)
                                  }
                                  disabled={
                                    isDeletingBlog &&
                                    deletingBlogId === post._id
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
                                  onClick={handleBlogDeleteCancel}
                                  disabled={
                                    isDeletingBlog &&
                                    deletingBlogId === post._id
                                  }
                                >
                                  No
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className='flex justify-end gap-2'>
                              <Link to={`/admin/blog/${post._id}`}>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  className='text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                                  title='View Post'
                                >
                                  <BookOpen className='h-4 w-4' />
                                </Button>
                              </Link>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='text-amber-600 hover:text-amber-700 hover:bg-amber-50'
                                onClick={() => handleEditPost(post._id)}
                                title='Edit Post'
                              >
                                <Edit className='h-4 w-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='text-red-600 hover:text-red-700 hover:bg-red-50'
                                onClick={() => handleBlogDeleteClick(post._id)}
                                title='Delete Post'
                              >
                                <Trash2 className='h-4 w-4' />
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
              <div className='p-12 text-center'>
                <BookOpen className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  No blog posts found
                </h3>
                <p className='text-gray-600 mb-4'>
                  Get started by creating your first blog post and share your
                  thoughts with the world.
                </p>
                <Link to='/admin/blog/new'>
                  <Button className='bg-orange-400 hover:bg-orange-500 text-white'>
                    <Plus className='h-5 w-5 mr-2' />
                    Create First Post
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default BlogsDash;
