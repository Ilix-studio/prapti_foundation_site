import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";

const OurMission: React.FC = () => {
  return (
    <>
      <section className='w-full py-12 md:py-24 lg:py-32'>
        <div className='container px-4 md:px-6'>
          <div className='grid gap-10 px-10 md:gap-16 lg:grid-cols-2'>
            <div className='space-y-4'>
              <div className='inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm'>
                Our Mission
              </div>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
                Helping Dogs Find Loving Homes
              </h2>
              <p className='max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                Prapti Foundation is dedicated to rescuing, rehabilitating, and
                rehoming dogs in need. We believe every dog deserves a loving
                home and work tirelessly to make perfect matches.
              </p>
              <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                <Link to='/about'>
                  <Button className='bg-orange-500 hover:bg-orange-600'>
                    About Us
                  </Button>
                </Link>
              </div>
            </div>
            <div className='space-y-4'>
              <ul className='grid gap-4'>
                <li>
                  <div className='grid gap-1'>
                    <h3 className='text-xl font-semibold'>100+ Dogs Adopted</h3>
                    <p className='text-gray-500'>
                      We've helped over 100 dogs find their forever homes in the
                      past year alone.
                    </p>
                  </div>
                </li>
                <li>
                  <div className='grid gap-1'>
                    <h3 className='text-xl font-semibold'>
                      Comprehensive Care
                    </h3>
                    <p className='text-gray-500'>
                      All our dogs receive medical care, training, and
                      socialization before adoption.
                    </p>
                  </div>
                </li>
                <li>
                  <div className='grid gap-1'>
                    <h3 className='text-xl font-semibold'>Adoption Support</h3>
                    <p className='text-gray-500'>
                      We provide ongoing support and resources for all our
                      adopters.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OurMission;
