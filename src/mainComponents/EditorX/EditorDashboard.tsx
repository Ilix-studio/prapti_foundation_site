import React from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  LogOut,
  Home,
  Loader2,
  Trophy,
  FileText,
  FolderTree,
  Images,
  Video,
  Users,
  Info,
} from "lucide-react";
import { selectAuth, selectIsEditor } from "@/redux-store/slices/authSlice";
import { useLogoutEditorMutation } from "@/redux-store/services/editorApi";

interface NavItem {
  title: string;
  description: string;
  icon: React.ElementType;
  route: string;
  color: string;
}

// The six resources an editor is authorized to manage.
// Routes assumed to match the existing admin manager routes; adjust if your
// editor routes differ.
const NAV_ITEMS: NavItem[] = [
  {
    title: "Awards",
    description: "Manage awards & recognitions",
    icon: Trophy,
    route: "/editor/awards",
    color: "border-l-amber-500",
  },
  {
    title: "Blogs",
    description: "Create and edit blog posts",
    icon: FileText,
    route: "/editor/blogposts",
    color: "border-l-blue-500",
  },
  {
    title: "Categories",
    description: "Manage content categories",
    icon: FolderTree,
    route: "/editor/categories",
    color: "border-l-purple-500",
  },
  {
    title: "Photos",
    description: "Upload and organize photos",
    icon: Images,
    route: "/editor/photos",
    color: "border-l-pink-500",
  },
  {
    title: "Videos",
    description: "Manage video gallery",
    icon: Video,
    route: "/editor/videos",
    color: "border-l-red-500",
  },
  {
    title: "Volunteers",
    description: "Review volunteer applications",
    icon: Users,
    route: "/editor/volunteers",
    color: "border-l-green-500",
  },
];

const EditorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(selectAuth);
  const isEditor = useSelector(selectIsEditor);

  const [logoutEditor, { isLoading: isLoggingOut }] = useLogoutEditorMutation();

  if (!isAuthenticated || !isEditor) {
    return <Navigate to='/editor/login' replace />;
  }

  const handleLogout = async () => {
    try {
      // Clears auth state via the mutation's onQueryStarted -> logout().
      await logoutEditor().unwrap();
    } catch {
      // Logout is best-effort; auth state is cleared regardless on the slice.
    } finally {
      navigate("/editor/login", { replace: true });
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='sticky top-0 z-40 border-b bg-white/80 backdrop-blur shadow-sm'>
        <div className='container flex h-16 items-center justify-between gap-2 px-3 sm:px-4'>
          <div className='flex items-center gap-2 sm:gap-3 min-w-0'>
            <img
              src='https://res.cloudinary.com/doakqvah3/image/upload/q_auto/f_auto/v1778246701/boring_logo_symwa7.png'
              alt='Prapti Foundation Logo'
              className='h-8 w-8 sm:h-9 sm:w-9 shrink-0 object-contain'
            />
            <div className='min-w-0'>
              <h1 className='truncate text-base sm:text-lg font-bold text-gray-900'>
                Editor Dashboard
              </h1>
              <p className='truncate text-xs sm:text-sm text-gray-600'>
                Prapti Foundation
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2 sm:gap-3 shrink-0'>
            <Link to='/'>
              <Button
                variant='outline'
                size='sm'
                className='text-gray-500 border-orange-500 hover:bg-orange-50'
              >
                <Home className='h-4 w-4 sm:mr-2' />
                <span className='hidden sm:inline'>View Website</span>
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              variant='ghost'
              size='sm'
              className='text-red-600 hover:text-red-700 hover:bg-red-50'
            >
              {isLoggingOut ? (
                <Loader2 className='h-4 w-4 sm:mr-2 animate-spin' />
              ) : (
                <LogOut className='h-4 w-4 sm:mr-2' />
              )}
              <span className='hidden sm:inline'>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className='container py-6 px-4 sm:px-6'>
        {/* Welcome */}
        <div className='mb-6'>
          <h2 className='text-xl sm:text-2xl font-bold text-gray-900 mb-1'>
            Welcome back, {user?.name}
          </h2>
          <p className='text-sm sm:text-base text-gray-600'>
            Select a section below to manage content.
          </p>
        </div>

        {/* Navigation grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
          {NAV_ITEMS.map((item) => (
            <Card
              key={item.route}
              role='button'
              tabIndex={0}
              onClick={() => navigate(item.route)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(item.route);
                }
              }}
              className={`cursor-pointer border-l-4 ${item.color} hover:shadow-lg hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 transition-all duration-200`}
            >
              <CardContent className='p-4 sm:p-6 flex items-center gap-4'>
                <div className='rounded-lg bg-gray-100 p-3 shrink-0'>
                  <item.icon className='w-6 h-6 text-gray-700' />
                </div>
                <div className='min-w-0'>
                  <h3 className='font-semibold text-gray-900'>{item.title}</h3>
                  <p className='text-sm text-gray-500'>{item.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <br />
        <br />
        {/* Limited-access notice */}
        <div className='mb-8 flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4'>
          <Info className='h-5 w-5 shrink-0 text-orange-500 mt-0.5' />
          <div className='text-sm text-orange-800'>
            <p className='font-medium'>Some features are limited here.</p>
            <p className='mt-0.5 text-orange-700'>
              This dashboard is for managing content only. To see how your
              changes appear,{" "}
              <Link
                to='/'
                className='font-medium underline underline-offset-2 hover:text-orange-900'
              >
                visit the homepage
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorDashboard;
