import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth, selectIsEditor } from "@/redux-store/slices/authSlice";

interface EditorRouteProps {
  children: ReactNode;
  fallbackPath?: string;
}

// Allows Editor OR Super-Admin. Admins can traverse /editor/* per design.
const EditorRoute = ({
  children,
  fallbackPath = "/editor/login",
}: EditorRouteProps) => {
  const location = useLocation();
  const { isAuthenticated } = useSelector(selectAuth);
  const isEditor = useSelector(selectIsEditor);

  if (!isAuthenticated) {
    return (
      <Navigate to={fallbackPath} state={{ from: location.pathname }} replace />
    );
  }

  if (!isEditor) {
    // Authenticated but neither role -> bounce home.
    return <Navigate to='/editor/login' replace />;
  }

  return <>{children}</>;
};

export default EditorRoute;
