import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetRescuePostByIdQuery,
  useDeleteRescuePostMutation,
} from "@/redux-store/services/rescueApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Trash2, Edit, ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "@/redux-store/slices/authSlice";
import { BreadcrumbSchema } from "@/SEO/StructuredData";

import toast from "react-hot-toast";
import { SEO } from "@/SEO/SEO";
import { RescueStorySchema } from "@/SEO/StructuredData";

const ViewRescue = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAdmin = useSelector(selectIsAdmin);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: rescueData, isLoading, error } = useGetRescuePostByIdQuery(id!);
  const [deleteRescue, { isLoading: isDeleting }] =
    useDeleteRescuePostMutation();

  const handleDelete = async () => {
    try {
      await deleteRescue(id!).unwrap();
      toast.success("Rescue post deleted successfully");
      navigate("/admin/rescueDash");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete rescue post");
    }
  };

  if (isLoading) {
    return (
      <div className='container mx-auto p-6 max-w-4xl'>
        <Skeleton className='h-8 w-48 mb-6' />
        <Card>
          <CardHeader>
            <Skeleton className='h-8 w-3/4' />
          </CardHeader>
          <CardContent className='space-y-4'>
            <Skeleton className='h-64 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-2/3' />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !rescueData?.data) {
    return (
      <div className='container mx-auto p-6 max-w-4xl'>
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>Failed to load rescue post</AlertDescription>
        </Alert>
      </div>
    );
  }

  const rescue = rescueData.data;
  const rescueUrl = `/rescue/${id}`;
  const rescueDescription = rescue.description.substring(0, 160) + "...";

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Rescue Operations", url: "/rescue" },
    { name: rescue.title, url: rescueUrl },
  ];

  return (
    <>
      <SEO
        title={rescue.title}
        description={rescueDescription}
        canonical={rescueUrl}
        ogImage={rescue.afterImage}
        type='article'
        publishedTime={rescue.createdAt}
        modifiedTime={rescue.updatedAt}
        keywords={[
          "dog rescue story",
          "before after transformation",
          "stray dog rescue Golaghat",
        ]}
      />
      <RescueStorySchema
        title={rescue.title}
        description={rescueDescription}
        url={rescueUrl}
        beforeImage={rescue.beforeImage}
        afterImage={rescue.afterImage}
        rescueDate={rescue.createdAt}
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <div className='min-h-screen bg-gray-50'>
        <div className='bg-white border-b'>
          <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
            <Button
              variant='ghost'
              onClick={() => navigate("/admin/rescueDash")}
              className='gap-2'
            >
              <ArrowLeft className='h-4 w-4' />
              Back to Rescues
            </Button>
            {isAdmin && (
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  onClick={() => navigate(`/admin/editRescue/${id}`)}
                  className='gap-2'
                >
                  <Edit className='h-4 w-4' />
                  Edit
                </Button>
                <Button
                  variant='destructive'
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
          <div className='max-w-5xl mx-auto'>
            <Card className='overflow-hidden shadow-lg'>
              <CardHeader className='pb-4'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <CardTitle className='text-3xl mb-2'>
                      {rescue.title}
                    </CardTitle>
                    <span className='text-xs text-gray-500'>
                      {new Date(rescue.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className='space-y-6'>
                {/* Before & After Images */}
                <div>
                  <h3 className='text-lg font-semibold mb-4'>Transformation</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                      <div className='relative'>
                        <div className='absolute top-2 left-2 bg-black/70 text-white text-sm px-3 py-1 rounded-md z-10'>
                          Before
                        </div>
                        <img
                          src={rescue.beforeImage}
                          alt='Before rescue'
                          className='w-full h-80 object-cover rounded-lg shadow-md'
                        />
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <div className='relative'>
                        <div className='absolute top-2 left-2 bg-green-600 text-white text-sm px-3 py-1 rounded-md z-10'>
                          After
                        </div>
                        <img
                          src={rescue.afterImage}
                          alt='After rescue'
                          className='w-full h-80 object-cover rounded-lg shadow-md'
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className='pt-4 border-t'>
                  <h3 className='text-lg font-semibold mb-3'>Rescue Story</h3>
                  <p className='text-gray-700 leading-relaxed whitespace-pre-wrap'>
                    {rescue.description}
                  </p>
                </div>

                {/* Metadata */}
                <div className='pt-4 border-t'>
                  <p className='text-xs text-gray-500'>
                    Last updated: {new Date(rescue.updatedAt).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
              <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                <Card className='w-full max-w-sm'>
                  <CardHeader>
                    <CardTitle>Delete Rescue Post</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <p className='text-gray-600'>
                      Are you sure you want to delete this rescue post? This
                      action cannot be undone.
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

export default ViewRescue;
