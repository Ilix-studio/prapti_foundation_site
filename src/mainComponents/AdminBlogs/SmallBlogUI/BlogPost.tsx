import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  ArrowLeft,
  Facebook,
  Twitter,
  Instagram,
  Share2,
  Edit,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/mainComponents/Header";
import Footer from "@/mainComponents/Footer";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "@/redux-store/slices/authSlice";
import {
  useGetBlogPostByIdQuery,
  useGetBlogPostsQuery,
} from "@/redux-store/services/blogApi";
import { getBlogCategoryName, getBlogCategoryId } from "@/types/blogs.types";

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isAdmin = useSelector(selectIsAdmin);

  const { data: post, isLoading, error } = useGetBlogPostByIdQuery(id!);
  const { data: allPosts } = useGetBlogPostsQuery();

  // Get related posts (posts in the same category)
  const relatedPosts =
    allPosts && post
      ? allPosts
          .filter(
            (p) =>
              getBlogCategoryId(p.category) ===
                getBlogCategoryId(post.category) && p._id !== post._id
          )
          .slice(0, 3)
      : [];

  if (isLoading) {
    return (
      <div className='min-h-screen flex flex-col'>
        <Header />
        <main className='flex-1 flex items-center justify-center'>
          <div className='flex flex-col items-center'>
            <Loader2 className='h-12 w-12 text-orange-500 animate-spin mb-4' />
            <span>Loading blog post...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className='min-h-screen flex flex-col'>
        <Header />
        <main className='flex-1 flex items-center justify-center'>
          <div className='text-center max-w-lg px-4'>
            <h2 className='text-2xl font-bold mb-4'>Blog Post Not Found</h2>
            <p className='text-gray-600 mb-6'>
              The blog post you're looking for might have been removed or is
              temporarily unavailable.
            </p>
            <Link to='/blog'>
              <Button className='bg-orange-500 hover:bg-orange-600'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to All Blog Posts
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Format the date
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-1'>
        <article className='container max-w-4xl px-4 py-4 md:py-15'>
          <div className='flex items-center justify-between mb-5'>
            <Link
              to='/blog'
              className='inline-flex items-center text-sm font-medium text-orange-500 hover:underline'
            >
              <ArrowLeft className='mr-1 h-4 w-4' />
              Back to all posts
            </Link>

            {isAdmin && (
              <Link to={`/admin/blog/edit/${post._id}`}>
                <Button
                  variant='outline'
                  className='border-orange-500 text-orange-500 hover:bg-orange-50'
                >
                  <Edit className='h-4 w-4 mr-2' />
                  Edit Post
                </Button>
              </Link>
            )}
          </div>

          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <Badge className='text-orange-500 border-orange-200 bg-orange-50'>
                {getBlogCategoryName(post.category)}
              </Badge>
              <div className='flex items-center text-sm text-gray-500'>
                <Calendar className='mr-1 h-3 w-3' />
                {formattedDate}
              </div>
            </div>

            <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
              {post.title}
            </h1>

            <div className='overflow-hidden rounded-lg'>
              <img
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                className='aspect-video w-full object-cover'
              />
            </div>

            <div className='prose prose-gray max-w-none'>
              <p className='font-medium text-lg'>{post.excerpt}</p>

              {/* Render content - in a real app, you might want to use a rich text renderer */}
              <div
                dangerouslySetInnerHTML={{
                  __html: post.content.replace(/\n/g, "<br />"),
                }}
              />
            </div>
          </div>

          <Separator className='my-8' />

          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-500'>Share:</span>
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <Facebook className='h-4 w-4' />
                <span className='sr-only'>Share on Facebook</span>
              </Button>
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <Twitter className='h-4 w-4' />
                <span className='sr-only'>Share on Twitter</span>
              </Button>
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <Instagram className='h-4 w-4' />
                <span className='sr-only'>Share on Instagram</span>
              </Button>
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <Share2 className='h-4 w-4' />
                <span className='sr-only'>Copy link</span>
              </Button>
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <>
              <Separator className='my-8' />

              <div className='space-y-4'>
                <h3 className='text-xl font-bold'>Related Posts</h3>
                <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost._id}
                      to={`/blog/${relatedPost._id}`}
                      className='group'
                    >
                      <div className='space-y-2'>
                        <div className='overflow-hidden rounded-lg'>
                          <img
                            src={relatedPost.image || "/placeholder.svg"}
                            alt={relatedPost.title}
                            className='aspect-video object-cover w-full transition-transform group-hover:scale-105'
                          />
                        </div>
                        <h4 className='font-semibold group-hover:text-orange-500'>
                          {relatedPost.title}
                        </h4>
                        <p className='text-sm text-gray-500'>
                          {new Date(relatedPost.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
