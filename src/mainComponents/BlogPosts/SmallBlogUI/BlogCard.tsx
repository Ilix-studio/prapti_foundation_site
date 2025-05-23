// src/mainComponents/BlogPosts/SmallBlogUI/BlogCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from "@/redux-store/services/blogApi";

interface BlogCardProps {
  post: BlogPost;
  compact?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, compact = false }) => {
  // Format the date using toLocaleDateString
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (compact) {
    return (
      <div className='flex gap-3 group'>
        <div className='flex-shrink-0 w-16 h-16 overflow-hidden rounded'>
          <Link to={`/blog/${post._id}`}>
            <img
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              className='object-fill w-full h-full transition-transform group-hover:scale-105'
            />
          </Link>
        </div>
        <div>
          <h4 className='font-medium leading-tight'>
            <Link to={`/blog/${post._id}`} className='hover:text-orange-500'>
              {post.title}
            </Link>
          </h4>
          <p className='text-xs text-gray-500 mt-1'>{formattedDate}</p>
        </div>
      </div>
    );
  }

  return (
    <article className='space-y-2 group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300'>
      <Link to={`/blog/${post._id}`}>
        <img
          src={post.image || "/placeholder.svg"}
          alt={post.title}
          className='aspect-video object-cover w-full transition-transform group-hover:scale-105 duration-300'
        />
      </Link>

      <div className='space-y-3 p-4'>
        <div className='flex items-center gap-2 flex-wrap'>
          <Badge className='text-orange-500 border-orange-200 bg-orange-50'>
            {post.category}
          </Badge>
          <div className='flex items-center text-sm text-gray-500'>
            <Calendar className='mr-1 h-3 w-3' />
            {formattedDate}
          </div>
        </div>
        <h2 className='text-xl font-bold group-hover:text-orange-500 transition-colors'>
          <Link to={`/blog/${post._id}`}>{post.title}</Link>
        </h2>
        {post.excerpt && (
          <p className='text-gray-600 line-clamp-2'>{post.excerpt}</p>
        )}
        <Link
          to={`/blog/${post._id}`}
          className='inline-block text-sm font-medium text-orange-500 hover:text-orange-600 mt-2'
        >
          Read more
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
