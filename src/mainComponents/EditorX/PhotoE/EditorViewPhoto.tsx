import React, { useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import { useDeletePhotoMutation } from "@/redux-store/services/photoApi";
import {
  selectAuth,
  selectIsAdmin,
  selectIsEditor,
} from "@/redux-store/slices/authSlice";
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

import PhotoView from "@/mainComponents/Admin/AdminPhoto/PhotoView";
import TopBar from "../TopBar";

const PHOTOS_ROUTE = "/editor/photos";

const EditorViewPhoto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);
  const isEditor = useSelector(selectIsEditor);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletePhoto, { isLoading: isDeleting }] = useDeletePhotoMutation();

  if (!isAuthenticated || (!isEditor && !isAdmin)) {
    return <Navigate to='/editor/login' />;
  }
  if (!id) {
    return <Navigate to={PHOTOS_ROUTE} />;
  }

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await deletePhoto(deleteId).unwrap();
      toast.success(res.message || "Photo deleted");
      navigate(PHOTOS_ROUTE);
    } catch (e: any) {
      toast.error(e?.data?.message || e?.message || "Failed to delete photo");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <TopBar />
      <div className='container mx-auto p-6'>
        <PhotoView
          photoId={id}
          showActions
          onBack={() => navigate(PHOTOS_ROUTE)}
          onEdit={(photo) => navigate(`${PHOTOS_ROUTE}/edit/${photo._id}`)}
          onDelete={(photoId) => setDeleteId(photoId)}
        />
      </div>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => {
          if (!o) setDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Photo</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the photo. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className='bg-red-600 hover:bg-red-700'
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EditorViewPhoto;
