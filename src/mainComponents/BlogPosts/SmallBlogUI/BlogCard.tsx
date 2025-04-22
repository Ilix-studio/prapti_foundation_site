import React from "react";
import { Link } from "react-router-dom";
import { Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    excerpt?: string;
    date: string;
    author?: string;
    category?: string;
    image: string;
  };
  compact?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, compact = false }) => {
  if (compact) {
    return (
      <div className='flex gap-3'>
        <div className='flex-shrink-0 w-16 h-16 overflow-hidden rounded'>
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className='object-cover w-full h-full'
          />
        </div>
        <div>
          <h4 className='font-medium leading-tight'>
            <Link to={`/blog/${post.id}`} className='hover:text-orange-500'>
              {post.title}
            </Link>
          </h4>
          <p className='text-xs text-gray-500'>{post.date}</p>
        </div>
      </div>
    );
  }

  return (
    <article className='space-y-4'>
      <div className='overflow-hidden rounded-lg'>
        <Link to={`/blog/${post.id}`}>
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className='aspect-video object-cover w-full transition-transform hover:scale-105'
          />
        </Link>
      </div>
      <div className='space-y-2'>
        {post.category && post.author && (
          <div className='flex items-center gap-2 flex-wrap'>
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
        )}
        <h2 className='text-2xl font-bold'>
          <Link to={`/blog/${post.id}`} className='hover:text-orange-500'>
            {post.title}
          </Link>
        </h2>
        {post.excerpt && <p className='text-gray-500'>{post.excerpt}</p>}
      </div>
    </article>
  );
};

export default BlogCard;
