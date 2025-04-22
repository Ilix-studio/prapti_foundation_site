import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Navigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { PawPrint, LogOut, Plus, Edit, Trash2, BookOpen } from "lucide-react";
import {
  logout,
  selectAuth,
  selectIsAdmin,
} from "../../redux-store/slices/authSlice";
import { useGetBlogPostsQuery } from "../../redux-store/services/blogApi";

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);
  const { data: blogPosts, isLoading, error } = useGetBlogPostsQuery();

  // If not authenticated or not an admin, redirect to login
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/admin/login' />;
  }

  const handleLogout = () => {
    dispatch(logout());
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

        {/* Blog Posts Table */}
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          {isLoading ? (
            <div className='p-6 text-center text-gray-500'>
              Loading posts...
            </div>
          ) : error ? (
            <div className='p-6 text-center text-red-500'>
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
                    Date
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
                  <tr key={post.id} className='hover:bg-gray-50'>
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
                      {post.date}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {post.author}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <div className='flex justify-end gap-2'>
                        <Link to={`/blog/${post.id}`}>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-blue-600 hover:text-blue-800'
                          >
                            <BookOpen className='h-4 w-4' />
                            <span className='sr-only'>View</span>
                          </Button>
                        </Link>
                        <Link to={`/admin/blog/edit/${post.id}`}>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-amber-600 hover:text-amber-800'
                          >
                            <Edit className='h-4 w-4' />
                            <span className='sr-only'>Edit</span>
                          </Button>
                        </Link>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='text-red-600 hover:text-red-800'
                        >
                          <Trash2 className='h-4 w-4' />
                          <span className='sr-only'>Delete</span>
                        </Button>
                      </div>
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
