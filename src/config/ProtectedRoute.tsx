import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth, selectIsAdmin } from "@/redux-store/slices/authSlice";

interface ProtectedRouteProps {
  children: ReactNode;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
  fallbackPath?: string;
}

const ProtectedRoute = ({
  children,
  requiresAuth = false,
  requiresAdmin = false,
  fallbackPath = "/admin/login",
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);

  // If no protection required, render children
  if (!requiresAuth && !requiresAdmin) {
    return <>{children}</>;
  }

  // Check authentication requirement
  if (requiresAuth && !isAuthenticated) {
    return (
      <Navigate to={fallbackPath} state={{ from: location.pathname }} replace />
    );
  }

  // Check admin requirement
  if (requiresAdmin && !isAdmin) {
    return <Navigate to='/' replace />;
  }

  // All checks passed, render children
  return <>{children}</>;
};

export default ProtectedRoute;
