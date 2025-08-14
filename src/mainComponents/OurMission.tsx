import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";

const OurMission: React.FC = () => {
  return (
    <>
      <section className='w-full py-16 md:py-28 lg:py-36'>
        <div className='container px-6 md:px-8'>
          <div className='grid gap-16 px-6 md:gap-20 lg:grid-cols-2 lg:px-12'>
            {/* Left Column - Mission Content */}
            <div className='space-y-8'>
              <div className='inline-block rounded-lg bg-orange-100 px-4 py-2 text-sm font-medium'>
                Our Mission
              </div>

              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl'>
                Helping Dogs Find Loving Homes
              </h2>

              <p className='max-w-[600px] text-gray-500 text-lg md:text-xl leading-relaxed'>
                Prapti Foundation is dedicated to rescuing, rehabilitating, and
                rehoming dogs in need. We believe every dog deserves a loving
                home and work tirelessly to make perfect matches.
              </p>

              <div className='pt-4'>
                <Link to='/about'>
                  <Button className='bg-gray-500 hover:bg-orange-600 px-8 py-3 text-base'>
                    About Us
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column - Statistics */}
            <div className='space-y-8'>
              <ul className='grid gap-8'>
                <li>
                  <div className='space-y-3'>
                    <h3 className='text-xl font-semibold text-gray-900'>
                      100+ Dogs Adopted
                    </h3>
                    <p className='text-gray-500 leading-relaxed'>
                      We've helped over 100 dogs find their forever homes in the
                      past year alone.
                    </p>
                  </div>
                </li>

                <li>
                  <div className='space-y-3'>
                    <h3 className='text-xl font-semibold text-gray-900'>
                      Comprehensive Care
                    </h3>
                    <p className='text-gray-500 leading-relaxed'>
                      All our dogs receive medical care, training, and
                      socialization before adoption.
                    </p>
                  </div>
                </li>

                <li>
                  <div className='space-y-3'>
                    <h3 className='text-xl font-semibold text-gray-900'>
                      Adoption Support
                    </h3>
                    <p className='text-gray-500 leading-relaxed'>
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
