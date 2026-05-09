import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Eye, ImageIcon, Video } from "lucide-react";
import { useGetCopyAwardsQuery } from "@/redux-store/services/copyResourceApi";
import { Header } from "../../Header";
import Footer from "../../Footer";

const ViewAllCopyAwards = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetCopyAwardsQuery();

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

  const awards = data?.data ?? [];

  return (
    <>
      <Header />
      <div className='w-full py-12 md:py-24 lg:py-9 bg-slate-50'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4'>
            Awards & Recognition (Copy)
          </h2>
          <p className='text-gray-600 md:text-xl/relaxed max-w-3xl mx-auto'>
            Test gallery of awards, with linked photos and videos.
          </p>
        </div>
      </div>

      <div className='min-h-screen bg-gray-50'>
        <main className='container mx-auto px-4 py-8'>
          {awards.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-500 text-lg'>No awards found</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {awards.map((award: any) => {
                const cover = award.photos?.[0]?.images?.[0];
                const photoCount = award.photos?.length ?? 0;
                const videoCount = award.videos?.length ?? 0;

                return (
                  <Card
                    key={award._id}
                    className='overflow-hidden hover:shadow-lg transition-shadow cursor-pointer'
                    onClick={() => navigate(`/copy-awards/${award._id}`)}
                  >
                    {cover ? (
                      <div className='relative h-48 bg-gray-200 overflow-hidden'>
                        <img
                          src={cover.src}
                          alt={cover.alt}
                          className='w-full h-full object-cover hover:scale-105 transition-transform'
                        />
                      </div>
                    ) : (
                      <div className='h-48 bg-gray-100 flex items-center justify-center'>
                        <ImageIcon className='w-10 h-10 text-gray-300' />
                      </div>
                    )}

                    <CardHeader>
                      <CardTitle className='line-clamp-2'>
                        {award.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className='space-y-4'>
                      <p className='text-sm text-gray-600 line-clamp-3'>
                        {award.description}
                      </p>

                      <div className='flex items-center justify-between pt-2 border-t text-xs text-gray-500'>
                        <span className='bg-gray-100 px-2 py-1 rounded'>
                          {award.category?.name || "Uncategorized"}
                        </span>
                        <div className='flex items-center gap-3'>
                          <span className='flex items-center gap-1'>
                            <ImageIcon className='w-3 h-3' /> {photoCount}
                          </span>
                          <span className='flex items-center gap-1'>
                            <Video className='w-3 h-3' /> {videoCount}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant='outline'
                        size='sm'
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/copy-awards/${award._id}`);
                        }}
                        className='w-full gap-2'
                      >
                        <Eye className='h-4 w-4' />
                        View
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default ViewAllCopyAwards;
