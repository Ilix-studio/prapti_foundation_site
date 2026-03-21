import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getContentPreview } from "@/constants/helperfn";
import { useGetBlogPostsQueryReal, useMockBlogPostsQuery } from "./helper";

const FallbackBlogs: React.FC = () => {
  const useQuery = useGetBlogPostsQueryReal ?? useMockBlogPostsQuery;
  const { data: blogPosts, isLoading, error } = useQuery();

  const latestPosts = blogPosts
    ? [...blogPosts]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 6)
    : [];

  return (
    <section className='w-full py-16 md:py-28 lg:py-36 bg-amber-50 flex flex-col justify-center'>
      <div className='container px-4 md:px-6'>
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
              <Link key={post._id} to='' className='group' aria-disabled='true'>
                <div className='space-y-3'>
                  <div className='overflow-hidden rounded-lg'>
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className='aspect-video object-cover w-full transition-transform group-hover:scale-105'
                    />
                  </div>
                  <div>
                    {/* Category badge */}
                    {post.category && typeof post.category === "object" && (
                      <span className='text-[11px] font-medium text-orange-500 uppercase tracking-wide'>
                        {post.category.name}
                      </span>
                    )}
                    <h3 className='font-semibold text-lg group-hover:text-orange-500 mt-1'>
                      {post.title}
                    </h3>
                    {/* Prefer excerpt if available, else derive from content */}
                    <p className='text-gray-600 text-sm line-clamp-2'>
                      {post.excerpt ?? getContentPreview(post.content)}
                    </p>
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
          <Button
            variant='outline'
            className='border-orange-500 text-orange-500 hover:bg-orange-50'
            disabled
          >
            Read More Articles
            <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </div>
        <p className='text-sm text-gray-500 text-center mt-2 italic underline'>
          Limited Mode : Live Data temporarily unavailable
        </p>
      </div>
    </section>
  );
};

export default FallbackBlogs;
