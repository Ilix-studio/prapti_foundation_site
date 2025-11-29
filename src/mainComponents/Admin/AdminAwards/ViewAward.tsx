import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
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
import { BackNavigation } from "@/config/navigation/BackNavigation";

const ViewAward = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAdmin = useSelector(selectIsAdmin);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: award, isLoading, error } = useGetAwardByIdQuery(id || "");
  const [deleteAward, { isLoading: isDeleting }] = useDeleteAwardPostMutation();

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
        error?.data?.message || "Failed to delete award. Please try again."
      );
      console.error("Delete error:", error);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/awards/edit/${award._id}`);
  };

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
            <Card className='overflow-hidden'>
              {award.images && award.images.length > 0 && (
                <div className='relative h-96 bg-gray-200 overflow-hidden'>
                  <img
                    src={award.images[0].src}
                    alt={award.images[0].alt}
                    className='w-full h-full object-cover'
                  />
                </div>
              )}

              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <CardTitle className='text-3xl mb-2'>
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
                <div>
                  <h3 className='text-lg font-semibold mb-3'>Description</h3>
                  <p className='text-gray-700 leading-relaxed whitespace-pre-wrap'>
                    {award.description}
                  </p>
                </div>

                {award.images && award.images.length > 1 && (
                  <div>
                    <h3 className='text-lg font-semibold mb-3'>Gallery</h3>
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                      {award.images.map((image: any, index: number) => (
                        <div
                          key={index}
                          className='relative h-32 bg-gray-200 rounded-lg overflow-hidden'
                        >
                          <img
                            src={image.src}
                            alt={image.alt}
                            className='w-full h-full object-cover hover:scale-105 transition-transform'
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
