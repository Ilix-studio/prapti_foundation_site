import {
  Share2,
  LogOut,
  ImagePlus,
  FileText,
  Home,
  Settings,
  Users,
  Lock,
} from "lucide-react";
import { ContextualButton, NavigationContext } from "./navigationUtils";
import { IconVideoPlus } from "@tabler/icons-react";

// Utility functions that will be passed to button configs
interface ButtonActions {
  navigate: (path: string) => void;
  safeNavigate: (path: string) => void;
  handleLogout: () => void;
  handleShare: (title?: string) => void;
}

// Button configuration functions for each page type
export const getContextualButtonsForPage = (
  pageType: string,
  context: NavigationContext,
  actions: ButtonActions
): ContextualButton[] => {
  const { isAuthenticated, isAdmin, currentPath } = context;
  const { safeNavigate, handleLogout, handleShare } = actions;

  switch (pageType) {
    case "home":
      const homeButtons: ContextualButton[] = [];

      if (!isAuthenticated) {
        homeButtons.push({
          icon: <Lock className='w-4 h-4' />,
          label: "Admin",
          onClick: () => safeNavigate("/admin/login"),
          variant: "outline",
          priority: 1,
          showOnMobile: true,
        });
      } else if (isAdmin) {
        homeButtons.push({
          icon: <Settings className='w-4 h-4' />,
          label: "Dashboard",
          onClick: () => safeNavigate("/admin/dashboard"),
          variant: "outline",
          priority: 1,
          showOnMobile: true,
        });
      }

      return homeButtons;

    case "about":
      return [
        {
          icon: <Share2 className='w-4 h-4' />,
          label: "Share",
          onClick: () => handleShare("About - Biswajit Phukan"),
          variant: "outline",
          priority: 2,
          showOnMobile: false,
        },
      ];

    case "contact":
      return [
        {
          icon: <Share2 className='w-4 h-4' />,
          label: "Share",
          onClick: () => handleShare("Contact - Biswajit Phukan"),
          variant: "outline",
          priority: 1,
          showOnMobile: true,
        },
      ];

    case "admin-login":
      return [
        {
          icon: <Home className='w-4 h-4' />,
          label: "Home",
          onClick: () => safeNavigate("/"),
          variant: "outline",
          priority: 1,
          showOnMobile: true,
        },
      ];

    case "admin-dashboard":
      if (!isAuthenticated || !isAdmin) return [];

      return [
        {
          icon: <LogOut className='w-4 h-4' />,
          label: "Logout",
          onClick: handleLogout,
          variant: "destructive",
          priority: 1,
          showOnMobile: true,
        },
      ];

    case "video-dashboard":
      if (!isAuthenticated || !isAdmin) return [];

      return [
        {
          icon: <IconVideoPlus className='w-4 h-4' />,
          label: "Add Video",
          onClick: () => safeNavigate("/admin/addVideo"),
          variant: "default",
          priority: 1,
          showOnMobile: true,
        },
        {
          icon: <LogOut className='w-4 h-4' />,
          label: "Logout",
          onClick: handleLogout,
          variant: "outline",
          priority: 2,
          showOnMobile: false,
        },
      ];

    case "photo-dashboard":
      if (!isAuthenticated || !isAdmin) return [];

      return [
        {
          icon: <ImagePlus className='w-4 h-4' />,
          label: "Add Photo",
          onClick: () => safeNavigate("/admin/addPhoto"),
          variant: "default",
          priority: 1,
          showOnMobile: true,
        },
        {
          icon: <LogOut className='w-4 h-4' />,
          label: "Logout",
          onClick: handleLogout,
          variant: "outline",
          priority: 2,
          showOnMobile: false,
        },
      ];

    case "press-dashboard":
      if (!isAuthenticated || !isAdmin) return [];

      return [
        {
          icon: <FileText className='w-4 h-4' />,
          label: "Add Article",
          onClick: () => safeNavigate("/admin/addPress"),
          variant: "default",
          priority: 1,
          showOnMobile: true,
        },
        {
          icon: <LogOut className='w-4 h-4' />,
          label: "Logout",
          onClick: handleLogout,
          variant: "outline",
          priority: 2,
          showOnMobile: false,
        },
      ];

    case "video-specific":
      if (!isAuthenticated || !isAdmin) return [];

      const videoButtons: ContextualButton[] = [];

      // Only add edit/delete buttons for edit pages
      if (currentPath.includes("/editVideo/"))
        // Always add logout button
        videoButtons.push({
          icon: <LogOut className='w-4 h-4' />,
          label: "Logout",
          onClick: handleLogout,
          variant: "outline",
          priority: 2,
          showOnMobile: true,
        });

      return videoButtons;

    case "photo-specific":
      if (!isAuthenticated || !isAdmin) return [];

      const photoButtons: ContextualButton[] = [];

      if (currentPath.includes("/editVideo/"))
        photoButtons.push({
          icon: <LogOut className='w-4 h-4' />,
          label: "Logout",
          onClick: handleLogout,
          variant: "outline",
          priority: 2,
          showOnMobile: true,
        });

      return photoButtons;

    case "press-specific":
      if (!isAuthenticated || !isAdmin) return [];

      const pressButtons: ContextualButton[] = [];

      if (currentPath.includes("/editPress/"))
        pressButtons.push({
          icon: <LogOut className='w-4 h-4' />,
          label: "Logout",
          onClick: handleLogout,
          variant: "outline",
          priority: 2,
          showOnMobile: true,
        });

      return pressButtons;

    case "admin-messages":
      if (!isAuthenticated || !isAdmin) return [];

      return [
        {
          icon: <Users className='w-4 h-4' />,
          label: "All Messages",
          onClick: () => safeNavigate("/admin/messages"),
          variant: "outline",
          priority: 2,
          showOnMobile: false,
        },
        {
          icon: <LogOut className='w-4 h-4' />,
          label: "Logout",
          onClick: handleLogout,
          variant: "outline",
          priority: 1,
          showOnMobile: true,
        },
      ];

    case "photo-gallery":
    case "video-gallery":
    case "view-photo":
    case "view-video":
    case "press-article":
      const galleryButtons: ContextualButton[] = [
        {
          icon: <Share2 className='w-4 h-4' />,
          label: "Share",
          onClick: () => handleShare(),
          variant: "outline",
          priority: 1,
          showOnMobile: true,
        },
      ];

      // Add admin management button if authenticated
      if (isAuthenticated && isAdmin) {
        let dashboardPath = "/admin/dashboard";

        if (pageType.includes("photo")) dashboardPath = "/admin/photoDashboard";
        else if (pageType.includes("video"))
          dashboardPath = "/admin/videoDashboard";
        else if (pageType.includes("press"))
          dashboardPath = "/admin/pressDashboard";

        galleryButtons.push({
          icon: <Settings className='w-4 h-4' />,
          label: "Manage",
          onClick: () => safeNavigate(dashboardPath),
          variant: "outline",
          priority: 2,
          showOnMobile: false,
        });
      }

      return galleryButtons;

    default:
      return [
        {
          icon: <Home className='w-4 h-4' />,
          label: "Home-Page",
          onClick: () => safeNavigate("/"),
          variant: "outline",
          priority: 1,
          showOnMobile: true,
        },
      ];
  }
};
