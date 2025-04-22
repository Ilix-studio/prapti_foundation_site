import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useSelector } from "react-redux";
import { getLatestPosts } from "../../mockdata/BlogData";
import { selectIsAdmin } from "../../redux-store/slices/authSlice";

const LatestBlogPosts: React.FC = () => {
  const latestPosts = getLatestPosts();
  const isAdmin = useSelector(selectIsAdmin);

  return (
    <section className='w-full py-12 md:py-24 lg:py-32 bg-amber-50'>
      <div className='container px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center mb-8'>
          <div className='space-y-2'>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
              Latest from Our Blog
            </h2>
            <p className='max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
              Stories, tips, and updates from our shelter community.
            </p>

            {/* Add Blog Post button for admins */}
            {isAdmin && (
              <div className='mt-4'>
                <Link to='/admin/blog/new'>
                  <Button className='bg-orange-500 hover:bg-orange-600'>
                    Add New Blog Post
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className='grid gap-8 md:grid-cols-3'>
          {latestPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`} className='group'>
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
                  <p className='text-sm text-gray-500 line-clamp-2'>
                    {post.excerpt}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className='flex justify-center mt-8'>
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
