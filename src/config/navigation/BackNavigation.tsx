import { Button } from "@/components/ui/button";
import { ChevronLeft, Home, AlertTriangle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  selectAuth,
  selectIsAdmin,
} from "@/redux-store/slices/authSlice";
import { useEffect, useState } from "react";

import { getContextualButtonsForPage } from "./buttonConfigs";
import { useRouteNavigation } from "./useRouteNavigation";
import { getSafeNavigationPath, NavigationContext } from "./navigationUtils";
import { canAccessRoute, getRouteAccess } from "./routeAccessConfig";

export const BackNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);

  // Route navigation hook
  const {
    goBack,
    canGoBack,
    getPreviousRoute,
    getCurrentPageType,
    getPageTitle: getRouteTitle,
  } = useRouteNavigation();

  // Local state for access warnings
  const [showAccessWarning, setShowAccessWarning] = useState(false);
  const [accessWarningMessage, setAccessWarningMessage] = useState("");

  // Navigation context
  const navigationContext: NavigationContext = {
    currentPath: location.pathname,
    isAuthenticated,
    isAdmin,
  };

  // Check route access on every navigation
  useEffect(() => {
    const currentPath = location.pathname;
    const { canAccess, reason } = canAccessRoute(
      currentPath,
      isAuthenticated,
      isAdmin
    );

    if (!canAccess) {
      setShowAccessWarning(true);
      setAccessWarningMessage(reason || "Access denied");

      // Auto-redirect after warning
      const timer = setTimeout(() => {
        const safeRoute = getSafeNavigationPath(currentPath, navigationContext);
        if (safeRoute !== currentPath) {
          navigate(safeRoute, { replace: true });
        }
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setShowAccessWarning(false);
      setAccessWarningMessage("");
    }
  }, [
    location.pathname,
    isAuthenticated,
    isAdmin,
    navigate,
    navigationContext,
  ]);

  // Handle logout with route awareness
  const handleLogout = () => {
    dispatch(logout());

    // Navigate to safe route after logout
    const currentPath = location.pathname;
    const routeAccess = getRouteAccess(currentPath);

    if (routeAccess && !routeAccess.isPublic) {
      navigate("/", { replace: true });
    } else {
      navigate("/admin/login");
    }
  };

  // Safe navigation function
  const safeNavigate = (path: string) => {
    const safePath = getSafeNavigationPath(path, navigationContext);

    if (safePath !== path) {
      console.warn(
        `Redirecting from ${path} to ${safePath} due to access restrictions`
      );
    }

    navigate(safePath);
  };

  // Handle sharing
  const handleShare = async (title?: string) => {
    const shareData = {
      title: title || document.title,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        // You can add a toast notification here
        console.log("URL copied to clipboard");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // Button actions object
  const buttonActions = {
    navigate,
    safeNavigate,
    handleLogout,
    handleShare,
  };

  // Get contextual buttons for current page
  const pageType = getCurrentPageType();
  const contextualButtons = getContextualButtonsForPage(
    pageType,
    navigationContext,
    buttonActions
  );

  // Filter buttons based on screen size and priority
  const mobileButtons = contextualButtons
    .filter((btn) => btn.showOnMobile)
    .slice(0, 2);
  const desktopButtons = contextualButtons.slice(0, 3);

  // Get back button info
  const previousRoute = getPreviousRoute();
  const backButtonLabel = previousRoute
    ? getRouteTitle(previousRoute.path)
    : "Dash";
  const showBackButton = canGoBack && pageType !== "home-page";

  // Safe back navigation
  const handleSafeGoBack = () => {
    goBack({ isAuthenticated, isAdmin });
  };

  return (
    <div className='sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm'>
      {/* Access Warning Banner */}
      {showAccessWarning && (
        <div className='bg-red-50 border-b border-red-200 px-4 py-2'>
          <div className='container mx-auto flex items-center gap-2 text-sm text-red-700'>
            <AlertTriangle className='w-4 h-4' />
            <span>{accessWarningMessage}. Redirecting...</span>
            <Button
              size='sm'
              variant='outline'
              onClick={() => safeNavigate("/admin/login")}
              className='ml-auto text-xs'
            >
              Login
            </Button>
          </div>
        </div>
      )}

      <div className='container mx-auto px-4 sm:px-6'>
        <div className='flex items-center justify-between h-16'>
          {/* Left Side - Back Navigation */}
          <div className='flex items-center gap-4'>
            {showBackButton && (
              <Button
                onClick={handleSafeGoBack}
                variant='ghost'
                className='group flex items-center gap-3 px-4 py-2 hover:bg-gradient-to-r hover:from-[#FF9933]/10 hover:to-[#138808]/10 rounded-xl transition-all duration-300'
              >
                <div className='relative'>
                  <ChevronLeft className='w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300' />
                  <div className='absolute inset-0 bg-[#FF9933] rounded-full opacity-0 group-hover:opacity-20 animate-ping'></div>
                </div>
                <span className='font-medium hidden sm:inline'>
                  {backButtonLabel}
                </span>
                <span className='font-medium sm:hidden'>Back</span>
              </Button>
            )}

            {pageType === "home" && (
              <div className='flex items-center gap-2'>
                <Home className='w-5 h-5 text-[#FF9933]' />
                <span className='font-medium text-gray-700'>Home</span>
              </div>
            )}

            {showBackButton && (
              <div className='hidden sm:block w-px h-6 bg-gray-300'></div>
            )}
          </div>

          {/* Right Side - Contextual Action Buttons */}
          <div className='flex items-center gap-3'>
            {/* Desktop buttons */}
            <div className='hidden md:flex items-center gap-3'>
              {desktopButtons.map((button, index) => (
                <Button
                  key={`${button.label}-${index}`}
                  onClick={button.onClick}
                  variant={button.variant || "outline"}
                  size='sm'
                  className={`
                    flex items-center gap-2 transition-all duration-200
                    ${
                      button.variant === "default"
                        ? "bg-gradient-to-r from-[#FF9933] to-[#138808] hover:from-[#FF9933]/90 hover:to-[#138808]/90 text-white shadow-lg"
                        : button.variant === "destructive"
                        ? "hover:bg-red-50 hover:border-red-200 text-red-600 hover:text-red-700"
                        : "hover:bg-[#FF9933]/5 hover:border-[#FF9933]/30"
                    }
                    ${button.className || ""}
                  `}
                >
                  {button.icon}
                  <span className='hidden sm:inline'>{button.label}</span>
                </Button>
              ))}
            </div>

            {/* Mobile buttons */}
            <div className='flex md:hidden items-center gap-2'>
              {mobileButtons.map((button, index) => (
                <Button
                  key={`mobile-${button.label}-${index}`}
                  onClick={button.onClick}
                  variant={button.variant || "outline"}
                  size='sm'
                  className={`
                    flex items-center gap-2 transition-all duration-200
                    ${
                      button.variant === "default"
                        ? "bg-gradient-to-r from-[#FF9933] to-[#138808] hover:from-[#FF9933]/90 hover:to-[#138808]/90 text-white shadow-lg"
                        : button.variant === "destructive"
                        ? "hover:bg-red-50 hover:border-red-200 text-red-600 hover:text-red-700"
                        : "hover:bg-[#FF9933]/5 hover:border-[#FF9933]/30"
                    }
                  `}
                >
                  {button.icon}
                  <span className='sr-only'>{button.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Development Debug Panel */}
      {process.env.NODE_ENV === "development" && (
        <div className='bg-gray-100 px-4 py-2 text-xs text-gray-600 border-t'>
          <div className='container mx-auto flex flex-wrap gap-4'>
            <span>
              <strong>Page:</strong> {pageType}
            </span>
            <span>
              <strong>Auth:</strong>{" "}
              {isAuthenticated ? (isAdmin ? "Admin" : "User") : "Guest"}
            </span>
            <span>
              <strong>Route Access:</strong>{" "}
              {getRouteAccess(location.pathname)?.isPublic
                ? "Public"
                : "Protected"}
            </span>
            <span>
              <strong>Can Go Back:</strong> {canGoBack ? "Yes" : "No"}
            </span>
            {showAccessWarning && (
              <span className='text-red-600'>
                <strong>Warning:</strong> {accessWarningMessage}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
