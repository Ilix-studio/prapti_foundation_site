// src/components/routeHelpers.tsx

import { Suspense } from "react";
import { Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ProtectedRoute from "./ProtectedRoute";

// Loading component
export const LoadingSpinner = () => (
  <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center'>
    <div className='flex flex-col items-center gap-4'>
      <Loader2 className='w-8 h-8 animate-spin text-[#FF9933]' />
      <p className='text-sm text-gray-600'>Loading...</p>
    </div>
  </div>
);

// Create immediate route (no lazy loading)
export const createImmediateRoute = (
  path: string,
  Component: React.ComponentType
) => <Route key={path} path={path} element={<Component />} />;

// Create public route (with lazy loading)
export const createPublicRoute = (
  path: string,
  Component: React.ComponentType
) => (
  <Route
    key={path}
    path={path}
    element={
      <Suspense fallback={<LoadingSpinner />}>
        <Component />
      </Suspense>
    }
  />
);

// Create protected admin route (with lazy loading + protection)
export const createAdminRoute = (
  path: string,
  Component: React.ComponentType
) => (
  <Route
    key={path}
    path={path}
    element={
      <ProtectedRoute requiresAuth={true} requiresAdmin={true}>
        <Suspense fallback={<LoadingSpinner />}>
          <Component />
        </Suspense>
      </ProtectedRoute>
    }
  />
);

export const createAdSpecificRoute = (
  path: string,
  Component: React.ComponentType
) => (
  <Route
    key={path}
    path={path}
    element={
      <ProtectedRoute requiresAuth={true} requiresAdmin={true}>
        <Suspense fallback={<LoadingSpinner />}>
          <Component />
        </Suspense>
      </ProtectedRoute>
    }
  />
);
