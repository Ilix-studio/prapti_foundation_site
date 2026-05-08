import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useCallback, useEffect } from "react";
import { Loader2, Edit, Trash2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetAwardByIdQuery,
  useDeleteAwardPostMutation,
} from "@/redux-store/services/awardApi";
import { selectIsAdmin } from "@/redux-store/slices/authSlice";
import { getAwardCategoryName } from "@/types/award.types";
import type { PhotoImage } from "@/types/photo.types";
import { BackNavigation } from "@/config/navigation/BackNavigation";

const ViewAward = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAdmin = useSelector(selectIsAdmin);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { data: award, isLoading, error } = useGetAwardByIdQuery(id || "");
  const [deleteAward, { isLoading: isDeleting }] = useDeleteAwardPostMutation();

  // Reset selected index if images array shrinks (e.g. after refetch)
  useEffect(() => {
    if (award?.images && selectedIndex >= award.images.length) {
      setSelectedIndex(0);
    }
  }, [award?.images, selectedIndex]);

  const handleSelectImage = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleKeyNav = useCallback((e: React.KeyboardEvent, total: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % total);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + total) % total);
    }
  }, []);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Loader2 className='h-8 w-8 text-orange-500 animate-spin' />
        <span className='ml-2'>Loading award...</span>
      </div>
    );
  }

  if (error || !award) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='bg-red-50 text-red-500 p-4 rounded-md flex items-center gap-2'>
          <AlertCircle className='h-5 w-5' />
          <span>Error loading award</span>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteAward(award._id).unwrap();
      toast.success("Award deleted successfully");
      navigate("/admin/awardDash");
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to delete award. Please try again.",
      );
      console.error("Delete error:", error);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/awards/edit/${award._id}`);
  };

  const activeImage =
    award.images && award.images.length > 0
      ? (award.images[selectedIndex] ?? award.images[0])
      : null;

  return (
    <>
      <BackNavigation />
      <div className='min-h-screen bg-gray-50'>
        <div className='bg-white'>
          <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <h1 className='text-2xl font-bold'>Award Details</h1>
            </div>
            {isAdmin && (
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleEdit}
                  className='gap-2'
                >
                  <Edit className='h-4 w-4' />
                  Edit
                </Button>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => setShowDeleteConfirm(true)}
                  className='gap-2'
                >
                  <Trash2 className='h-4 w-4' />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>

        <main className='container mx-auto px-4 py-8'>
          <div className='max-w-4xl mx-auto'>
            <Card className='overflow-hidden '>
              {activeImage && (
                <div className='relative h-auto bg-gray-200 overflow-hidden '>
                  <img
                    src={activeImage.src}
                    alt={activeImage.alt}
                    className='w-full  h-auto object-cover transition-opacity duration-200'
                  />
                </div>
              )}

              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <CardTitle className='text-xl mb-2'>
                      {award.title}
                    </CardTitle>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded'>
                        {getAwardCategoryName(award.category)}
                      </span>
                      <span className='text-xs text-gray-400'>
                        {new Date(award.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className='space-y-6'>
                {award.images && award.images.length > 1 && (
                  <div>
                    <h3 className='text-l font-semibold mb-3'>Gallery</h3>
                    <div
                      role='listbox'
                      aria-label='Award image gallery'
                      tabIndex={0}
                      onKeyDown={(e) => handleKeyNav(e, award.images.length)}
                      className='grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 focus:outline-none'
                    >
                      {award.images.map((image: PhotoImage, index: number) => {
                        const isActive = index === selectedIndex;
                        return (
                          <button
                            type='button'
                            key={image.cloudinaryPublicId || index}
                            role='option'
                            aria-selected={isActive}
                            aria-label={`View image ${index + 1}`}
                            onClick={() => handleSelectImage(index)}
                            className={`relative aspect-square w-full rounded-md overflow-hidden bg-gray-200 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                              isActive ? "ring-2 ring-orange-500" : ""
                            }`}
                          >
                            <img
                              src={image.src}
                              alt={image.alt}
                              loading='lazy'
                              className='w-full h-full object-cover hover:scale-105 transition-transform'
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div>
                  <h3 className='text-l font-semibold mb-3'>Description</h3>
                  <p className='text-gray-700 leading-relaxed whitespace-pre-wrap'>
                    {award.description}
                  </p>
                </div>

                <div className='pt-4 border-t'>
                  <p className='text-xs text-gray-500'>
                    Last updated: {new Date(award.updatedAt).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
              <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                <Card className='w-full max-w-sm'>
                  <CardHeader>
                    <CardTitle>Delete Award</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <p className='text-gray-600'>
                      Are you sure you want to delete this award? This action
                      cannot be undone.
                    </p>
                    <div className='flex gap-3 justify-end'>
                      <Button
                        variant='outline'
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={isDeleting}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant='destructive'
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default ViewAward;
