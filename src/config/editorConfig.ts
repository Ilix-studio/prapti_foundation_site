import { lazy } from "react";

// ── Editor login + dashboard ──────────────────────────────
const EditorLogin = lazy(() => import("@/mainComponents/EditorX/EditorLogin"));
const EditorDashboard = lazy(
  () => import("@/mainComponents/EditorX/EditorDashboard"),
);
const EditorAwardManager = lazy(
  () => import("@/mainComponents/EditorX/EditorAwardManager"),
);
const EditorBlogManager = lazy(
  () => import("@/mainComponents/EditorX/EditorBlogManager"),
);
const EditorCategoryManager = lazy(
  () => import("@/mainComponents/EditorX/EditorCategoryManager"),
);
const EditorPhotoManager = lazy(
  () => import("@/mainComponents/EditorX/EditorPhotoManager"),
);
const EditorAddPhoto = lazy(
  () => import("@/mainComponents/EditorX/PhotoE/EditorAddPhoto"),
);
const EditorEditPhoto = lazy(
  () => import("@/mainComponents/EditorX/PhotoE/EditorEditPhoto"),
);
const EditorViewPhoto = lazy(
  () => import("@/mainComponents/EditorX/PhotoE/EditorViewPhoto"),
);
const EditorVideoManager = lazy(
  () => import("@/mainComponents/EditorX/EditorVideoManager"),
);
const EditorAddVideo = lazy(
  () => import("@/mainComponents/EditorX/VideoE/EditorAddVideo"),
);
const EditorEditVideoById = lazy(
  () => import("@/mainComponents/EditorX/VideoE/EditorEditVideoById"),
);
const EditorPlayVideo = lazy(
  () => import("@/mainComponents/EditorX/VideoE/EditorPlayVideo"),
);
const EditorVolunteerManager = lazy(
  () => import("@/mainComponents/EditorX/EditorVolunteerManager"),
);
// Editor login is public (like /admin/login)
export const editorPublicRoutes = [
  { path: "/editor/login", component: EditorLogin },
];

// Editor dashboards — same lazy components admins use.
export const editorRoutesDash = [
  { path: "/editor/dashboard", component: EditorDashboard },
  { path: "/editor/awards", component: EditorAwardManager },
  { path: "/editor/blogposts", component: EditorBlogManager },
  { path: "/editor/categories", component: EditorCategoryManager },
  // Photos — static/specific paths before the bare ":id" view route.
  { path: "/editor/photos", component: EditorPhotoManager },
  { path: "/editor/photos/add", component: EditorAddPhoto },
  { path: "/editor/photos/edit/:id", component: EditorEditPhoto },
  { path: "/editor/photos/:id", component: EditorViewPhoto },
  //
  { path: "/editor/videos", component: EditorVideoManager },
  { path: "/editor/videos/add", component: EditorAddVideo },
  { path: "/editor/videos/edit/:id", component: EditorEditVideoById },
  { path: "/editor/videos/:id", component: EditorPlayVideo },
  //
  { path: "/editor/volunteers", component: EditorVolunteerManager },
];
