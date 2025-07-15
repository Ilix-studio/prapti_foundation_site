import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
  Users,
  Eye,
  MessageSquare,
  Mail,
  MailOpen,
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
import {
  useGetVolunteerApplicationsQuery,
  useDeleteVolunteerApplicationMutation,
} from "../../redux-store/services/volunteerApi";
import {
  useGetContactMessagesQuery,
  useDeleteContactMessageMutation,
  useMarkMessageAsReadMutation,
} from "../../redux-store/services/contactApi";

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(selectAuth);
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

  // Volunteer Applications State
  const {
    data: volunteerData,
    isLoading: volunteersLoading,
    error: volunteersError,
  } = useGetVolunteerApplicationsQuery({ page: 1, limit: 10 });
  const [deleteVolunteerApp, { isLoading: isDeletingVolunteer }] =
    useDeleteVolunteerApplicationMutation();
  const [deletingVolunteerId, setDeletingVolunteerId] = useState<string | null>(
    null
  );
  const [showVolunteerDeleteConfirm, setShowVolunteerDeleteConfirm] = useState<
    string | null
  >(null);
  const [volunteerDeleteError, setVolunteerDeleteError] = useState<
    string | null
  >(null);

  // Contact Messages State
  const {
    data: messagesData,
    isLoading: messagesLoading,
    error: messagesError,
  } = useGetContactMessagesQuery({ page: 1, limit: 10 });
  const [deleteContactMessage, { isLoading: isDeletingMessage }] =
    useDeleteContactMessageMutation();
  const [markAsRead] = useMarkMessageAsReadMutation();
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(
    null
  );
  const [showMessageDeleteConfirm, setShowMessageDeleteConfirm] = useState<
    string | null
  >(null);
  const [messageDeleteError, setMessageDeleteError] = useState<string | null>(
    null
  );

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/admin/login' />;
  }

  const handleLogout = () => {
    dispatch(logout());
  };

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

  // Volunteer Application Handlers
  const handleVolunteerById = (volunteerId: string) => {
    navigate(`/admin/volunteer/${volunteerId}`);
  };

  const handleVolunteerDeleteClick = (volunteerId: string) => {
    setShowVolunteerDeleteConfirm(volunteerId);
    setVolunteerDeleteError(null);
  };

  const handleVolunteerDeleteConfirm = async (volunteerId: string) => {
    try {
      setDeletingVolunteerId(volunteerId);
      await deleteVolunteerApp(volunteerId).unwrap();
      setShowVolunteerDeleteConfirm(null);
    } catch (err: any) {
      console.error("Failed to delete volunteer application:", err);
      setVolunteerDeleteError(
        err.data?.message || "Failed to delete application. Please try again."
      );
    } finally {
      setDeletingVolunteerId(null);
    }
  };

  const handleVolunteerDeleteCancel = () => {
    setShowVolunteerDeleteConfirm(null);
    setVolunteerDeleteError(null);
  };

  // Contact Messages Handlers
  const handleMessageDeleteClick = (messageId: string) => {
    setShowMessageDeleteConfirm(messageId);
    setMessageDeleteError(null);
  };
  const handleViewMessageById = (messageId: string) => {
    navigate(`/admin/message/${messageId}`);
  };

  const handleMessageDeleteConfirm = async (messageId: string) => {
    try {
      setDeletingMessageId(messageId);
      await deleteContactMessage(messageId).unwrap();
      setShowMessageDeleteConfirm(null);
    } catch (err: any) {
      console.error("Failed to delete message:", err);
      setMessageDeleteError(
        err.data?.message || "Failed to delete message. Please try again."
      );
    } finally {
      setDeletingMessageId(null);
    }
  };

  const handleMessageDeleteCancel = () => {
    setShowMessageDeleteConfirm(null);
    setMessageDeleteError(null);
  };

  const handleToggleReadStatus = async (messageId: string, isRead: boolean) => {
    try {
      await markAsRead({ id: messageId, isRead: !isRead }).unwrap();
    } catch (err: any) {
      console.error("Failed to update read status:", err);
    }
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
        <Tabs defaultValue='blogs' className='w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='blogs' className='flex items-center gap-2'>
              <BookOpen className='h-4 w-4' />
              Blog Posts
            </TabsTrigger>
            <TabsTrigger value='volunteers' className='flex items-center gap-2'>
              <Users className='h-4 w-4' />
              Volunteer Applications
            </TabsTrigger>
            <TabsTrigger value='messages' className='flex items-center gap-2'>
              <MessageSquare className='h-4 w-4' />
              Contact Messages
              {messagesData?.unreadCount ? (
                <Badge
                  variant='destructive'
                  className='ml-1 h-5 w-5 p-0 text-xs'
                >
                  {messagesData.unreadCount}
                </Badge>
              ) : null}
            </TabsTrigger>
          </TabsList>

          {/* Blog Posts Tab */}
          <TabsContent value='blogs' className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h2 className='text-2xl font-bold'>Blog Posts</h2>
              <Link to='/admin/blog/new'>
                <Button className='bg-orange-500 hover:bg-orange-600'>
                  <Plus className='h-4 w-4 mr-2' />
                  Add New Blog Post
                </Button>
              </Link>
            </div>

            {/* Blog Delete Error Alert */}
            {blogDeleteError && (
              <div className='p-3 rounded-md bg-red-50 border border-red-200 text-red-600 flex items-center gap-2'>
                <AlertCircle className='h-5 w-5' />
                <span>{blogDeleteError}</span>
              </div>
            )}

            {/* Blog Posts Table */}
            <div className='bg-white rounded-lg shadow overflow-hidden'>
              {blogsLoading ? (
                <div className='p-6 text-center text-gray-500 flex justify-center items-center'>
                  <Loader2 className='h-5 w-5 animate-spin mr-2' />
                  Loading posts...
                </div>
              ) : blogsError ? (
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
                          {showBlogDeleteConfirm === post._id ? (
                            <div className='flex justify-end gap-2'>
                              <span className='text-sm text-gray-600 mr-2 self-center'>
                                Confirm delete?
                              </span>
                              <Button
                                variant='outline'
                                size='sm'
                                className='text-red-600 border-red-600 hover:bg-red-50'
                                onClick={() =>
                                  handleBlogDeleteConfirm(post._id)
                                }
                                disabled={
                                  isDeletingBlog && deletingBlogId === post._id
                                }
                              >
                                {isDeletingBlog &&
                                deletingBlogId === post._id ? (
                                  <Loader2 className='h-4 w-4 animate-spin mr-1' />
                                ) : null}
                                Yes
                              </Button>
                              <Button
                                variant='outline'
                                size='sm'
                                className='text-gray-600 border-gray-300'
                                onClick={handleBlogDeleteCancel}
                                disabled={
                                  isDeletingBlog && deletingBlogId === post._id
                                }
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
                                </Button>
                              </Link>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='text-amber-600 hover:text-amber-800'
                                onClick={() => handleEditPost(post._id)}
                              >
                                <Edit className='h-4 w-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='text-red-600 hover:text-red-800'
                                onClick={() => handleBlogDeleteClick(post._id)}
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
              ) : (
                <div className='p-6 text-center text-gray-500'>
                  No blog posts found
                </div>
              )}
            </div>
          </TabsContent>

          {/* Volunteer Applications Tab */}
          <TabsContent value='volunteers' className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h2 className='text-2xl font-bold'>Volunteer Applications</h2>
              <div className='text-sm text-gray-500'>
                {volunteerData?.pagination?.total || 0} total applications
              </div>
            </div>

            {/* Volunteer Delete Error Alert */}
            {volunteerDeleteError && (
              <div className='p-3 rounded-md bg-red-50 border border-red-200 text-red-600 flex items-center gap-2'>
                <AlertCircle className='h-5 w-5' />
                <span>{volunteerDeleteError}</span>
              </div>
            )}

            {/* Volunteer Applications Table */}
            <div className='bg-white rounded-lg shadow overflow-hidden'>
              {volunteersLoading ? (
                <div className='p-6 text-center text-gray-500 flex justify-center items-center'>
                  <Loader2 className='h-5 w-5 animate-spin mr-2' />
                  Loading applications...
                </div>
              ) : volunteersError ? (
                <div className='p-6 text-center text-red-500 flex justify-center items-center'>
                  <AlertCircle className='h-5 w-5 mr-2' />
                  Error loading volunteer applications
                </div>
              ) : volunteerData?.data && volunteerData.data.length > 0 ? (
                <table className='w-full'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Name
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Email
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Location
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Submitted
                      </th>
                      <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {volunteerData.data.map((volunteer) => (
                      <tr key={volunteer._id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm font-medium text-gray-900'>
                            {volunteer.firstName} {volunteer.lastName}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm text-gray-900'>
                            {volunteer.email}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm text-gray-500'>
                            {volunteer.district}, {volunteer.state}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm text-gray-500'>
                            {new Date(
                              volunteer.submittedAt
                            ).toLocaleDateString()}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                          {showVolunteerDeleteConfirm === volunteer._id ? (
                            <div className='flex justify-end gap-2'>
                              <span className='text-sm text-gray-600 mr-2 self-center'>
                                Confirm delete?
                              </span>
                              <Button
                                variant='outline'
                                size='sm'
                                className='text-red-600 border-red-600 hover:bg-red-50'
                                onClick={() =>
                                  handleVolunteerDeleteConfirm(volunteer._id)
                                }
                                disabled={
                                  isDeletingVolunteer &&
                                  deletingVolunteerId === volunteer._id
                                }
                              >
                                {isDeletingVolunteer &&
                                deletingVolunteerId === volunteer._id ? (
                                  <Loader2 className='h-4 w-4 animate-spin mr-1' />
                                ) : null}
                                Yes
                              </Button>
                              <Button
                                variant='outline'
                                size='sm'
                                className='text-gray-600 border-gray-300'
                                onClick={handleVolunteerDeleteCancel}
                                disabled={
                                  isDeletingVolunteer &&
                                  deletingVolunteerId === volunteer._id
                                }
                              >
                                No
                              </Button>
                            </div>
                          ) : (
                            <div className='flex justify-end gap-2'>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='text-blue-600 hover:text-blue-800'
                                onClick={() =>
                                  handleVolunteerById(volunteer._id)
                                }
                              >
                                <Eye className='h-4 w-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='text-red-600 hover:text-red-800'
                                onClick={() =>
                                  handleVolunteerDeleteClick(volunteer._id)
                                }
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
              ) : (
                <div className='p-6 text-center text-gray-500'>
                  No volunteer applications found
                </div>
              )}
            </div>
          </TabsContent>

          {/* Contact Messages Tab */}
          <TabsContent value='messages' className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h2 className='text-2xl font-bold'>Contact Messages</h2>
              <div className='text-sm text-gray-500'>
                {messagesData?.pagination?.total || 0} total messages
                {messagesData?.unreadCount ? (
                  <span className='ml-2 text-red-600 font-medium'>
                    ({messagesData.unreadCount} unread)
                  </span>
                ) : null}
              </div>
            </div>

            {/* Message Delete Error Alert */}
            {messageDeleteError && (
              <div className='p-3 rounded-md bg-red-50 border border-red-200 text-red-600 flex items-center gap-2'>
                <AlertCircle className='h-5 w-5' />
                <span>{messageDeleteError}</span>
              </div>
            )}

            {/* Contact Messages Table */}
            <div className='bg-white rounded-lg shadow overflow-hidden'>
              {messagesLoading ? (
                <div className='p-6 text-center text-gray-500 flex justify-center items-center'>
                  <Loader2 className='h-5 w-5 animate-spin mr-2' />
                  Loading messages...
                </div>
              ) : messagesError ? (
                <div className='p-6 text-center text-red-500 flex justify-center items-center'>
                  <AlertCircle className='h-5 w-5 mr-2' />
                  Error loading contact messages
                </div>
              ) : messagesData?.data && messagesData.data.length > 0 ? (
                <table className='w-full'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Status
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Name
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Email
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Subject
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Received
                      </th>
                      <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {messagesData.data.map((message) => (
                      <tr
                        key={message._id}
                        className={`hover:bg-gray-50 ${
                          !message.isRead ? "bg-blue-50" : ""
                        }`}
                      >
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() =>
                              handleToggleReadStatus(
                                message._id,
                                message.isRead
                              )
                            }
                            className={
                              message.isRead ? "text-gray-400" : "text-blue-600"
                            }
                          >
                            {message.isRead ? (
                              <MailOpen className='h-4 w-4' />
                            ) : (
                              <Mail className='h-4 w-4' />
                            )}
                          </Button>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div
                            className={`text-sm ${
                              !message.isRead
                                ? "font-semibold text-gray-900"
                                : "font-medium text-gray-700"
                            }`}
                          >
                            {message.name}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm text-gray-600'>
                            {message.email}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap max-w-xs'>
                          <div
                            className={`text-sm truncate ${
                              !message.isRead
                                ? "font-medium text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            {message.subject}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm text-gray-500'>
                            {new Date(message.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                          {showMessageDeleteConfirm === message._id ? (
                            <div className='flex justify-end gap-2'>
                              <span className='text-sm text-gray-600 mr-2 self-center'>
                                Confirm delete?
                              </span>
                              <Button
                                variant='outline'
                                size='sm'
                                className='text-red-600 border-red-600 hover:bg-red-50'
                                onClick={() =>
                                  handleMessageDeleteConfirm(message._id)
                                }
                                disabled={
                                  isDeletingMessage &&
                                  deletingMessageId === message._id
                                }
                              >
                                {isDeletingMessage &&
                                deletingMessageId === message._id ? (
                                  <Loader2 className='h-4 w-4 animate-spin mr-1' />
                                ) : null}
                                Yes
                              </Button>
                              <Button
                                variant='outline'
                                size='sm'
                                className='text-gray-600 border-gray-300'
                                onClick={handleMessageDeleteCancel}
                                disabled={
                                  isDeletingMessage &&
                                  deletingMessageId === message._id
                                }
                              >
                                No
                              </Button>
                            </div>
                          ) : (
                            <div className='flex justify-end gap-2'>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='text-blue-600 hover:text-blue-800'
                                onClick={() =>
                                  handleViewMessageById(message._id)
                                }
                              >
                                <Eye className='h-4 w-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='text-red-600 hover:text-red-800'
                                onClick={() =>
                                  handleMessageDeleteClick(message._id)
                                }
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
              ) : (
                <div className='p-6 text-center text-gray-500'>
                  No contact messages found
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
