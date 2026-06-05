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
const EditorVideoManager = lazy(
  () => import("@/mainComponents/EditorX/EditorVideoManager"),
);
const EditorEditVideo = lazy(
  () => import("@/mainComponents/EditorX/EditorEditVideo"),
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
  { path: "/editor/photos", component: EditorPhotoManager },
  { path: "/editor/videos", component: EditorVideoManager },
  { path: "/editor/videos/edit/:id", component: EditorEditVideo },
  { path: "/editor/volunteers", component: EditorVolunteerManager },
];
