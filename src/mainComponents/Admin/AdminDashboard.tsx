import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  PawPrint,
  LogOut,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Home,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  logout,
  selectAuth,
  selectIsAdmin,
} from "../../redux-store/slices/authSlice";
import {
  useGetBlogPostsQuery,
  useDeleteBlogPostMutation,
} from "../../redux-store/services/blogApi";

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);
  const { data: blogPosts, isLoading, error } = useGetBlogPostsQuery();

  // Delete mutation hook
  const [deleteBlogPost, { isLoading: isDeleting }] =
    useDeleteBlogPostMutation();

  // State to track which post is being deleted
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  // State for handling delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  // State for delete error message
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // If not authenticated or not an admin, redirect to login
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/admin/login' />;
  }

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleDeleteClick = (postId: string) => {
    setShowDeleteConfirm(postId);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async (postId: string) => {
    try {
      setDeletingPostId(postId);
      await deleteBlogPost(postId).unwrap();
      setShowDeleteConfirm(null);
    } catch (err: any) {
      console.error("Failed to delete post:", err);
      setDeleteError(
        err.data?.message || "Failed to delete post. Please try again."
      );
    } finally {
      setDeletingPostId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
    setDeleteError(null);
  };

  const handleEditPost = (postId: string) => {
    navigate(`/admin/blog/edit/${postId}`);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Admin Header */}
      <header className='bg-white border-b shadow-sm'>
        <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <PawPrint className='h-8 w-8 text-orange-500' />
            <h1 className='text-xl font-bold'>Admin Dashboard</h1>
          </div>

          <div className='flex items-center gap-4'>
            <div className='text-sm text-gray-600'>
              Logged in as <span className='font-medium'>{user?.name}</span>
            </div>
            <Link to='/'>
              <Button
                variant='outline'
                size='sm'
                className='text-orange-500 border-orange-500 hover:bg-orange-50'
              >
                <Home className='h-4 w-4 mr-2' />
                View Website
              </Button>
            </Link>
            <Button
              variant='ghost'
              size='sm'
              className='text-gray-600'
              onClick={handleLogout}
            >
              <LogOut className='h-4 w-4 mr-2' />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='container mx-auto px-4 py-8'>
        <div className='mb-8 flex items-center justify-between'>
          <h2 className='text-2xl font-bold'>Blog Posts</h2>
          <Link to='/admin/blog/new'>
            <Button className='bg-orange-500 hover:bg-orange-600'>
              <Plus className='h-4 w-4 mr-2' />
              Add New Blog Post
            </Button>
          </Link>
        </div>

        {/* Delete Error Alert */}
        {deleteError && (
          <div className='mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-600 flex items-center gap-2'>
            <AlertCircle className='h-5 w-5' />
            <span>{deleteError}</span>
          </div>
        )}

        {/* Blog Posts Table */}
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          {isLoading ? (
            <div className='p-6 text-center text-gray-500 flex justify-center items-center'>
              <Loader2 className='h-5 w-5 animate-spin mr-2' />
              Loading posts...
            </div>
          ) : error ? (
            <div className='p-6 text-center text-red-500 flex justify-center items-center'>
              <AlertCircle className='h-5 w-5 mr-2' />
              Error loading blog posts
            </div>
          ) : blogPosts && blogPosts.length > 0 ? (
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Title
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Category
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Author
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {blogPosts.map((post) => (
                  <tr key={post._id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        {post.title}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800'>
                        {post.category}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {post.author}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      {showDeleteConfirm === post._id ? (
                        <div className='flex justify-end gap-2'>
                          <span className='text-sm text-gray-600 mr-2 self-center'>
                            Confirm delete?
                          </span>
                          <Button
                            variant='outline'
                            size='sm'
                            className='text-red-600 border-red-600 hover:bg-red-50'
                            onClick={() => handleDeleteConfirm(post._id)}
                            disabled={isDeleting && deletingPostId === post._id}
                          >
                            {isDeleting && deletingPostId === post._id ? (
                              <Loader2 className='h-4 w-4 animate-spin mr-1' />
                            ) : null}
                            Yes
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            className='text-gray-600 border-gray-300'
                            onClick={handleDeleteCancel}
                            disabled={isDeleting && deletingPostId === post._id}
                          >
                            No
                          </Button>
                        </div>
                      ) : (
                        <div className='flex justify-end gap-2'>
                          <Link to={`/blog/${post._id}`}>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='text-blue-600 hover:text-blue-800'
                            >
                              <BookOpen className='h-4 w-4' />
                              <span className='sr-only'>View</span>
                            </Button>
                          </Link>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-amber-600 hover:text-amber-800'
                            onClick={() => handleEditPost(post._id)}
                          >
                            <Edit className='h-4 w-4' />
                            <span className='sr-only'>Edit</span>
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-red-600 hover:text-red-800'
                            onClick={() => handleDeleteClick(post._id)}
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
              No blog posts found
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
