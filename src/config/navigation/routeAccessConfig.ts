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
    pattern: "/gallery",
    isPublic: true,
    description: "Gallery page",
  },
  {
    pattern: "/adopt",
    isPublic: true,
    description: "Adoption form",
  },
  {
    pattern: "/report",
    isPublic: true,
    description: "Report page",
  },
  {
    pattern: "/support",
    isPublic: true,
    description: "Support page",
  },
  {
    pattern: "/blog",
    isPublic: true,
    description: "Blog listing",
  },
  {
    pattern: /^\/blog\/[^/]+$/,
    isPublic: true,
    description: "Blog post",
  },
  {
    pattern: "/volunteer",
    isPublic: true,
    description: "Volunteer page",
  },
  {
    pattern: "/write-testimonial",
    isPublic: true,
    description: "Write testimonial",
  },
  {
    pattern: "/awards",
    isPublic: true,
    description: "Awards listing",
  },
  {
    pattern: /^\/awards\/[^/]+$/,
    isPublic: true,
    description: "Award detail",
  },
  {
    pattern: "/rescue",
    isPublic: true,
    description: "Rescue listing",
  },
  {
    pattern: /^\/rescue\/[^/]+$/,
    isPublic: true,
    description: "Rescue detail",
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
  // Legacy routes
  {
    pattern: /^\/photo-gallery/,
    isPublic: true,
    description: "Photo gallery (legacy)",
  },
  {
    pattern: /^\/video-gallery/,
    isPublic: true,
    description: "Video gallery (legacy)",
  },

  // ===== AUTH ROUTES (Special handling) =====
  {
    pattern: "/admin/login",
    isPublic: true,
    redirectTo: "/admin/dashboard",
    description: "Admin login page",
  },

  // ===== PROTECTED ADMIN DASHBOARDS =====
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
    pattern: /^\/admin\/blogsDashboard/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Blogs management",
  },
  {
    pattern: /^\/admin\/volunteerDashboard/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Volunteer management",
  },
  {
    pattern: /^\/admin\/impact/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Impact dashboard",
  },
  {
    pattern: /^\/admin\/testimonials/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Testimonials management",
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
    pattern: /^\/admin\/categories/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Category management",
  },
  {
    pattern: /^\/admin\/awardDash/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Award management",
  },
  {
    pattern: /^\/admin\/rescueDash/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Rescue management",
  },

  // ===== PROTECTED ADMIN SPECIFIC ROUTES =====
  // Photo routes
  {
    pattern: /^\/admin\/addPhoto/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Add photo",
  },
  {
    pattern: /^\/admin\/view\/[^/]+$/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "View photo (admin)",
  },
  {
    pattern: /^\/admin\/edit\/[^/]+$/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Edit photo",
  },

  // Video routes
  {
    pattern: /^\/admin\/addVideo/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Add video",
  },
  {
    pattern: /^\/admin\/play\/[^/]+$/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Play video (admin)",
  },
  {
    pattern: /^\/admin\/editVideo\/[^/]+$/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Edit video",
  },

  // Blog routes
  {
    pattern: /^\/admin\/blog\/new$/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Add blog post",
  },
  {
    pattern: /^\/admin\/blog\/edit\/[^/]+$/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Edit blog post",
  },
  {
    pattern: /^\/admin\/blog\/[^/]+$/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "View blog post (admin)",
  },

  // Volunteer routes
  {
    pattern: /^\/admin\/volunteer\/[^/]+$/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Volunteer detail (admin)",
  },

  // Award routes
  {
    pattern: /^\/admin\/addAwards/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Add award",
  },
  {
    pattern: /^\/admin\/editAward\/[^/]+$/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Edit award",
  },

  // Rescue routes
  {
    pattern: /^\/admin\/addRescue/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Add rescue",
  },
  {
    pattern: /^\/admin\/editRescue\/[^/]+$/,
    isPublic: false,
    requiresAuth: true,
    requiresAdmin: true,
    redirectTo: "/admin/login",
    description: "Edit rescue",
  },

  // ===== CATCH-ALL ADMIN ROUTE =====
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
