import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useDeleteAwardPostMutation,
  useGetAwardsQuery,
} from "@/redux-store/services/awardApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash2, AlertCircle, Eye } from "lucide-react";
import toast from "react-hot-toast";

import { selectIsAdmin } from "@/redux-store/slices/authSlice";
import { useSelector } from "react-redux";
import { Header } from "../Header";
import Footer from "../Footer";

const ViewAllAwards = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetAwardsQuery({});
  const [deleteAward, { isLoading: isDeleting }] = useDeleteAwardPostMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isAdmin = useSelector(selectIsAdmin);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Loader2 className='h-8 w-8 text-orange-500 animate-spin' />
        <span className='ml-2'>Loading awards...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='bg-red-50 text-red-500 p-4 rounded-md flex items-center gap-2'>
          <AlertCircle className='h-5 w-5' />
          <span>Error loading awards</span>
        </div>
      </div>
    );
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this award?")) {
      return;
    }

    try {
      console.log("Deleting award:", id); // Debug log
      setDeletingId(id);
      const result = await deleteAward(id).unwrap();
      console.log("Delete result:", result); // Debug log
      toast.success("Award deleted successfully");
    } catch (error: any) {
      console.error("Delete error:", error); // Enhanced logging
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Failed to delete award. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <Header />
      <div className='w-full py-12 md:py-24 lg:py-9 bg-slate-50'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4'>
            Some Award Posts
          </h2>
          <p className='text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-3xl mx-auto'>
            Witness the incredible journey of rescue, recovery, and love. Every
            photo and video tells a story of hope, healing, and the unbreakable
            bond between humans and animals.
          </p>
        </div>
      </div>

      <div className='min-h-screen bg-gray-50'>
        <main className='container mx-auto px-4 py-8'>
          {!data || data.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-500 text-lg'>No awards found</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {data.map((award: any) => (
                <Card
                  key={award._id}
                  className='overflow-hidden hover:shadow-lg transition-shadow cursor-pointer'
                  onClick={() => navigate(`/awards/${award._id}`)}
                >
                  {award.images?.length > 0 && (
                    <div className='relative h-48 bg-gray-200 overflow-hidden'>
                      <img
                        src={award.images[0].src}
                        alt={award.images[0].alt}
                        className='w-full h-full object-cover hover:scale-105 transition-transform'
                      />
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className='line-clamp-2'>
                      {award.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className='space-y-4'>
                    <div>
                      <p className='text-sm text-gray-600 line-clamp-3'>
                        {award.description}
                      </p>
                    </div>

                    <div className='flex items-center justify-between pt-2 border-t'>
                      <span className='text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded'>
                        {award.category?.name || "Uncategorized"}
                      </span>
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/awards/${award._id}`);
                        }}
                        className='flex-1 gap-2'
                      >
                        <Eye className='h-4 w-4' />
                        View
                      </Button>
                      {isAdmin && (
                        <Button
                          variant='destructive'
                          size='sm'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(award._id);
                          }}
                          disabled={isDeleting && deletingId === award._id}
                          className='flex-1'
                        >
                          {isDeleting && deletingId === award._id ? (
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
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default ViewAllAwards;
