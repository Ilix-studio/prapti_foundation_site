// src/hooks/useRouteNavigation.ts

import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  canGoBackToPreviousRoute,
  getBackDestination,
  getPageTitle,
  getPageType,
} from "./navigationUtils";

export interface RouteHistoryItem {
  path: string;
  timestamp: number;
  title?: string;
  state?: any;
}

export interface UseRouteNavigationReturn {
  // Route history
  routeHistory: RouteHistoryItem[];
  currentIndex: number;

  // Navigation methods
  goBack: (context: { isAuthenticated: boolean; isAdmin: boolean }) => void;
  goForward: () => void;
  goToRoute: (path: string) => void;

  // History checks
  canGoBack: boolean;
  canGoForward: boolean;

  // Utility methods
  getPreviousRoute: () => RouteHistoryItem | null;
  getNextRoute: () => RouteHistoryItem | null;
  clearHistory: () => void;

  // Page type detection
  getCurrentPageType: () => string;
  getPageTitle: (path?: string) => string;
}

export const useRouteNavigation = (
  maxHistorySize: number = 20
): UseRouteNavigationReturn => {
  const location = useLocation();
  const navigate = useNavigate();

  const [routeHistory, setRouteHistory] = useState<RouteHistoryItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // Track route changes
  useEffect(() => {
    const currentPath = location.pathname;
    const timestamp = Date.now();
    const title = getPageTitle(currentPath);

    setRouteHistory((prev) => {
      // Check if we're navigating to a route that already exists in history
      const existingIndex = prev.findIndex((item) => item.path === currentPath);

      if (existingIndex !== -1) {
        // If route exists, update the current index to that position
        setCurrentIndex(existingIndex);
        return prev;
      }

      // If we're not at the end of history (user went back and then to new route)
      // Remove all routes after current index
      const trimmedHistory =
        currentIndex >= 0 && currentIndex < prev.length - 1
          ? prev.slice(0, currentIndex + 1)
          : prev;

      // Don't add if it's the same as the last route
      if (
        trimmedHistory.length > 0 &&
        trimmedHistory[trimmedHistory.length - 1].path === currentPath
      ) {
        return trimmedHistory;
      }

      // Add new route
      const newRoute: RouteHistoryItem = {
        path: currentPath,
        timestamp,
        title,
        state: location.state,
      };

      const newHistory = [...trimmedHistory, newRoute];

      // Keep only last maxHistorySize routes to prevent memory issues
      const finalHistory = newHistory.slice(-maxHistorySize);

      // Update current index
      setCurrentIndex(finalHistory.length - 1);

      return finalHistory;
    });
  }, [location.pathname, location.state, currentIndex, maxHistorySize]);

  // Navigation methods with authentication awareness
  const goBack = useCallback(
    (context: { isAuthenticated: boolean; isAdmin: boolean }) => {
      const previousRoute = getPreviousRoute();

      if (
        previousRoute &&
        canGoBackToPreviousRoute(previousRoute.path, {
          currentPath: location.pathname,
          isAuthenticated: context.isAuthenticated,
          isAdmin: context.isAdmin,
        })
      ) {
        navigate(previousRoute.path, { state: previousRoute.state });
        setCurrentIndex((prev) => prev - 1);
      } else {
        // Navigate to safe destination
        const safeDestination = getBackDestination(
          previousRoute?.path || null,
          {
            currentPath: location.pathname,
            isAuthenticated: context.isAuthenticated,
            isAdmin: context.isAdmin,
          }
        );
        navigate(safeDestination);
      }
    },
    [location.pathname, navigate]
  );

  const goForward = useCallback(() => {
    if (currentIndex < routeHistory.length - 1) {
      const nextRoute = routeHistory[currentIndex + 1];
      navigate(nextRoute.path, { state: nextRoute.state });
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, routeHistory, navigate]);

  const goToRoute = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate]
  );

  // History checks
  const canGoBackFlag = currentIndex > 0 || window.history.length > 1;
  const canGoForwardFlag = currentIndex < routeHistory.length - 1;

  // Utility methods
  const getPreviousRoute = useCallback((): RouteHistoryItem | null => {
    if (currentIndex > 0) {
      return routeHistory[currentIndex - 1];
    }
    return null;
  }, [currentIndex, routeHistory]);

  const getNextRoute = useCallback((): RouteHistoryItem | null => {
    if (currentIndex < routeHistory.length - 1) {
      return routeHistory[currentIndex + 1];
    }
    return null;
  }, [currentIndex, routeHistory]);

  const clearHistory = useCallback(() => {
    setRouteHistory([]);
    setCurrentIndex(-1);
  }, []);

  const getCurrentPageType = useCallback((): string => {
    return getPageType(location.pathname);
  }, [location.pathname]);

  const getPageTitleFunc = useCallback(
    (path?: string): string => {
      return getPageTitle(path || location.pathname);
    },
    [location.pathname]
  );

  return {
    // Route history
    routeHistory,
    currentIndex,

    // Navigation methods
    goBack,
    goForward,
    goToRoute,

    // History checks
    canGoBack: canGoBackFlag,
    canGoForward: canGoForwardFlag,

    // Utility methods
    getPreviousRoute,
    getNextRoute,
    clearHistory,

    // Page type detection
    getCurrentPageType,
    getPageTitle: getPageTitleFunc,
  };
};
