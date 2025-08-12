import { lazy } from "react";

// Immediate load components (critical for first page load)
import Home from "../Home";
import AboutUs from "@/mainComponents/AboutUs";
import ContactUs from "@/mainComponents/ContactUs/ContactUs";
import LoginUser from "../mainComponents/Admin/LoginUser";

import NotFound from "../mainComponents/NotFound";
import BlogPostPage from "@/mainComponents/BlogPosts/SmallBlogUI/BlogPost";
import VolunteerPage from "@/mainComponents/Volunteer/Volunter";
import VolunteerDetail from "@/mainComponents/Volunteer/VolunteerDetail";
import AddBlogPost from "@/mainComponents/BlogPosts/AddBlogForm";
import EditBlogPost from "@/mainComponents/Admin/AdminBlogs/EditBlogPost";
import VolunteerDash from "@/mainComponents/Volunteer/VolunteerDash";
import BlogsDash from "@/mainComponents/BlogPosts/SmallBlogUI/BlogsDash";

// Lazy load components (loaded only when needed)

// const VideoGallery = lazy(
//   () => import("../mainComponents/Gallery/VideoGallery")
// );
// const ViewPhotoId = lazy(() => import("../mainComponents/Gallery/ViewPhotoId"));
// const ViewVideoId = lazy(() => import("../mainComponents/Gallery/ViewVideoId"));

// Admin components (lazy loaded)
const NewDashAdmin = lazy(() => import("../mainComponents/Admin/NewDashAdmin"));
const PhotoDash = lazy(
  () => import("../mainComponents/Admin/AdminPhoto/PhotoDash")
);
const AddPhoto = lazy(
  () => import("../mainComponents/Admin/AdminPhoto/AddPhoto")
);
const PhotoViewPage = lazy(
  () => import("../mainComponents/Admin/AdminPhoto/PhotoCardWrapper")
);
const EditPhoto = lazy(
  () => import("../mainComponents/Admin/AdminPhoto/EditPhoto")
);
const VideoDash = lazy(
  () => import("../mainComponents/Admin/AdminVideo/VideoDash")
);
const AddVideo = lazy(
  () => import("../mainComponents/Admin/AdminVideo/AddVideo")
);
const PlayVideo = lazy(
  () => import("../mainComponents/Admin/AdminVideo/PlayVideo")
);
const EditVideo = lazy(
  () => import("../mainComponents/Admin/AdminVideo/EditVideo")
);

const CategoryManager = lazy(
  () => import("../mainComponents/Admin/AdminCategory/CategoryManager")
);

// Route configuration
export const immediateRoute = [{ path: "/", component: Home }];
export const immediateRouteTwo = [
  { path: "/about", component: AboutUs },
  { path: "/contact", component: ContactUs },
  { path: "/admin/login", component: LoginUser },
];

export const publicRoutes = [
  // { path: "/photo-gallery", component: PhotoGallery },
  // { path: "/video-gallery", component: VideoGallery },
  // { path: "/view/photo/:id", component: ViewPhotoId },
  // { path: "/view/video/:id", component: ViewVideoId },
  { path: "/blog/:id", component: BlogPostPage }, // create a component for admin to read blog
  { path: "/volunteer", component: VolunteerPage },
];

export const adminRoutes = [
  { path: "/admin/dashboard", component: NewDashAdmin },
  { path: "/admin/photoDashboard", component: PhotoDash },
  { path: "/admin/videoDashboard", component: VideoDash },
  { path: "/admin/blogsDashboard", component: BlogsDash },
  { path: "/admin/volunteerDashboard", component: VolunteerDash },

  { path: "/admin/categories", component: CategoryManager },
  { path: "/admin/volunteer/:id", component: VolunteerDetail },
];

// NEW: Admin specific routes with dashboard mapping
export interface AdSpecificRoute {
  path: string;
  component: React.ComponentType;
  parentDashboard: string; // The dashboard this route should go back to
  category: "photo" | "video" | "blogs" | "message";
}

export const adSpecificRoutes: AdSpecificRoute[] = [
  // Photo specific routes - go back to photoDashboard
  {
    path: "/admin/addPhoto",
    component: AddPhoto,
    parentDashboard: "/admin/photoDashboard",
    category: "photo",
  },
  {
    path: "/admin/view/:id",
    component: PhotoViewPage,
    parentDashboard: "/admin/photoDashboard",
    category: "photo",
  },
  {
    path: "/admin/edit/:id",
    component: EditPhoto,
    parentDashboard: "/admin/photoDashboard",
    category: "photo",
  },

  // Video specific routes - go back to videoDashboard
  {
    path: "/admin/addVideo",
    component: AddVideo,
    parentDashboard: "/admin/videoDashboard",
    category: "video",
  },
  {
    path: "/admin/play/:id",
    component: PlayVideo,
    parentDashboard: "/admin/videoDashboard",
    category: "video",
  },
  {
    path: "/admin/editVideo/:id",
    component: EditVideo,
    parentDashboard: "/admin/videoDashboard",
    category: "video",
  },

  // Blogs specific routes - go back to pressDashboard
  {
    path: "/admin/blog/new",
    component: AddBlogPost,
    parentDashboard: "/admin/blogsDashboard",
    category: "blogs",
  },

  {
    path: "/admin/blog/edit/:id",
    component: EditBlogPost,
    parentDashboard: "/admin/blogsDashboard",
    category: "blogs",
  },
];

export const fallbackRoute = { path: "*", component: NotFound };

// NEW: Helper function to get parent dashboard for a route
export const getParentDashboard = (currentPath: string): string | null => {
  const specificRoute = adSpecificRoutes.find((route) => {
    const routePattern = route.path.replace(/:\w+/g, "[^/]+");
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(currentPath);
  });

  return specificRoute?.parentDashboard || null;
};

// NEW: Helper function to get category for current route
export const getRouteCategory = (currentPath: string): string | null => {
  const specificRoute = adSpecificRoutes.find((route) => {
    const routePattern = route.path.replace(/:\w+/g, "[^/]+");
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(currentPath);
  });

  return specificRoute?.category || null;
};
