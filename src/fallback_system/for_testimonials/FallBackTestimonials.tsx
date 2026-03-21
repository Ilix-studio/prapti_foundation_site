import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  profession: string;
  rate: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Mock data (3 entries) ────────────────────────────────────────────────────

const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "68a0c6a562f2129d95ce522f",
    quote:
      "As a developer, I believe technology should serve a greater purpose. By creating this platform, I wanted to bridge compassion with innovation—turning code into care. Each feature is designed to make rescue efforts easier, to connect people with stories of hope, and to inspire society to stand together for animals who cannot speak for themselves. This is not just software; it's a step toward a kinder, more humane world.",
    name: "Himanku Borah",
    profession: "Cyber-Security Head",
    rate: 5,
    isActive: true,
    createdAt: "2025-08-16T17:57:57.495Z",
    updatedAt: "2025-08-16T17:57:57.495Z",
  },
  {
    id: "68a0c3ce62f2129d95ce5174",
    quote:
      "Building this platform has been more than just coding for me—it's about giving a second chance to voiceless friends who deserve love and care. Every click, every feature, and every line of code carries the hope of rescuing a dog from the streets and helping them find warmth, food, and family. Technology can't change the world alone, but when used with compassion, it can create ripples of kindness that transform communities.",
    name: "Ilish Jyotish Hazarika",
    profession: "Software Developer",
    rate: 5,
    isActive: true,
    createdAt: "2025-08-16T17:45:50.658Z",
    updatedAt: "2025-08-16T17:45:50.658Z",
  },
  {
    id: "mock-testimonial-003",
    quote:
      "Prapti Foundation has shown that one organization with a clear heart can change the lives of hundreds of street animals. The dedication of every volunteer and caregiver is visible in the health and happiness of each rescued dog. Supporting this cause is one of the most meaningful things I have done, and I encourage everyone in our community to stand with them.",
    name: "Mitali Bhuyan",
    profession: "Founder, Mitali Bhuyan Foundation",
    rate: 5,
    isActive: true,
    createdAt: "2025-09-01T10:00:00.000Z",
    updatedAt: "2025-09-01T10:00:00.000Z",
  },
];

// ─── Mock hook ────────────────────────────────────────────────────────────────

function useMockTestimonialsQuery() {
  const [state, setState] = useState<{
    data: { data: Testimonial[] } | undefined;
    isLoading: boolean;
    error: unknown;
  }>({ data: undefined, isLoading: true, error: undefined });

  useEffect(() => {
    const t = setTimeout(() => {
      const sorted = [...MOCK_TESTIMONIALS]
        .filter((t) => t.isActive)
        .sort((a, b) => b.rate - a.rate);
      setState({ data: { data: sorted }, isLoading: false, error: undefined });
    }, 500);
    return () => clearTimeout(t);
  }, []);

  return state;
}

// ─── Dynamic hook resolution ──────────────────────────────────────────────────

let useGetActiveTestimonialsQueryReal:
  | ((params: Record<string, unknown>) => {
      data?: { data: Testimonial[] };
      isLoading: boolean;
      error: unknown;
    })
  | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  useGetActiveTestimonialsQueryReal =
    require("@/redux-store/services/testimonialApi").useGetActiveTestimonialsQuery;
} catch {
  useGetActiveTestimonialsQueryReal = null;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface TestimonialsProps {
  onAddTestimonial?: () => void;
}

const FallBackTestimonials: React.FC<TestimonialsProps> = ({
  onAddTestimonial,
}) => {
  const useQuery =
    useGetActiveTestimonialsQueryReal ?? useMockTestimonialsQuery;
  const {
    data: testimonialsData,
    isLoading,
    error,
  } = useQuery({ sortBy: "rate", sortOrder: "desc" });

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
    return null;
  }

  return (
    <section className='py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800'>
      <div className='container mx-auto px-4'>
        <div className='mb-12'>
          <InfiniteMovingCards
            items={testimonials}
            direction='left'
            speed='slow'
            pauseOnHover={true}
            className='py-8'
          />
        </div>

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
          <p className='text-xs text-gray-400 dark:text-gray-500 mt-2 italic underline'>
            Limited Mode : Live Data Entry not possible due to server issues
          </p>
        </div>
      </div>
    </section>
  );
};

export default FallBackTestimonials;
