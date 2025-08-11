// src/config/routeAccessConfig.ts

export interface RouteAccess {
  pattern: string | RegExp;
  isPublic: boolean;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
  redirectTo?: string;
  description?: string;
}

// Define all route access rules
export const routeAccessRules: RouteAccess[] = [
  // ===== PUBLIC ROUTES =====
  {
    pattern: "/",
    isPublic: true,
    description: "Home page",
  },
  {
    pattern: "/about",
    isPublic: true,
    description: "About page",
  },
  {
    pattern: "/contact",
    isPublic: true,
    description: "Contact page",
  },
  {
    pattern: /^\/photo-gallery/,
    isPublic: true,
    description: "Photo gallery",
  },
  {
    pattern: /^\/video-gallery/,
    isPublic: true,
    description: "Video gallery",
  },
  {
    pattern: /^\/view\/photo\//,
    isPublic: true,
    description: "Individual photo view",
  },
  {
    pattern: /^\/view\/video\//,
    isPublic: true,
    description: "Individual video view",
  },
  {
    pattern: /^\/press\//,
    isPublic: true,
    description: "Press article view",
  },

  // ===== AUTH ROUTES (Special handling) =====
  {
    pattern: "/admin/login",
    isPublic: true,
    redirectTo: "/admin/dashboard", // Redirect if already authenticated
    description: "Admin login page",
  },

  // ===== PROTECTED ADMIN ROUTES =====
  {
    pattern: /^\/admin\/dashboard/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Admin dashboard",
  },
  {
    pattern: /^\/admin\/videoDashboard/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Video management",
  },
  {
    pattern: /^\/admin\/photoDashboard/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Photo management",
  },
  {
    pattern: /^\/admin\/pressDashboard/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Press management",
  },
  {
    pattern: /^\/admin\/add/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Add content pages",
  },
  {
    pattern: /^\/admin\/edit/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Edit content pages",
  },
  {
    pattern: /^\/admin\/view\//,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Admin view pages",
  },
  {
    pattern: /^\/admin\/play\//,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Video player (admin)",
  },
  {
    pattern: /^\/admin\/read\//,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Press reader (admin)",
  },
  {
    pattern: /^\/admin\/messages/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Message management",
  },
  {
    pattern: /^\/admin\//,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Catch-all for admin routes",
  },
];

// Utility functions
export const getRouteAccess = (path: string): RouteAccess | null => {
  return (
    routeAccessRules.find((rule) => {
      if (typeof rule.pattern === "string") {
        return rule.pattern === path;
      } else {
        return rule.pattern.test(path);
      }
    }) || null
  );
};

export const isRoutePublic = (path: string): boolean => {
  const access = getRouteAccess(path);
  return access?.isPublic ?? true; // Default to public if not found
};

export const canAccessRoute = (
  path: string,
  isAuthenticated: boolean,
  isAdmin: boolean
): { canAccess: boolean; redirectTo?: string; reason?: string } => {
  const access = getRouteAccess(path);

  if (!access) {
    return { canAccess: true }; // Allow unknown routes (handled by NotFound)
  }

  // Public routes - always accessible
  if (access.isPublic) {
    // Special case: login page when already authenticated
    if (path === "/admin/login" && isAuthenticated && isAdmin) {
      return {
        canAccess: false,
        redirectTo: access.redirectTo || "/admin/dashboard",
        reason: "Already authenticated",
      };
    }
    return { canAccess: true };
  }

  // Protected routes - check authentication
  if (access.requiresAuth && !isAuthenticated) {
    return {
      canAccess: false,
      redirectTo: access.redirectTo || "/admin/login",
      reason: "Authentication required",
    };
  }

  // Admin routes - check admin privileges
  if (access.requiresAdmin && !isAdmin) {
    return {
      canAccess: false,
      redirectTo: "/",
      reason: "Admin privileges required",
    };
  }

  return { canAccess: true };
};
