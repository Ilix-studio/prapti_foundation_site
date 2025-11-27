import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetRescuePostsQuery,
  useDeleteRescuePostMutation,
} from "@/redux-store/services/rescueApi";
import { selectIsAdmin } from "@/redux-store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Trash2,
  AlertCircle,
  Eye,
  Edit,
  Plus,
  Search,
  Grid3X3,
  List,
} from "lucide-react";
import toast from "react-hot-toast";
import { BackNavigation } from "@/config/navigation/BackNavigation";

interface RescuePost {
  _id: string;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  createdAt: string;
  updatedAt: string;
}

const RescueDash = () => {
  const navigate = useNavigate();
  const isAdmin = useSelector(selectIsAdmin);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const limit = 12;

  const {
    data: rescueData,
    isLoading,
    error,
  } = useGetRescuePostsQuery({ page, limit, search });

  const [deleteRescue, { isLoading: isDeleting }] =
    useDeleteRescuePostMutation();

  if (!isAdmin) {
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

  if (error) {
    return (
      <div className='container mx-auto p-6'>
        <BackNavigation />
        <Alert className='max-w-md mx-auto mt-8' variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            Failed to load rescue posts. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteId) return;

    try {
      setDeletingId(confirmDeleteId);
      await deleteRescue(confirmDeleteId).unwrap();
      toast.success("Rescue post deleted successfully");
      setConfirmDeleteId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete rescue post");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDeleteId(null);
  };

  const handleView = (id: string) => {
    navigate(`/admin/rescue/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/editRescue/${id}`);
  };

  const rescuePosts = rescueData?.data || [];
  const pagination = rescueData?.pagination;

  return (
    <>
      <BackNavigation />

      <div className='container mx-auto p-6 space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Rescue Posts Dashboard
            </h1>
            <p className='text-gray-600'>
              Manage rescue stories and transformations
            </p>
          </div>
          <Button
            onClick={() => navigate("/admin/addRescue")}
            className='bg-blue-600 hover:bg-blue-700'
          >
            <Plus className='h-5 w-5 mr-2' />
            Add Rescue Post
          </Button>
        </div>

        {/* Stats Card */}
        {pagination && (
          <Card>
            <CardContent className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='text-center'>
                  <h3 className='text-2xl font-bold text-blue-600'>
                    {pagination.total}
                  </h3>
                  <p className='text-sm text-gray-600'>Total Rescue Posts</p>
                </div>
                <div className='text-center'>
                  <h3 className='text-2xl font-bold text-green-600'>
                    {pagination.pages}
                  </h3>
                  <p className='text-sm text-gray-600'>Pages</p>
                </div>
                <div className='text-center'>
                  <h3 className='text-2xl font-bold text-purple-600'>
                    {pagination.page}
                  </h3>
                  <p className='text-sm text-gray-600'>Current Page</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <Card>
          <CardContent className='p-6'>
            <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
              <div className='flex-1 w-full'>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                  <Input
                    placeholder='Search rescue posts...'
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className='pl-10'
                  />
                </div>
              </div>
              <Button
                variant='outline'
                size='icon'
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
              >
                {viewMode === "grid" ? (
                  <List className='w-4 h-4' />
                ) : (
                  <Grid3X3 className='w-4 h-4' />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className='flex justify-center items-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && rescuePosts.length === 0 && (
          <Card>
            <CardContent className='p-12 text-center'>
              <AlertCircle className='w-12 h-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                No rescue posts found
              </h3>
              <p className='text-gray-600 mb-4'>
                {search
                  ? "No results match your search"
                  : "Start by adding your first rescue post"}
              </p>
              {!search && (
                <Button onClick={() => navigate("/admin/addRescue")}>
                  <Plus className='h-4 w-4 mr-2' />
                  Add Rescue Post
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Grid View */}
        {!isLoading && viewMode === "grid" && rescuePosts.length > 0 && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {rescuePosts.map((rescue: RescuePost) => (
              <Card
                key={rescue._id}
                className='overflow-hidden hover:shadow-lg transition-shadow'
              >
                <div className='grid grid-cols-2 gap-2 p-2'>
                  <div className='relative h-40 bg-gray-200 rounded overflow-hidden'>
                    <img
                      src={rescue.beforeImage}
                      alt='Before'
                      className='w-full h-full object-cover'
                    />
                    <span className='absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded'>
                      Before
                    </span>
                  </div>
                  <div className='relative h-40 bg-gray-200 rounded overflow-hidden'>
                    <img
                      src={rescue.afterImage}
                      alt='After'
                      className='w-full h-full object-cover'
                    />
                    <span className='absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded'>
                      After
                    </span>
                  </div>
                </div>

                <CardContent className='p-4 space-y-3'>
                  <h3 className='font-semibold text-lg line-clamp-2'>
                    {rescue.title}
                  </h3>
                  <p className='text-sm text-gray-600 line-clamp-3'>
                    {rescue.description}
                  </p>
                  <div className='text-xs text-gray-500'>
                    {new Date(rescue.createdAt).toLocaleDateString()}
                  </div>

                  {confirmDeleteId === rescue._id ? (
                    <div className='space-y-2 pt-2 border-t'>
                      <p className='text-sm text-red-600 font-medium'>
                        Confirm deletion?
                      </p>
                      <div className='flex gap-2'>
                        <Button
                          variant='destructive'
                          size='sm'
                          onClick={handleDeleteConfirm}
                          disabled={isDeleting}
                          className='flex-1'
                        >
                          {isDeleting && deletingId === rescue._id && (
                            <Loader2 className='h-3 w-3 animate-spin mr-1' />
                          )}
                          Yes
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={handleDeleteCancel}
                          className='flex-1'
                        >
                          No
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className='flex gap-2 pt-2 border-t'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleView(rescue._id)}
                        className='flex-1'
                      >
                        <Eye className='h-3 w-3 mr-1' />
                        View
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleEdit(rescue._id)}
                        className='flex-1'
                      >
                        <Edit className='h-3 w-3 mr-1' />
                        Edit
                      </Button>
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => handleDeleteClick(rescue._id)}
                      >
                        <Trash2 className='h-3 w-3' />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* List View */}
        {!isLoading && viewMode === "list" && rescuePosts.length > 0 && (
          <Card>
            <CardContent className='p-0'>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-gray-50 border-b'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                        Images
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                        Title
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                        Description
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                        Date
                      </th>
                      <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {rescuePosts.map((rescue: RescuePost) => (
                      <tr key={rescue._id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4'>
                          <div className='flex gap-2'>
                            <img
                              src={rescue.beforeImage}
                              alt='Before'
                              className='w-16 h-16 object-cover rounded'
                            />
                            <img
                              src={rescue.afterImage}
                              alt='After'
                              className='w-16 h-16 object-cover rounded'
                            />
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='font-medium text-gray-900 max-w-xs truncate'>
                            {rescue.title}
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='text-sm text-gray-600 max-w-md line-clamp-2'>
                            {rescue.description}
                          </div>
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-500'>
                          {new Date(rescue.createdAt).toLocaleDateString()}
                        </td>
                        <td className='px-6 py-4 text-right'>
                          {confirmDeleteId === rescue._id ? (
                            <div className='flex justify-end gap-2'>
                              <Button
                                variant='destructive'
                                size='sm'
                                onClick={handleDeleteConfirm}
                                disabled={isDeleting}
                              >
                                {isDeleting && deletingId === rescue._id && (
                                  <Loader2 className='h-3 w-3 animate-spin mr-1' />
                                )}
                                Confirm
                              </Button>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={handleDeleteCancel}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <div className='flex justify-end gap-2'>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => handleView(rescue._id)}
                              >
                                <Eye className='h-4 w-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => handleEdit(rescue._id)}
                              >
                                <Edit className='h-4 w-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='text-red-600'
                                onClick={() => handleDeleteClick(rescue._id)}
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
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className='flex justify-center gap-2'>
            <Button
              variant='outline'
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <div className='flex items-center gap-2'>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    onClick={() => setPage(pageNum)}
                    size='sm'
                  >
                    {pageNum}
                  </Button>
                )
              )}
            </div>
            <Button
              variant='outline'
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.pages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default RescueDash;
