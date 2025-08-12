import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PawPrint,
  LogOut,
  Plus,
  BookOpen,
  Home,
  Loader2,
  AlertCircle,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Upload,
  FileText,
  Calendar,
  TrendingUp,
  Video,
} from "lucide-react";

import {
  logout,
  selectAuth,
  selectIsAdmin,
} from "../../redux-store/slices/authSlice";
import { useGetBlogPostsQuery } from "../../redux-store/services/blogApi";
import { useGetVolunteerApplicationsQuery } from "../../redux-store/services/volunteerApi";

const NewDashAdmin: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);

  // API hooks
  const {
    data: blogPosts,
    isLoading: blogsLoading,
    error: blogsError,
  } = useGetBlogPostsQuery();

  const {
    data: volunteerData,
    isLoading: volunteersLoading,
    error: volunteersError,
  } = useGetVolunteerApplicationsQuery({ page: 1, limit: 5 });

  // Mock data for additional stats (you can replace with real API calls)
  const [mockStats] = useState({
    totalMessages: 12,
    unreadMessages: 3,
    totalPhotos: 45,
    todayVisitors: 12,
    thisWeekVisitors: 4,
    growthRate: 12,
    totalVisitors: 112,
  });

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/admin/login' />;
  }

  const handleLogout = () => {
    dispatch(logout());
  };

  // Stats configuration
  const stats = [
    {
      title: "Total Blogs",
      value: blogPosts?.length?.toString() || "0",
      change: "+2",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      loading: blogsLoading,
      error: blogsError,
      action: () => navigate("/admin/blogsDashboard"),
    },
    {
      title: "Total Gallery Photos",
      value: mockStats.totalPhotos.toString(),
      change: "+5",
      icon: Heart,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      loading: false,
      action: () => navigate("/admin/photoDashboard"),
    },
    {
      title: "Total Gallery Videos",
      value: mockStats.totalPhotos.toString(),
      change: "+5",
      icon: Heart,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      loading: false,
      action: () => navigate("/admin/videoDashboard"),
    },
    {
      title: "Total Volunteer Applications",
      value: volunteerData?.pagination?.total?.toString() || "0",
      change: "+1",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      loading: volunteersLoading,
      error: volunteersError,
      action: () => navigate("/admin/volunteerDashboard"),
    },
  ];

  const quickActions = [
    {
      title: "Add Blog Post",
      icon: Plus,
      color: "bg-blue-600",
      action: () => navigate("/admin/blog/new"),
    },
    {
      title: "Upload Photo",
      icon: Upload,
      color: "bg-purple-600",
      action: () => navigate("/admin/addPhoto"),
    },
    {
      title: "Upload Video",
      icon: Video,
      color: "bg-green-600",
      action: () => navigate("/admin/addVideo"),
    },
    {
      title: "Add Category",
      icon: FileText,
      color: "bg-orange-600",
      action: () => navigate("/admin/addCategory"),
    },
  ];

  // Mock recent messages (replace with real data)
  const recentMessages = [
    {
      id: "1",
      name: "John Doe",
      subject: "Volunteer inquiry",
      time: "2 hours ago",
      isNew: true,
    },
    {
      id: "2",
      name: "Sarah Smith",
      subject: "Dog adoption question",
      time: "4 hours ago",
      isNew: true,
    },
    {
      id: "3",
      name: "Mike Johnson",
      subject: "Donation information",
      time: "1 day ago",
      isNew: false,
    },
    {
      id: "4",
      name: "Emily Davis",
      subject: "Event participation",
      time: "2 days ago",
      isNew: false,
    },
  ];

  return (
    <div className='min-h-screen bg-white'>
      {/* Header */}
      <header className='sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm'>
        <div className='container flex h-16 items-center justify-between px-4'>
          <div className='flex items-center gap-3'>
            <PawPrint className='h-8 w-8 text-orange-500' />
            <div>
              <h1 className='text-lg font-bold text-gray-900'>
                Admin Dashboard
              </h1>
              <p className='text-sm text-gray-600'>Prapti Foundation</p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <Link to='/'>
              <Button
                variant='outline'
                size='sm'
                className='text-orange-500 border-orange-500 hover:bg-orange-50'
              >
                <Home className='h-4 w-4 mr-2' />
                <span className='hidden sm:inline'>View Website</span>
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              variant='ghost'
              size='sm'
              className='text-red-600 hover:text-red-700 hover:bg-red-50'
            >
              <LogOut className='h-4 w-4 mr-2' />
              <span className='hidden sm:inline'>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className='container py-6 px-4 sm:px-6'>
        {/* Welcome Section */}
        <div className='mb-8 animate-in fade-in duration-700'>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            Welcome back, <span className='font-medium'>{user?.name}</span>
          </h2>
          <p className='text-gray-600'>
            Here's what's happening with your website today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-in slide-in-from-bottom duration-700'>
          {stats.map((stat, index) => (
            <Card
              key={index}
              className='hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-orange-500 hover:scale-105'
              onClick={stat.action}
            >
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='flex-1'>
                    <p className='text-sm font-medium text-gray-600 mb-1'>
                      {stat.title}
                    </p>
                    <div className='flex items-center gap-2'>
                      <p className='text-2xl font-bold text-gray-900'>
                        {stat.loading ? (
                          <Loader2 className='w-6 h-6 animate-spin' />
                        ) : stat.error ? (
                          <span className='text-red-500 text-sm flex items-center gap-1'>
                            <AlertCircle className='w-4 h-4' />
                            Error
                          </span>
                        ) : (
                          stat.value
                        )}
                      </p>
                      {stat.change && !stat.loading && !stat.error && (
                        <Badge
                          variant='secondary'
                          className='text-green-600 bg-green-50'
                        >
                          {stat.change}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Visitor Analytics Section */}
        <div className='mb-8 animate-in slide-in-from-left duration-700'>
          <Card className='border-l-4 border-l-blue-500 shadow-sm'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <TrendingUp className='w-5 h-5 text-blue-600' />
                Visitor Analytics
                <Badge variant='outline' className='ml-auto'>
                  Live
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <div className='text-center p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors'>
                  <p className='text-2xl font-bold text-green-900'>
                    {mockStats.totalVisitors}
                  </p>
                  <p className='text-green-600 text-sm font-medium'>
                    Total Visitors
                  </p>
                </div>
                <div className='text-center p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors'>
                  <p className='text-2xl font-bold text-blue-900'>
                    {mockStats.todayVisitors}
                  </p>
                  <p className='text-blue-600 text-sm font-medium'>
                    Today's Visitors
                  </p>
                </div>
                <div className='text-center p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors'>
                  <p className='text-2xl font-bold text-purple-900'>
                    {mockStats.thisWeekVisitors}
                  </p>
                  <p className='text-purple-600 text-sm font-medium'>
                    This Week
                  </p>
                </div>
                <div className='text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors'>
                  <p className='text-2xl font-bold text-yellow-900'>
                    +{mockStats.growthRate}%
                  </p>
                  <p className='text-yellow-600 text-sm font-medium'>
                    Growth Rate
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Recent Messages */}
          <div className='lg:col-span-2 animate-in slide-in-from-left duration-700'>
            <Card className='border-l-4 border-l-green-500 shadow-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <MessageCircle className='w-5 h-5 text-green-600' />
                  Recent Messages
                  <Badge variant='destructive' className='ml-2'>
                    {mockStats.unreadMessages} new
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {recentMessages.map((message) => (
                    <div
                      key={message.id}
                      className='flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-gray-300'
                    >
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-1'>
                          <p className='font-medium text-gray-900'>
                            {message.name}
                          </p>
                          {message.isNew && (
                            <Badge variant='destructive' className='text-xs'>
                              New
                            </Badge>
                          )}
                        </div>
                        <p className='text-sm text-gray-600 mb-1'>
                          {message.subject}
                        </p>
                        <p className='text-xs text-gray-500'>{message.time}</p>
                      </div>
                      <Button
                        size='sm'
                        variant='outline'
                        className='hover:bg-orange-50 hover:border-orange-300'
                      >
                        <Eye className='w-4 h-4' />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  className='w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-medium'
                  onClick={() => navigate("/admin/messages")}
                >
                  View All Messages
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className='animate-in slide-in-from-right duration-700'>
            <Card className='mb-6 border-l-4 border-l-purple-500 shadow-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <TrendingUp className='w-5 h-5 text-purple-600' />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 gap-3'>
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      onClick={action.action}
                      className={`${action.color} hover:opacity-90 text-white p-4 h-auto flex-col gap-2 transition-all duration-200 hover:scale-105 shadow-sm`}
                    >
                      <action.icon className='w-6 h-6' />
                      <span className='text-xs font-medium'>
                        {action.title}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Site Status */}
            <Card className='border-l-4 border-l-cyan-500 shadow-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Calendar className='w-5 h-5 text-cyan-600' />
                  Site Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-gray-700'>
                      Website Status
                    </span>
                    <Badge className='bg-green-100 text-green-800 border-green-200'>
                      <div className='w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse'></div>
                      Online
                    </Badge>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-gray-700'>
                      Server Health
                    </span>
                    <Badge className='bg-green-100 text-green-800 border-green-200'>
                      Good
                    </Badge>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-gray-700'>
                      Database
                    </span>
                    <Badge className='bg-green-100 text-green-800 border-green-200'>
                      Connected
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Quick Stats Footer */}
        <div className='mt-8 animate-in fade-in duration-1000'>
          <Card className='bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                    Foundation Impact
                  </h3>
                  <p className='text-gray-600 text-sm'>
                    Making a difference in the community through your efforts
                  </p>
                </div>
                <div className='flex items-center gap-6 text-center'>
                  <div>
                    <p className='text-2xl font-bold text-orange-600'>24</p>
                    <p className='text-xs text-gray-600'>Dogs Rescued</p>
                  </div>
                  <div>
                    <p className='text-2xl font-bold text-green-600'>18</p>
                    <p className='text-xs text-gray-600'>Adopted</p>
                  </div>
                  <div>
                    <p className='text-2xl font-bold text-blue-600'>32</p>
                    <p className='text-xs text-gray-600'>Volunteers</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewDashAdmin;
