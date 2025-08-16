import React from "react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useGetActiveTestimonialsQuery } from "@/redux-store/services/testimonialApi";
import { Link } from "react-router-dom";

interface TestimonialsProps {
  onAddTestimonial?: () => void;
}

const Testimonials: React.FC<TestimonialsProps> = ({ onAddTestimonial }) => {
  const {
    data: testimonialsData,
    isLoading,
    error,
  } = useGetActiveTestimonialsQuery({
    sortBy: "rate",
    sortOrder: "desc",
  });

  if (isLoading) {
    return (
      <section className='py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
              What Our Clients Say
            </h2>
            <p className='text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
              Discover how we've helped businesses achieve their goals through
              our services.
            </p>
          </div>
          <div className='flex justify-center items-center py-20'>
            <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800'>
        <div className='container mx-auto px-4'>
          <div className='text-center'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
              What Our Clients Say
            </h2>
            <p className='text-red-600 dark:text-red-400'>
              Unable to load testimonials at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const testimonials = testimonialsData?.data || [];

  if (testimonials.length === 0) {
    return (
      <section className='py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800'>
        <div className='container mx-auto px-4'>
          <div className='text-center'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
              What Our Clients Say
            </h2>
            <p className='text-gray-600 dark:text-gray-300 mb-8'>
              Be the first to share your experience with us!
            </p>
            <Link to='/write-testimonial'>
              <Button
                onClick={onAddTestimonial}
                size='lg'
                className='bg-blue-600 hover:bg-blue-700 text-white'
              >
                Add Your Testimonial
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800'>
      <div className='container mx-auto px-4'>
        {/* Infinite Moving Cards */}
        <div className='mb-12'>
          <InfiniteMovingCards
            items={testimonials}
            direction='left'
            speed='slow'
            pauseOnHover={true}
            className='py-8'
          />
        </div>

        {/* Add Testimonial CTA */}
        <div className='text-center'>
          <div className='flex items-center justify-center mb-6'>
            <div className='flex-1 border-t border-gray-300 dark:border-gray-600 max-w-32'></div>
            <Link to='/write-testimonial'>
              <Button
                onClick={onAddTestimonial}
                variant='outline'
                size='lg'
                className='mx-6 border-gray-400 text-gray-500 hover:bg-orange-600 hover:text-white transition-colors duration-300'
              >
                Add your testimonial quote
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </Link>
            <div className='flex-1 border-t border-gray-300 dark:border-gray-600 max-w-32'></div>
          </div>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Your kind words could help others discover the care we provide.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
