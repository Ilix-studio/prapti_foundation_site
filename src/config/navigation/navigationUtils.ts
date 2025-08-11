import { getParentDashboard, getRouteCategory } from "../routeConfig";

export interface NavigationContext {
  currentPath: string;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export interface ContextualButton {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "destructive";
  className?: string;
  priority?: number;
  requiresAuth?: boolean;
  showOnMobile?: boolean;
}

// Get page type from path (updated with new admin specific routes)
export const getPageType = (path: string): string => {
  if (path === "/") return "home";
  if (path === "/about") return "about";
  if (path === "/contact") return "contact";
  if (path === "/admin/login") return "admin-login";

  if (path.startsWith("/admin/dashboard")) return "admin-dashboard";
  if (path.startsWith("/admin/videoDashboard")) return "video-dashboard";
  if (path.startsWith("/admin/photoDashboard")) return "photo-dashboard";
  if (path.startsWith("/admin/pressDashboard")) return "press-dashboard";
  if (path.startsWith("/admin/messages")) return "admin-messages";
  if (path.startsWith("/admin/categories")) return "admin-categories";

  // NEW: Check for admin specific routes
  if (
    path.startsWith("/admin/addVideo") ||
    path.startsWith("/admin/play/") ||
    path.startsWith("/admin/editVideo/")
  ) {
    return "video-specific";
  }
  if (
    path.startsWith("/admin/addPhoto") ||
    path.startsWith("/admin/view/") ||
    path.startsWith("/admin/edit/")
  ) {
    return "photo-specific";
  }
  if (
    path.startsWith("/admin/addPress") ||
    path.startsWith("/admin/read/") ||
    path.startsWith("/admin/editPress/")
  ) {
    return "press-specific";
  }

  if (path.startsWith("/admin/")) return "admin-general";

  if (path.startsWith("/photo-gallery")) return "photo-gallery";
  if (path.startsWith("/video-gallery")) return "video-gallery";
  if (path.startsWith("/view/photo/")) return "view-photo";
  if (path.startsWith("/view/video/")) return "view-video";
  if (path.startsWith("/press/")) return "press-article";

  return "unknown";
};

// Get friendly title from path (updated)
export const getPageTitle = (path: string): string => {
  const pageType = getPageType(path);

  const titleMap: Record<string, string> = {
    home: "Home",
    about: "About",
    contact: "Contact",
    "admin-login": "Admin Login",
    "admin-dashboard": "Dashboard",
    "video-dashboard": "Videos",
    "photo-dashboard": "Photos",
    "press-dashboard": "Press",
    "admin-messages": "Messages",
    "video-specific": "Videos", // Will show "Videos" as back button label
    "photo-specific": "Photos", // Will show "Photos" as back button label
    "press-specific": "Press", // Will show "Press" as back button label
    "admin-general": "Admin",
    "photo-gallery": "Photos",
    "video-gallery": "Videos",
    "view-photo": "Photo",
    "view-video": "Video",
    "press-article": "Article",
  };

  return titleMap[pageType] || "Page";
};

// NEW: Smart back navigation logic
export const getSmartBackPath = (currentPath: string): string | null => {
  // First, check if this is an admin specific route
  const parentDashboard = getParentDashboard(currentPath);
  if (parentDashboard) {
    return parentDashboard;
  }

  // Default back navigation logic for other routes
  if (currentPath.startsWith("/admin/messages/")) {
    return "/admin/messages"; // Message detail -> All messages
  }

  if (currentPath.startsWith("/view/photo/")) {
    return "/photo-gallery"; // Photo detail -> Photo gallery
  }

  if (currentPath.startsWith("/view/video/")) {
    return "/video-gallery"; // Video detail -> Video gallery
  }

  if (currentPath.startsWith("/press/")) {
    return "/"; // Press article -> Home
  }

  // No specific back path found
  return null;
};

// Simple route access check (basic version)
const isRoutePublic = (path: string): boolean => {
  const publicPaths = [
    "/",
    "/about",
    "/contact",
    "/photo-gallery",
    "/video-gallery",
    "/admin/login",
  ];

  if (publicPaths.includes(path)) return true;
  if (path.startsWith("/view/")) return true;
  if (path.startsWith("/press/")) return true;

  return false;
};

const requiresAuth = (path: string): boolean => {
  return path.startsWith("/admin/") && path !== "/admin/login";
};

// Check if user can navigate to a specific route
export const canNavigateToRoute = (
  targetPath: string,
  context: NavigationContext
): { canNavigate: boolean; redirectTo?: string; reason?: string } => {
  // Public routes - always accessible
  if (isRoutePublic(targetPath)) {
    // Special case: login page when already authenticated
    if (targetPath === "/admin/login" && context.isAuthenticated) {
      return {
        canNavigate: false,
        redirectTo: "/admin/dashboard",
        reason: "Already authenticated",
      };
    }
    return { canNavigate: true };
  }

  // Protected routes - check authentication
  if (requiresAuth(targetPath) && !context.isAuthenticated) {
    return {
      canNavigate: false,
      redirectTo: "/admin/login",
      reason: "Authentication required",
    };
  }

  // Admin routes - check admin privileges
  if (requiresAuth(targetPath) && context.isAuthenticated && !context.isAdmin) {
    return {
      canNavigate: false,
      redirectTo: "/",
      reason: "Admin privileges required",
    };
  }

  return { canNavigate: true };
};

// Safe navigation function
export const getSafeNavigationPath = (
  targetPath: string,
  context: NavigationContext
): string => {
  const { canNavigate, redirectTo } = canNavigateToRoute(targetPath, context);

  if (!canNavigate && redirectTo) {
    return redirectTo;
  }

  return targetPath;
};

// NEW: Enhanced back navigation with smart routing
export const canGoBackToPreviousRoute = (
  previousPath: string | null,
  context: NavigationContext
): boolean => {
  if (!previousPath) return false;

  const { canNavigate } = canNavigateToRoute(previousPath, context);
  return canNavigate;
};

// NEW: Get appropriate back destination with smart routing
export const getBackDestination = (
  previousPath: string | null,
  context: NavigationContext
): string => {
  // First, try smart back navigation
  const smartBackPath = getSmartBackPath(context.currentPath);
  if (smartBackPath) {
    return smartBackPath;
  }

  // Then try previous route if accessible
  if (previousPath && canGoBackToPreviousRoute(previousPath, context)) {
    return previousPath;
  }

  // Default safe destinations based on current context
  if (context.isAuthenticated && context.isAdmin) {
    return context.currentPath.startsWith("/admin/") ? "/admin/dashboard" : "/";
  }

  return "/";
};

// Get route protection status for debugging
export const getRouteProtectionInfo = (path: string) => {
  return {
    isPublic: isRoutePublic(path),
    requiresAuth: requiresAuth(path),
    requiresAdmin: requiresAuth(path), // In this basic version, all admin routes require admin
    description: getPageTitle(path),
    parentDashboard: getParentDashboard(path),
    category: getRouteCategory(path),
  };
};
