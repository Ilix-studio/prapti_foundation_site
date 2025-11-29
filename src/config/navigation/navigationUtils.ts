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
  // Public pages
  if (path === "/") return "home";
  if (path === "/about") return "about";
  if (path === "/contact") return "contact";
  if (path === "/gallery") return "gallery";
  if (path === "/adopt") return "adopt";
  if (path === "/report") return "report";
  if (path === "/support") return "support";
  if (path === "/blog") return "blog-list";
  if (path.startsWith("/blog/")) return "blog-post";
  if (path === "/volunteer") return "volunteer";
  if (path === "/write-testimonial") return "write-testimonial";
  if (path === "/awards") return "awards-list";
  if (path.startsWith("/awards/")) return "award-detail";
  if (path === "/rescue") return "rescue-list";
  if (path.startsWith("/rescue/")) return "rescue-detail";

  // Public gallery views
  if (path.startsWith("/view/photo/")) return "view-photo";
  if (path.startsWith("/view/video/")) return "view-video";

  // Auth
  if (path === "/admin/login") return "admin-login";

  // Admin dashboards
  if (path.startsWith("/admin/dashboard")) return "admin-dashboard";
  if (path.startsWith("/admin/videoDashboard")) return "video-dashboard";
  if (path.startsWith("/admin/photoDashboard")) return "photo-dashboard";
  if (path.startsWith("/admin/blogsDashboard")) return "blogs-dashboard";
  if (path.startsWith("/admin/volunteerDashboard"))
    return "volunteer-dashboard";
  if (path.startsWith("/admin/impact")) return "impact-dashboard";
  if (path.startsWith("/admin/testimonials")) return "testimonial-dashboard";
  if (path.startsWith("/admin/messages")) return "messages-dashboard";
  if (path.startsWith("/admin/categories")) return "categories-dashboard";
  if (path.startsWith("/admin/awardDash")) return "award-dashboard";
  if (path.startsWith("/admin/rescueDash")) return "rescue-dashboard";

  // Admin specific routes - Video
  if (
    path.startsWith("/admin/addVideo") ||
    path.startsWith("/admin/play/") ||
    path.startsWith("/admin/editVideo/")
  ) {
    return "video-specific";
  }

  // Admin specific routes - Photo
  if (
    path.startsWith("/admin/addPhoto") ||
    path.startsWith("/admin/view/") ||
    path.startsWith("/admin/edit/")
  ) {
    return "photo-specific";
  }

  // Admin specific routes - Blog
  if (
    path.startsWith("/admin/blog/new") ||
    path.startsWith("/admin/blog/edit/") ||
    path.match(/^\/admin\/blog\/[^/]+$/)
  ) {
    return "blogs-specific";
  }

  // Admin specific routes - Volunteer
  if (path.startsWith("/admin/volunteer/")) {
    return "volunteer-specific";
  }

  // Admin specific routes - Award
  if (
    path.startsWith("/admin/addAwards") ||
    path.startsWith("/admin/editAward/")
  ) {
    return "award-specific";
  }

  // Admin specific routes - Rescue
  if (
    path.startsWith("/admin/addRescue") ||
    path.startsWith("/admin/editRescue/")
  ) {
    return "rescue-specific";
  }

  // Fallback for other admin routes
  if (path.startsWith("/admin/")) return "admin-general";

  // Legacy routes (kept for backwards compatibility)
  if (path.startsWith("/photo-gallery")) return "photo-gallery";
  if (path.startsWith("/video-gallery")) return "video-gallery";

  return "unknown";
};

// Get friendly title from path (updated)
export const getPageTitle = (path: string): string => {
  const pageType = getPageType(path);

  const titleMap: Record<string, string> = {
    // Public pages
    home: "Home",
    about: "About",
    contact: "Contact",
    gallery: "Gallery",
    adopt: "Adoption",
    report: "Report",
    support: "Support",
    "blog-list": "Blog",
    "blog-post": "Blog",
    volunteer: "Volunteer",
    "write-testimonial": "Testimonial",
    "awards-list": "Awards",
    "award-detail": "Award",
    "rescue-list": "Rescues",
    "rescue-detail": "Rescue",
    "view-photo": "Photo",
    "view-video": "Video",

    // Auth
    "admin-login": "Admin Login",

    // Admin dashboards
    "admin-dashboard": "Dashboard",
    "video-dashboard": "Videos",
    "photo-dashboard": "Photos",
    "blogs-dashboard": "Blogs",
    "volunteer-dashboard": "Volunteers",
    "impact-dashboard": "Impact",
    "testimonial-dashboard": "Testimonials",
    "messages-dashboard": "Messages",
    "categories-dashboard": "Categories",
    "award-dashboard": "Awards",
    "rescue-dashboard": "Rescues",

    // Admin specific (back button labels)
    "video-specific": "Videos",
    "photo-specific": "Photos",
    "blogs-specific": "Blogs",
    "volunteer-specific": "Volunteers",
    "award-specific": "Awards",
    "rescue-specific": "Rescues",

    // Legacy/fallback
    "admin-general": "Admin",
    "photo-gallery": "Photos",
    "video-gallery": "Videos",
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

  // Public route back navigation
  if (currentPath.startsWith("/blog/")) {
    return "/blog";
  }

  if (currentPath.startsWith("/awards/")) {
    return "/awards";
  }

  if (currentPath.startsWith("/rescue/")) {
    return "/rescue";
  }

  if (currentPath.startsWith("/view/photo/")) {
    return "/gallery";
  }

  if (currentPath.startsWith("/view/video/")) {
    return "/gallery";
  }

  // Admin message detail back navigation
  if (currentPath.startsWith("/admin/messages/")) {
    return "/admin/messages";
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
    "/gallery",
    "/adopt",
    "/report",
    "/support",
    "/blog",
    "/volunteer",
    "/write-testimonial",
    "/awards",
    "/rescue",
    "/admin/login",
    // Legacy routes
    "/photo-gallery",
    "/video-gallery",
  ];

  if (publicPaths.includes(path)) return true;

  // Dynamic public routes
  if (path.startsWith("/view/photo/")) return true;
  if (path.startsWith("/view/video/")) return true;
  if (path.startsWith("/blog/")) return true;
  if (path.startsWith("/awards/")) return true;
  if (path.startsWith("/rescue/")) return true;

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
