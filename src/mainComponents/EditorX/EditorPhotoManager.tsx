import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useGetPhotosQuery,
  useDeletePhotoMutation,
} from "@/redux-store/services/photoApi";

import { Photo } from "@/types/photo.types";
import { getPhotoCategoryName } from "@/mainComponents/Gallery/galleryHelper";
import {
  selectAuth,
  selectIsAdmin,
  selectIsEditor,
} from "@/redux-store/slices/authSlice";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Camera,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import TopBar from "./TopBar";

const PHOTOS_ROUTE = "/editor/photos";

const EditorPhotoManager: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);
  const isEditor = useSelector(selectIsEditor);

  const [deleteTarget, setDeleteTarget] = useState<Photo | null>(null);

  const {
    data: photosResp,
    isLoading,
    error,
  } = useGetPhotosQuery({
    page: 1,
    limit: 100,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [deletePhoto, { isLoading: isDeleting }] = useDeletePhotoMutation();

  if (!isAuthenticated || (!isEditor && !isAdmin)) {
    return (
      <div className='container mx-auto p-6'>
        <TopBar />
        <Alert className='max-w-md mx-auto mt-8'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>Editor access required.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const photoList: Photo[] = photosResp?.data?.photos ?? [];

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await deletePhoto(deleteTarget._id).unwrap();
      toast.success(res?.message || "Photo deleted");
    } catch (e: any) {
      toast.error(e?.data?.message || e?.message || "Failed to delete photo");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <TopBar />
      <div className='container mx-auto px-4 py-6'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-2'>
            <Camera className='w-6 h-6 text-[#FF9933]' />
            <h1 className='text-2xl font-bold'>Manage Photos</h1>
            <Badge variant='outline' className='ml-2'>
              {photoList.length}
            </Badge>
          </div>
          <Button
            onClick={() => navigate(`${PHOTOS_ROUTE}/add`)}
            className='bg-[#FF9933] hover:bg-[#FF9933]/90'
          >
            <Plus className='w-4 h-4 mr-2' />
            Add Photo
          </Button>
        </div>

        {/* States */}
        {isLoading ? (
          <div className='flex items-center justify-center py-16'>
            <Loader2 className='w-6 h-6 animate-spin text-[#FF9933]' />
          </div>
        ) : error ? (
          <Card>
            <CardContent className='flex flex-col items-center gap-3 py-12'>
              <AlertCircle className='w-8 h-8 text-red-500' />
              <p className='text-muted-foreground'>Failed to load photos.</p>
            </CardContent>
          </Card>
        ) : photoList.length === 0 ? (
          <Card>
            <CardContent className='flex flex-col items-center gap-2 py-12'>
              <Camera className='w-8 h-8 text-muted-foreground' />
              <p className='text-muted-foreground'>No photos yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {photoList.map((photo) => {
              const img = photo.images?.[0];
              return (
                <Card key={photo._id} className='overflow-hidden'>
                  <button
                    type='button'
                    onClick={() => navigate(`${PHOTOS_ROUTE}/${photo._id}`)}
                    className='block w-full aspect-video bg-gray-100 text-left'
                    title='View photo'
                  >
                    {img?.src ? (
                      <img
                        src={img.src}
                        alt={img.alt || photo.title}
                        loading='lazy'
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center'>
                        <ImageIcon className='w-8 h-8 text-gray-300' />
                      </div>
                    )}
                  </button>
                  <CardContent className='p-4 space-y-3'>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <Badge className='text-orange-500 border-orange-200 bg-orange-50'>
                        {getPhotoCategoryName(photo.category)}
                      </Badge>
                      {photo.images?.length > 1 && (
                        <Badge variant='outline'>
                          {photo.images.length} images
                        </Badge>
                      )}
                    </div>
                    <h3 className='font-semibold line-clamp-1'>
                      {photo.title}
                    </h3>
                    {photo.description && (
                      <p className='text-sm text-muted-foreground line-clamp-2'>
                        {photo.description}
                      </p>
                    )}
                    <div className='flex items-center gap-2 pt-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => navigate(`${PHOTOS_ROUTE}/${photo._id}`)}
                      >
                        <Eye className='w-4 h-4 mr-1' />
                        View
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() =>
                          navigate(`${PHOTOS_ROUTE}/edit/${photo._id}`)
                        }
                      >
                        <Edit className='w-4 h-4 mr-1' />
                        Edit
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        className='text-red-600 hover:text-red-700'
                        onClick={() => setDeleteTarget(photo)}
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Delete Confirm */}
        <AlertDialog
          open={!!deleteTarget}
          onOpenChange={(o) => {
            if (!o) setDeleteTarget(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Photo</AlertDialogTitle>
              <AlertDialogDescription>
                Delete <strong>{deleteTarget?.title}</strong>? This cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className='bg-red-600 hover:bg-red-700'
              >
                {isDeleting && (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                )}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default EditorPhotoManager;
