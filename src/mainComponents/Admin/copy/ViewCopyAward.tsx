import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, ArrowLeft, Calendar, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetCopyAwardByIdQuery } from "@/redux-store/services/copyResourceApi";
import { Header } from "../../Header";
import Footer from "../../Footer";

const ViewCopyAward = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetCopyAwardByIdQuery(id!, {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Loader2 className='h-8 w-8 text-orange-500 animate-spin' />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='bg-red-50 text-red-500 p-4 rounded-md flex items-center gap-2'>
          <AlertCircle className='h-5 w-5' />
          <span>Award not found</span>
        </div>
      </div>
    );
  }

  const award = data.data as any;
  const photos = award.photos ?? [];
  const videos = award.videos ?? [];

  return (
    <>
      <Header />
      <main className='container mx-auto px-4 py-8 max-w-5xl'>
        <Button
          variant='ghost'
          onClick={() => navigate(-1)}
          className='mb-4 gap-2'
        >
          <ArrowLeft className='w-4 h-4' /> Back
        </Button>

        <h1 className='text-3xl md:text-4xl font-bold mb-3'>{award.title}</h1>

        <div className='flex items-center gap-4 text-sm text-gray-600 mb-6'>
          {award.category?.name && (
            <span className='flex items-center gap-1 bg-gray-100 px-2 py-1 rounded'>
              <Tag className='w-3 h-3' /> {award.category.name}
            </span>
          )}
          {award.awardedDate && (
            <span className='flex items-center gap-1'>
              <Calendar className='w-3 h-3' />
              {new Date(award.awardedDate).toLocaleDateString()}
            </span>
          )}
        </div>

        <p className='text-gray-700 leading-relaxed mb-8 whitespace-pre-wrap'>
          {award.description}
        </p>

        {/* Photos */}
        {photos.length > 0 && (
          <section className='mb-10'>
            <h2 className='text-xl font-semibold mb-4'>
              Photos ({photos.length})
            </h2>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
              {photos.flatMap((p: any) =>
                (p.images ?? []).map((img: any, i: number) => (
                  <Card
                    key={`${p._id}-${i}`}
                    className='overflow-hidden hover:shadow-lg transition-shadow'
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className='w-full h-48 object-cover'
                      loading='lazy'
                    />
                    <CardContent className='p-3'>
                      <div className='text-sm font-medium truncate'>
                        {p.title}
                      </div>
                      {p.location && (
                        <div className='text-xs text-gray-500 truncate'>
                          {p.location}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )),
              )}
            </div>
          </section>
        )}

        {/* Videos */}
        {videos.length > 0 && (
          <section className='mb-10'>
            <h2 className='text-xl font-semibold mb-4'>
              Videos ({videos.length})
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {videos.map((v: any) => (
                <Card key={v._id} className='overflow-hidden'>
                  <video
                    src={v.videoUrl}
                    poster={v.thumbnail}
                    controls
                    preload='metadata'
                    className='w-full h-56 object-cover bg-black'
                  />
                  <CardContent className='p-3'>
                    <div className='font-medium truncate'>{v.title}</div>
                    <div className='text-xs text-gray-500'>{v.duration}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {photos.length === 0 && videos.length === 0 && (
          <p className='text-center text-gray-500 py-12'>
            No media linked to this award yet.
          </p>
        )}
      </main>
      <Footer />
    </>
  );
};

export default ViewCopyAward;
