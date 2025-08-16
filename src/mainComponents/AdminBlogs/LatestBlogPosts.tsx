import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetBlogPostsQuery } from "@/redux-store/services/blogApi";

const LatestBlogPosts: React.FC = () => {
  const { data: blogPosts, isLoading, error } = useGetBlogPostsQuery();

  const latestPosts = blogPosts
    ? [...blogPosts]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 6)
    : [];

  return (
    <section className='w-full  py-16 md:py-28 lg:py-36 bg-amber-50 flex flex-col justify-center'>
      <div className='container px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center mb-12'>
          <div className='space-y-2'>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
              Our Latest rescue stories
            </h2>
          </div>
        </div>

        {isLoading ? (
          <div className='flex justify-center items-center py-16'>
            <Loader2 className='h-8 w-8 text-orange-500 animate-spin' />
            <span className='ml-2'>Loading blog posts...</span>
          </div>
        ) : error ? (
          <div className='text-center p-8 bg-red-50 rounded-lg text-red-500'>
            Unable to load latest blog posts. Please try again later.
          </div>
        ) : latestPosts.length > 0 ? (
          <div className='grid gap-8 md:grid-cols-3'>
            {latestPosts.map((post) => (
              <Link key={post._id} to={`/blog/${post._id}`} className='group'>
                <div className='space-y-3'>
                  <div className='overflow-hidden rounded-lg'>
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className='aspect-video object-cover w-full transition-transform group-hover:scale-105'
                    />
                  </div>
                  <div>
                    <h3 className='font-semibold text-lg group-hover:text-orange-500'>
                      {post.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className='text-center p-8 bg-gray-50 rounded-lg'>
            No blog posts available at the moment.
          </div>
        )}

        <div className='flex justify-center mt-12'>
          <Link to='/blog'>
            <Button
              variant='outline'
              className='border-orange-500 text-orange-500 hover:bg-orange-50'
            >
              Read More Articles
              <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestBlogPosts;
