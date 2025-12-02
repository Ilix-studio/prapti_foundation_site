// src/mainComponents/BlogPosts/SmallBlogUI/Blog.tsx
import React, { useState } from "react";

import {
  Search,
  Loader2,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import BlogCard from "./BlogCard";
import { Header } from "@/mainComponents/Header";
import Footer from "@/mainComponents/Footer";

import { useGetBlogPostsQuery } from "@/redux-store/services/blogApi";
import { selectIsAdmin } from "@/redux-store/slices/authSlice";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getBlogCategoryName } from "@/types/blogs.types";

const SeeBlogs: React.FC = () => {
  const { data: blogPosts, isLoading, error } = useGetBlogPostsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  const isAdmin = useSelector(selectIsAdmin);

  // Filter posts based on search term
  const filteredPosts = blogPosts
    ? blogPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          getBlogCategoryName(post.category)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    : [];

  // Pagination calculations
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Calculate popular posts (in a real app, this might be based on views or engagement)
  const popularPosts = blogPosts
    ? [...blogPosts]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 6)
    : [];

  // Get unique categories from posts
  const categories = blogPosts
    ? [...new Set(blogPosts.map((post) => getBlogCategoryName(post.category)))]
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search term changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryClick = (categoryName: string) => {
    setSearchTerm(categoryName);
    setCurrentPage(1);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxVisiblePages + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

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

            {isAdmin && (
              <div className='pt-4 md:pt-0 w-full md:w-auto flex justify-center md:justify-end'>
                <Link to='/admin/blog/new'>
                  <Button className='bg-orange-500 hover:bg-orange-600'>
                    <PlusCircle className='mr-2 h-4 w-4' />
                    Add New Post
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className='w-full py-12 md:py-24 lg:py-32'>
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col md:flex-row gap-8 md:gap-16'>
            <div className='md:w-2/3'>
              {isLoading ? (
                <div className='flex justify-center items-center py-20'>
                  <Loader2 className='h-8 w-8 text-orange-500 animate-spin' />
                  <span className='ml-2'>Loading blog posts...</span>
                </div>
              ) : error ? (
                <div className='text-center p-10 bg-red-50 rounded-lg text-red-500'>
                  Error loading blog posts. Please try again later.
                </div>
              ) : filteredPosts.length > 0 ? (
                <>
                  <div className='grid gap-12'>
                    {currentPosts.map((post) => (
                      <BlogCard key={post._id} post={post} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className='flex justify-center mt-12'>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='outline'
                          size='icon'
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className='h-9 w-9'
                        >
                          <ChevronLeft className='h-4 w-4' />
                        </Button>

                        {getPageNumbers().map((page) => (
                          <Button
                            key={page}
                            variant='outline'
                            size='sm'
                            onClick={() => handlePageChange(page)}
                            className={
                              currentPage === page
                                ? "bg-orange-500 text-white hover:bg-orange-600"
                                : "hover:bg-gray-100"
                            }
                          >
                            {page}
                          </Button>
                        ))}

                        <Button
                          variant='outline'
                          size='icon'
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className='h-9 w-9'
                        >
                          <ChevronRight className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Results info */}
                  <div className='text-center mt-4 text-sm text-gray-500'>
                    Showing {startIndex + 1}-
                    {Math.min(endIndex, filteredPosts.length)} of{" "}
                    {filteredPosts.length} posts
                  </div>
                </>
              ) : (
                <div className='text-center p-10 bg-gray-50 rounded-lg'>
                  No blog posts found matching your search criteria.
                </div>
              )}
            </div>

            <div className='md:w-1/3 space-y-8'>
              <div className='border rounded-lg p-6'>
                <h3 className='text-lg font-semibold mb-4'>Search</h3>
                <form onSubmit={handleSearch} className='relative'>
                  <Input
                    placeholder='Search blog posts...'
                    className='pr-10'
                    value={searchTerm}
                    onChange={(e) => handleSearchTermChange(e.target.value)}
                  />
                  <Button
                    type='submit'
                    size='sm'
                    className='absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 bg-orange-500 hover:bg-orange-600'
                  >
                    <Search className='h-4 w-4 text-white' />
                    <span className='sr-only'>Search</span>
                  </Button>
                </form>
              </div>

              <div className='border rounded-lg p-6'>
                <h3 className='text-lg font-semibold mb-4'>Categories</h3>
                <div className='flex flex-wrap gap-2'>
                  {categories.map((categoryName, index) => (
                    <Badge
                      key={`${categoryName}-${index}`}
                      className='bg-orange-100 text-orange-800 hover:bg-orange-200 cursor-pointer'
                      onClick={() => handleCategoryClick(categoryName)}
                    >
                      {categoryName}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className='border rounded-lg p-6'>
                <h3 className='text-lg font-semibold mb-4'>Popular Posts</h3>
                <div className='space-y-4'>
                  {popularPosts.map((post) => (
                    <BlogCard key={post._id} post={post} compact={true} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default SeeBlogs;
