import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetRescuePostsQuery,
  useDeleteRescuePostMutation,
} from "@/redux-store/services/rescueApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2, AlertCircle, Eye, Search } from "lucide-react";
import toast from "react-hot-toast";

import { selectIsAdmin } from "@/redux-store/slices/authSlice";
import { useSelector } from "react-redux";
import { Header } from "../Header";
import Footer from "../Footer";

const ViewAllRescue = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isAdmin = useSelector(selectIsAdmin);

  const { data, isLoading, error } = useGetRescuePostsQuery({
    page,
    limit: 9,
    search,
  });

  const [deleteRescuePost, { isLoading: isDeleting }] =
    useDeleteRescuePostMutation();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this rescue post?")) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteRescuePost(id).unwrap();
      toast.success("Rescue post deleted successfully");
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error?.data?.message || "Failed to delete rescue post");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Loader2 className='h-8 w-8 text-orange-500 animate-spin' />
        <span className='ml-2'>Loading rescue posts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='bg-red-50 text-red-500 p-4 rounded-md flex items-center gap-2'>
          <AlertCircle className='h-5 w-5' />
          <span>Error loading rescue posts</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className='min-h-screen bg-gray-50'>
        <div className='w-full py-12 md:py-24 lg:py-9 bg-slate-50'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4'>
              Our Rescue Posts
            </h2>
            <p className='text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-3xl mx-auto'>
              Witness the incredible journey of rescue, recovery, and love.
              Every photo and video tells a story of hope, healing, and the
              unbreakable bond between humans and animals.
            </p>
          </div>
        </div>

        <main className='container mx-auto px-4 py-8'>
          {/* Search */}
          <div className='mb-6'>
            <div className='relative max-w-md'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Search rescue posts...'
                value={search}
                onChange={handleSearch}
                className='pl-10'
              />
            </div>
          </div>

          {!data?.data || data.data.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-500 text-lg'>No rescue posts found</p>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {data.data.map((rescue) => (
                  <Card
                    key={rescue._id}
                    className='overflow-hidden hover:shadow-lg transition-shadow'
                  >
                    <div className='grid grid-cols-2 gap-2 p-4 bg-gray-100'>
                      <div className='relative h-40'>
                        <div className='absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded'>
                          Before
                        </div>
                        <img
                          src={rescue.beforeImage}
                          alt='Before rescue'
                          className='w-full h-full object-cover rounded'
                        />
                      </div>
                      <div className='relative h-40'>
                        <div className='absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded'>
                          After
                        </div>
                        <img
                          src={rescue.afterImage}
                          alt='After rescue'
                          className='w-full h-full object-cover rounded'
                        />
                      </div>
                    </div>

                    <CardHeader>
                      <CardTitle className='line-clamp-2'>
                        {rescue.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className='space-y-4'>
                      <p className='text-sm text-gray-600 line-clamp-3'>
                        {rescue.description}
                      </p>

                      <div className='text-xs text-gray-500'>
                        {new Date(rescue.createdAt).toLocaleDateString()}
                      </div>

                      <div className='flex gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => navigate(`/rescue/${rescue._id}`)}
                          className='flex-1 gap-2'
                        >
                          <Eye className='h-4 w-4' />
                          View
                        </Button>
                        {isAdmin && (
                          <Button
                            variant='destructive'
                            size='sm'
                            onClick={() => handleDelete(rescue._id)}
                            disabled={isDeleting && deletingId === rescue._id}
                            className='flex-1'
                          >
                            {isDeleting && deletingId === rescue._id ? (
                              <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className='mr-2 h-4 w-4' />
                                Delete
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {data.pagination.pages > 1 && (
                <div className='flex justify-center gap-2 mt-8'>
                  <Button
                    variant='outline'
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className='flex items-center px-4 text-sm'>
                    Page {page} of {data.pagination.pages}
                  </span>
                  <Button
                    variant='outline'
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= data.pagination.pages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default ViewAllRescue;
