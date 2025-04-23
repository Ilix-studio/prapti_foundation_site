import { Link } from "react-router-dom";
import { ArrowRight, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import BlogCard from "./BlogCard";
import { Header } from "../../../mainComponents/Header";
import { blogPosts, popularPosts } from "@/mockdata/BlogData";
// import { useSelector } from "react-redux";
// import { selectIsAdmin } from "../../../redux-store/slices/authSlice";

const BlogPage: React.FC = () => {
  // const isAdmin = useSelector(selectIsAdmin);
  return (
    <>
      <Header />
      <section className='w-full py-12 md:py-24 lg:py-32 bg-amber-50'>
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-center md:text-left'>
            <div className='space-y-2 max-w-[700px]'>
              <h1 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
                Our Blog
              </h1>
              <p className='text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                Stories, tips, and updates from our shelter community.
              </p>
            </div>

            {/* Add Blog Post button for admins - right on desktop, bottom on mobile */}
            {/* {isAdmin && ( */}
            <div className='pt-4 md:pt-0 w-full md:w-auto flex justify-center md:justify-end'>
              <Link to='/blog/new'>
                <Button className='bg-orange-500 hover:bg-orange-600'>
                  <PlusCircle className='mr-2 h-4 w-4' />
                  Add New Post
                </Button>
              </Link>
            </div>
            {/* )} */}
          </div>
        </div>
      </section>

      <section className='w-full py-12 md:py-24 lg:py-32'>
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col md:flex-row gap-8 md:gap-16'>
            <div className='md:w-2/3'>
              <div className='grid gap-12'>
                {blogPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              <div className='flex justify-center mt-12'>
                <div className='flex items-center gap-2'>
                  <Button variant='outline' size='icon' disabled>
                    &lt;
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='bg-orange-500 text-white hover:bg-orange-600'
                  >
                    1
                  </Button>
                  <Button variant='outline' size='sm'>
                    2
                  </Button>
                  <Button variant='outline' size='sm'>
                    3
                  </Button>
                  <Button variant='outline' size='icon'>
                    &gt;
                  </Button>
                </div>
              </div>
            </div>

            <div className='md:w-1/3 space-y-8'>
              <div className='border rounded-lg p-6'>
                <h3 className='text-lg font-semibold mb-4'>Search</h3>
                <div className='relative'>
                  <Input placeholder='Search blog posts...' className='pr-10' />
                  <Button
                    size='sm'
                    className='absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 bg-orange-500 hover:bg-orange-600'
                  >
                    <ArrowRight className='h-4 w-4 text-white' />
                    <span className='sr-only'>Search</span>
                  </Button>
                </div>
              </div>

              <div className='border rounded-lg p-6'>
                <h3 className='text-lg font-semibold mb-4'>Categories</h3>
                <div className='flex flex-wrap gap-2'>
                  <Badge className='bg-orange-100 text-orange-800 hover:bg-orange-200'>
                    Adoption Stories
                  </Badge>
                  <Badge className='bg-orange-100 text-orange-800 hover:bg-orange-200'>
                    Dog Care
                  </Badge>
                  <Badge className='bg-orange-100 text-orange-800 hover:bg-orange-200'>
                    Training Tips
                  </Badge>
                  <Badge className='bg-orange-100 text-orange-800 hover:bg-orange-200'>
                    Shelter News
                  </Badge>
                  <Badge className='bg-orange-100 text-orange-800 hover:bg-orange-200'>
                    Health & Wellness
                  </Badge>
                  <Badge className='bg-orange-100 text-orange-800 hover:bg-orange-200'>
                    Rescue Stories
                  </Badge>
                </div>
              </div>

              <div className='border rounded-lg p-6'>
                <h3 className='text-lg font-semibold mb-4'>Popular Posts</h3>
                <div className='space-y-4'>
                  {popularPosts.map((post) => (
                    <BlogCard key={post.id} post={post} compact={true} />
                  ))}
                </div>
              </div>

              <div className='border rounded-lg p-6'>
                <h3 className='text-lg font-semibold mb-4'>Subscribe</h3>
                <p className='text-sm text-gray-500 mb-4'>
                  Get the latest posts and updates from our shelter delivered
                  directly to your inbox.
                </p>
                <form className='space-y-2'>
                  <Input placeholder='Your email address' type='email' />
                  <Button className='w-full bg-orange-500 hover:bg-orange-600'>
                    Subscribe
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogPage;
