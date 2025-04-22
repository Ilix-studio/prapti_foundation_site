import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  User,
  ArrowLeft,
  Facebook,
  Twitter,
  Instagram,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/mainComponents/Header";
import { blogPosts, relatedPosts } from "@/mockdata/BlogData";
import Footer from "@/mainComponents/Footer";

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // In a real app, you would fetch the blog post data based on the id
  const post = blogPosts.find((p) => p.id === id) || blogPosts[0];

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-1'>
        <article className='container max-w-4xl px-4 py-12 md:py-20'>
          <div className='flex items-center gap-2 mb-8'>
            <Link
              to='/blog'
              className='inline-flex items-center text-sm font-medium text-orange-500 hover:underline'
            >
              <ArrowLeft className='mr-1 h-4 w-4' />
              Back to all posts
            </Link>
          </div>

          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <Badge className='text-orange-500 border-orange-200 bg-orange-50'>
                {post.category}
              </Badge>
              <div className='flex items-center text-sm text-gray-500'>
                <Calendar className='mr-1 h-3 w-3' />
                {post.date}
              </div>
              <div className='flex items-center text-sm text-gray-500'>
                <User className='mr-1 h-3 w-3' />
                {post.author}
              </div>
            </div>

            <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
              {post.title}
            </h1>

            <div className='overflow-hidden rounded-lg'>
              <img
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                className='aspect-video object-cover w-full'
              />
            </div>

            <div className='prose prose-gray max-w-none'>
              <p>
                {post.excerpt} Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl
                nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed
                euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl,
                eget aliquam nisl nisl sit amet nisl.
              </p>

              <h2>The Beginning</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl,
                eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel
                ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl
                nisl sit amet nisl.
              </p>
              <p>
                Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl,
                eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel
                ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl
                nisl sit amet nisl.
              </p>

              <h2>The Journey</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl,
                eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel
                ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl
                nisl sit amet nisl.
              </p>
              <ul>
                <li>First step in the journey</li>
                <li>Challenges we faced</li>
                <li>Breakthroughs and progress</li>
                <li>Support from our community</li>
              </ul>

              <h2>The Happy Ending</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl,
                eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel
                ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl
                nisl sit amet nisl.
              </p>
              <blockquote>
                "The moment we saw the transformation in this dog's eyes, we
                knew all our hard work had been worth it." - Shelter Volunteer
              </blockquote>
              <p>
                Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl,
                eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel
                ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl
                nisl sit amet nisl.
              </p>

              <h2>How You Can Help</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl,
                eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel
                ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl
                nisl sit amet nisl.
              </p>
            </div>
          </div>

          <Separator className='my-8' />

          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <div className='flex items-center gap-3'>
              <div className='overflow-hidden rounded-full border-2 border-orange-500 w-12 h-12'>
                <img
                  src='/placeholder.svg?height=48&width=48'
                  alt={post.author}
                  className='object-cover'
                />
              </div>
              <div>
                <p className='font-medium'>{post.author}</p>
                <p className='text-sm text-gray-500'>Staff Writer</p>
              </div>
            </div>
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

          <Separator className='my-8' />

          <div className='space-y-4'>
            <h3 className='text-xl font-bold'>Related Posts</h3>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {relatedPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`} className='group'>
                  <div className='space-y-2'>
                    <div className='overflow-hidden rounded-lg'>
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className='aspect-video object-cover w-full transition-transform group-hover:scale-105'
                      />
                    </div>
                    <h4 className='font-semibold group-hover:text-orange-500'>
                      {post.title}
                    </h4>
                    <p className='text-sm text-gray-500'>{post.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
