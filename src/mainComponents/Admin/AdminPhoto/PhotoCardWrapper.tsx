import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import {
  useGetPhotoQuery,
  useDeletePhotoMutation,
} from "@/redux-store/services/photoApi";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "@/redux-store/slices/authSlice";
import PhotoView from "./PhotoView";

import { BackNavigation } from "@/config/navigation/BackNavigation";

const PhotoViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isAdmin = useSelector(selectIsAdmin);

  // API hooks
  const {
    data: photoResponse,
    isLoading,
    error,
    refetch,
  } = useGetPhotoQuery(id!, {
    skip: !id, // Skip the query if no ID is provided
  });

  const [deletePhoto, { isLoading: isDeleting }] = useDeletePhotoMutation();

  // Handle missing ID
  if (!id) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <BackNavigation />
        <Alert variant='destructive' className='max-w-md mx-auto mt-8'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>Photo ID not found in URL</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Handle admin access
  if (!isAdmin) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <BackNavigation />
        <Alert className='max-w-md mx-auto mt-8'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            Admin access required to view this page
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <BackNavigation />
        <div className='flex items-center justify-center min-h-[400px]'>
          <div className='flex flex-col items-center gap-4'>
            <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
            <p className='text-sm text-gray-600'>Loading photo...</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    let errorMessage = "Failed to load photo";

    if ("status" in error) {
      // RTK Query error with status
      const statusError = error as any;
      errorMessage = `Error ${statusError.status}: ${
        statusError.data?.message || "Failed to load photo"
      }`;
    } else if ("message" in error) {
      // Regular error with message
      errorMessage = (error as any).message;
    }

    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <BackNavigation />
        <Alert variant='destructive' className='max-w-md mx-auto mt-8'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
        <div className='flex justify-center mt-4'>
          <button
            onClick={() => refetch()}
            className='px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Handle case where photo is not found
  if (!photoResponse?.data) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <BackNavigation />
        <Alert variant='destructive' className='max-w-md mx-auto mt-8'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>Photo not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleEdit = (photo: any) => {
    navigate(`/admin/edit/${photo._id}`);
  };

  const handleDelete = async (photoId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this photo? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deletePhoto(photoId).unwrap();
      toast.success("Photo deleted successfully");
      navigate("/admin/photoDashboard");
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Failed to delete photo";
      toast.error(`Delete failed: ${errorMessage}`);
      console.error("Delete error:", error);
    }
  };

  const handleHomeRedirect = () => {
    navigate("/admin/photoDashboard");
  };

  return (
    <>
      <BackNavigation />

      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-white p-4'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
          <h1 className='text-3xl font-bold text-slate-800'>View Photo</h1>

          {/* Optional: Add status indicators */}
          <div className='flex items-center gap-2'>
            {isDeleting && (
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <Loader2 className='w-4 h-4 animate-spin' />
                <span>Deleting...</span>
              </div>
            )}
          </div>
        </div>

        <PhotoView
          photoId={id}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBack={handleHomeRedirect}
          showActions={true}
        />
      </div>
    </>
  );
};

export default PhotoViewPage;
