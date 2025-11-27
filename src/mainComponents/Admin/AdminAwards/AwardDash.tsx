import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Edit,
  Trash2,
  Award,
  Loader2,
  AlertCircle,
  Eye,
  Image as ImageIcon,
} from "lucide-react";
import { selectAuth, selectIsAdmin } from "@/redux-store/slices/authSlice";
import {
  useDeleteAwardPostMutation,
  useGetAwardsQuery,
} from "@/redux-store/services/awardApi";
import { AwardPost, getAwardCategoryName } from "@/types/award.types";
import { BackNavigation } from "@/config/navigation/BackNavigation";

const AwardDash: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);

  const { data: awards, isLoading, error } = useGetAwardsQuery({});

  const [deleteAward, { isLoading: isDeleting }] = useDeleteAwardPostMutation();

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className='container mx-auto p-6'>
        <BackNavigation />
        <Alert className='max-w-md mx-auto mt-8'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>Admin access required.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleDeleteClick = (awardId: string) => {
    setShowDeleteConfirm(awardId);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async (awardId: string) => {
    try {
      setDeletingId(awardId);
      await deleteAward(awardId).unwrap();
      setShowDeleteConfirm(null);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      console.error("Failed to delete award:", err);
      setDeleteError(
        error.data?.message || "Failed to delete award. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
    setDeleteError(null);
  };

  const handleView = (awardId: string) => {
    navigate(`/awards/${awardId}`);
  };

  const handleEdit = (awardId: string) => {
    navigate(`/admin/editAward/${awardId}`);
  };

  if (error) {
    return (
      <div className='container mx-auto p-6'>
        <BackNavigation />
        <div className='flex items-center justify-center h-64'>
          <div className='text-center'>
            <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              Error Loading Awards
            </h3>
            <p className='text-gray-600 mb-4'>
              Failed to load awards. Please try again.
            </p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  const awardsList = (awards as AwardPost[]) || [];

  return (
    <>
      <BackNavigation />
      <div className='container mx-auto p-6 space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
              <Award className='h-6 w-6 text-orange-500' />
              Awards Dashboard
            </h1>
            <p className='text-gray-600'>
              Manage and organize your awards and achievements
            </p>
          </div>
          <Link to='/admin/addAwards'>
            <Button className='bg-gray-500 hover:bg-orange-500 text-white'>
              <Plus className='h-5 w-5 mr-2' />
              Add New Award
            </Button>
          </Link>
        </div>

        {/* Error Alert */}
        {deleteError && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>{deleteError}</AlertDescription>
          </Alert>
        )}

        {/* Statistics Card */}
        {awardsList.length > 0 && (
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center gap-4'>
                <div className='bg-orange-100 p-3 rounded-full'>
                  <Award className='h-6 w-6 text-orange-500' />
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Total awards</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {awardsList.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Awards Table */}
        <Card>
          <CardContent className='p-0'>
            {isLoading ? (
              <div className='flex items-center justify-center h-64'>
                <Loader2 className='w-8 h-8 animate-spin text-orange-500' />
              </div>
            ) : awardsList.length > 0 ? (
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-gray-50 border-b border-gray-200'>
                    <tr>
                      <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                        Image
                      </th>
                      <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                        Title
                      </th>
                      <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                        Category
                      </th>
                      <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                        Created
                      </th>
                      <th className='px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-100'>
                    {awardsList.map((award) => (
                      <tr
                        key={award._id}
                        className='hover:bg-gray-50 transition-all duration-200'
                      >
                        <td className='px-6 py-4'>
                          {award.images?.length > 0 ? (
                            <img
                              src={award.images[0].src}
                              alt={award.images[0].alt || award.title}
                              className='w-16 h-16 object-cover rounded-md'
                            />
                          ) : (
                            <div className='w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center'>
                              <ImageIcon className='h-6 w-6 text-gray-400' />
                            </div>
                          )}
                        </td>
                        <td className='px-6 py-4'>
                          <div className='max-w-sm'>
                            <div className='text-base font-semibold text-gray-900 truncate'>
                              {award.title}
                            </div>
                            {award.description && (
                              <p className='text-sm text-gray-500 truncate max-w-xs'>
                                {award.description}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <span className='px-3 py-1 inline-flex text-sm font-medium rounded-full bg-orange-100 text-orange-600 border border-orange-200'>
                            {getAwardCategoryName(award.category)}
                          </span>
                        </td>
                        <td className='px-6 py-4 text-base text-gray-600'>
                          {new Date(award.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </td>
                        <td className='px-6 py-4 text-right'>
                          {showDeleteConfirm === award._id ? (
                            <div className='flex justify-end items-center gap-4'>
                              <span className='text-base text-gray-700 font-medium'>
                                Confirm delete?
                              </span>
                              <div className='flex gap-2'>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  className='text-red-600 border-red-300 hover:bg-red-50'
                                  onClick={() => handleDeleteConfirm(award._id)}
                                  disabled={
                                    isDeleting && deletingId === award._id
                                  }
                                >
                                  {isDeleting && deletingId === award._id ? (
                                    <Loader2 className='h-4 w-4 animate-spin mr-2' />
                                  ) : null}
                                  Yes
                                </Button>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={handleDeleteCancel}
                                  disabled={
                                    isDeleting && deletingId === award._id
                                  }
                                >
                                  No
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className='flex justify-end gap-2'>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                                onClick={() => handleView(award._id)}
                                title='View Award'
                              >
                                <Eye className='h-4 w-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='text-amber-600 hover:text-amber-700 hover:bg-amber-50'
                                onClick={() => handleEdit(award._id)}
                                title='Edit Award'
                              >
                                <Edit className='h-4 w-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='text-red-600 hover:text-red-700 hover:bg-red-50'
                                onClick={() => handleDeleteClick(award._id)}
                                title='Delete Award'
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className='p-12 text-center'>
                <Award className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  No awards found
                </h3>
                <p className='text-gray-600 mb-4'>
                  Get started by adding your first award to showcase your
                  achievements.
                </p>
                <Link to='/admin/addAwards'>
                  <Button className='bg-orange-400 hover:bg-orange-500 text-white'>
                    <Plus className='h-5 w-5 mr-2' />
                    Add Award Post
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AwardDash;
