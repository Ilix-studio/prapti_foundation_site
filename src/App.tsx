import { Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";

import { Toaster } from "react-hot-toast";

// Import route configurations
import {
  immediateRoute,
  immediateRouteTwo,
  publicRoutes,
  adSpecificRoutes,
  fallbackRoute,
  adminRoutesDash,
} from "./config/routeConfig";
import {
  createAdminRoute,
  createAdSpecificRoute,
  createImmediateRoute,
  createImmediateRouteTwo,
  createPublicRoute,
} from "./config/routeHelpers";

function App() {
  const location = useLocation();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <>
      <Toaster
        position='top-right'
        reverseOrder={false}
        gutter={8}
        containerClassName=''
        containerStyle={{
          top: 20,
          left: 20,
          bottom: 20,
          right: 20,
        }}
        toastOptions={{
          // Default options for all toasts
          duration: 3000,
          style: {
            background: "#fff",
            color: "#363636",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            fontSize: "14px",
            maxWidth: "420px",
            padding: "12px 16px",
            fontFamily: "system-ui, -apple-system, sans-serif",
          },
          // Specific styles for different toast types
          success: {
            duration: 4000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
            style: {
              border: "1px solid #10b981",
              background: "#f0fdf4",
              color: "#065f46",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
            style: {
              border: "1px solid #ef4444",
              background: "#fef2f2",
              color: "#991b1b",
            },
          },
          loading: {
            duration: Infinity,
            style: {
              border: "1px solid #3b82f6",
              background: "#eff6ff",
              color: "#1e40af",
            },
          },
        }}
      />

      <Routes>
        {/* Step 1: Immediate routes (no lazy loading) */}
        {immediateRoute.map(({ path, component }) =>
          createImmediateRoute(path, component)
        )}
        {immediateRouteTwo.map(({ path, component }) =>
          createImmediateRouteTwo(path, component)
        )}

        {/* Step 2: Public routes (with lazy loading) */}
        {publicRoutes.map(({ path, component }) =>
          createPublicRoute(path, component)
        )}

        {/* Step 3: Admin routes (with protection + lazy loading) */}
        {adminRoutesDash.map(({ path, component }) =>
          createAdminRoute(path, component)
        )}

        {/* Step 4: Admin Specific Dashboard routes (with protection + lazy loading) */}
        {adSpecificRoutes.map(({ path, component }) =>
          createAdSpecificRoute(path, component)
        )}

        {/* Step 4: Fallback route */}
        {createImmediateRoute(fallbackRoute.path, fallbackRoute.component)}
      </Routes>
    </>
  );
}

export default App;
