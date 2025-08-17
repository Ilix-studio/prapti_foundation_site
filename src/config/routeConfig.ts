import { lazy } from "react";
// const AboutUs = lazy(() => import(""))

// Immediate load components (critical for first page load)
import Home from "../Home";

// Immediate two
const AboutUs = lazy(() => import("@/mainComponents/AboutUs"));
const ContactUs = lazy(() => import("@/mainComponents/ContactUs/ContactUs"));
const LoginUser = lazy(() => import("../mainComponents/Admin/LoginUser"));
// Public Routes
const GalleryPage = lazy(() => import("@/mainComponents/Gallery/GalleryPage"));
const ViewPhotoId = lazy(() => import("@/mainComponents/Gallery/ViewPhotoId"));
const ViewVideoId = lazy(() => import("@/mainComponents/Gallery/ViewVideoId"));

const AdoptionForm = lazy(() => import("@/mainComponents/Adopt/AdoptionForm"));
const ReportPage = lazy(
  () => import("@/mainComponents/ReportAbout/ReportPage")
);
const SupportUs = lazy(() => import("@/mainComponents/SupportUs"));
const SeeBlogs = lazy(
  () => import("@/mainComponents/AdminBlogs/SmallBlogUI/SeeBlogs")
);

//
const ViewMessage = lazy(
  () => import("@/mainComponents/Admin/AdminMessage/ViewMessage")
);

const BlogPostPage = lazy(
  () => import("@/mainComponents/AdminBlogs/SmallBlogUI/BlogPost")
);
const VolunteerPage = lazy(() => import("@/mainComponents/Volunteer/Volunter"));
const VolunteerDetail = lazy(
  () => import("@/mainComponents/Volunteer/VolunteerDetail")
);
const AddBlogPost = lazy(
  () => import("@/mainComponents/AdminBlogs/AddBlogForm")
);
const EditBlogPost = lazy(
  () => import("@/mainComponents/AdminBlogs/EditBlogPost")
);
const VolunteerDash = lazy(
  () => import("@/mainComponents/Volunteer/VolunteerDash")
);
const BlogsDash = lazy(
  () => import("@/mainComponents/AdminBlogs/SmallBlogUI/BlogsDash")
);
const WriteTestimonial = lazy(
  () => import("@/mainComponents/Testimonials/WriteTestimonial")
);

import NotFound from "../mainComponents/NotFound";
import AdminSeeBlog from "@/mainComponents/AdminBlogs/SmallBlogUI/AdminSeeBlog";

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
const TotalImpactDashboard = lazy(
  () => import("@/mainComponents/Admin/AdminImpact/Impact")
);
const TestimonialDash = lazy(
  () => import("@/mainComponents/Testimonials/TestimonialDash")
);
const ViewAllMessage = lazy(
  () => import("@/mainComponents/Admin/AdminMessage/ViewAllMessage")
);

// Route configuration
export const immediateRoute = [{ path: "/", component: Home }];
export const immediateRouteTwo = [
  { path: "/about", component: AboutUs },
  { path: "/contact", component: ContactUs },
  { path: "/admin/login", component: LoginUser },
];

export const publicRoutes = [
  { path: "/gallery", component: GalleryPage },
  { path: "/view/photo/:id", component: ViewPhotoId },
  { path: "/view/video/:id", component: ViewVideoId },
  { path: "/adopt", component: AdoptionForm },
  { path: "/report", component: ReportPage },
  { path: "/support", component: SupportUs },
  { path: "/blog", component: SeeBlogs },
  { path: "/blog/:id", component: BlogPostPage }, // create a component for admin to read blog
  { path: "/volunteer", component: VolunteerPage },
  { path: "/write-testimonial", component: WriteTestimonial },
];

export const adminRoutes = [
  { path: "/admin/dashboard", component: NewDashAdmin },
  { path: "/admin/categories", component: CategoryManager },
  { path: "/admin/photoDashboard", component: PhotoDash },
  { path: "/admin/videoDashboard", component: VideoDash },
  { path: "/admin/blogsDashboard", component: BlogsDash },
  { path: "/admin/volunteerDashboard", component: VolunteerDash },
  { path: "/admin/impact", component: TotalImpactDashboard },
  { path: "/admin/testimonials", component: TestimonialDash },
  { path: "/admin/messages", component: ViewAllMessage },
];

// NEW: Admin specific routes with dashboard mapping
export interface AdSpecificRoute {
  path: string;
  component: React.ComponentType;
  parentDashboard: string; // The dashboard this route should go back to
  category: "photo" | "video" | "blogs" | "message" | "volunteer";
}

export const adSpecificRoutes: AdSpecificRoute[] = [
  // Specific routes - go back to Specific Dash
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

  // Blogs specific routes - go back to Blogs Dashboard
  {
    path: "/admin/blog/new",
    component: AddBlogPost,
    parentDashboard: "/admin/blogsDashboard",
    category: "blogs",
  },
  {
    path: "/admin/blog/:id",
    component: AdminSeeBlog,
    parentDashboard: "/admin/blogsDashboard",
    category: "blogs",
  },

  {
    path: "/admin/blog/edit/:id",
    component: EditBlogPost,
    parentDashboard: "/admin/blogsDashboard",
    category: "blogs",
  },
  // Volunteer specific routes - go back to Volunteer Dashboard
  {
    path: "/admin/volunteer/:id",
    component: VolunteerDetail,
    parentDashboard: "/admin/volunteerDashboard",
    category: "volunteer",
  },
  //Message specific routes - go back to message Dashboard
  {
    path: "/admin/messages/:id",
    component: ViewMessage,
    parentDashboard: "/admin/messages",
    category: "message",
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
