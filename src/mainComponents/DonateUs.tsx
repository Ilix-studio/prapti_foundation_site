import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const DonateUs: React.FC = () => {
  return (
    <>
      <section className='w-full py-12 md:py-24 lg:py-32 bg-orange-50'>
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col items-center text-center space-y-4'>
            <div className='space-y-2'>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
                Support Our Cause
              </h2>
              <p className='max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                Your donation helps us provide food, shelter, medical care, and
                love to dogs in need.
              </p>
            </div>
            <div className='w-full max-w-sm space-y-2'>
              <div className='flex justify-center gap-4'>
                <Link to='/support'>
                  <Button className='bg-orange-500 hover:bg-orange-600'>
                    Donate Now
                    <Heart className='ml-2 h-4 w-4' />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DonateUs;
