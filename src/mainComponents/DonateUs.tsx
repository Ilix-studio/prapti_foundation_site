import { Button } from "@/components/ui/button";
import { IconBrandGooglePlay } from "@tabler/icons-react";
import { Heart, Users, Shield, Gift } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const DonateUs: React.FC = () => {
  return (
    <>
      <section className='w-full py-16 md:py-28 lg:py-36 bg-white-50 border-2 border-white-100 shadow-lg'>
        <div className='container px-6 md:px-8'>
          <div className='flex flex-col items-center text-center space-y-12'>
            {/* Header Section */}
            <div className='space-y-6 max-w-4xl'>
              <div className='inline-block rounded-lg bg-orange-200 px-4 py-2 text-sm font-medium'>
                Make a Difference
              </div>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl'>
                Support Our Cause
              </h2>
              <p className='max-w-[700px] text-gray-600 text-lg md:text-xl leading-relaxed'>
                Your donation helps us provide food, shelter, medical care, and
                love to dogs in need. Every contribution makes a real difference
                in a dog's journey to finding their forever home.
              </p>
            </div>

            {/* Impact Statistics */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl'>
              <div className='bg-white rounded-lg p-6 shadow-lg'>
                <div className='flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-4'>
                  <Heart className='h-6 w-6 text-orange-600' />
                </div>
                <h3 className='text-2xl font-bold text-gray-900 mb-2'>150+</h3>
                <p className='text-gray-600'>Dogs rescued and rehabilitated</p>
              </div>

              <div className='bg-white rounded-lg p-6 shadow-lg'>
                <div className='flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-4'>
                  <Shield className='h-6 w-6 text-orange-600' />
                </div>
                <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                  ₹50,000
                </h3>
                <p className='text-gray-600'>Monthly medical expenses</p>
              </div>

              <div className='bg-white rounded-lg p-6 shadow-lg'>
                <div className='flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-4'>
                  <Users className='h-6 w-6 text-orange-600' />
                </div>
                <h3 className='text-2xl font-bold text-gray-900 mb-2'>24/7</h3>
                <p className='text-gray-600'>Emergency rescue response</p>
              </div>
            </div>

            {/* Donation Options */}
            <div className='w-full max-w-3xl'>
              <h3 className='text-2xl font-semibold mb-8 text-gray-900'>
                Ways to Help
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                <div className='bg-white rounded-lg p-6 border border-orange-200'>
                  <IconBrandGooglePlay className='h-8 w-8 text-orange-600 mb-4' />
                  <h4 className='text-lg font-semibold mb-3'>
                    One-Time Donation
                  </h4>
                  <p className='text-gray-600 mb-4'>
                    Make an immediate impact with a single donation to help
                    rescue operations.
                  </p>
                  <ul className='text-sm text-gray-500 space-y-1'>
                    <li>• ₹500 - Feed a dog for a month</li>
                    <li>• ₹2,000 - Basic medical checkup</li>
                    <li>• ₹5,000 - Emergency surgery fund</li>
                  </ul>
                </div>

                <div className='bg-white rounded-lg p-6 border border-orange-200'>
                  <Gift className='h-8 w-8 text-orange-600 mb-4' />
                  <h4 className='text-lg font-semibold mb-3'>
                    Monthly Sponsorship
                  </h4>
                  <p className='text-gray-600 mb-4'>
                    Become a monthly sponsor and provide sustained support for
                    our mission.
                  </p>
                  <ul className='text-sm text-gray-500 space-y-1'>
                    <li>• Regular updates on impact</li>
                    <li>• Special volunteer opportunities</li>
                    <li>• Annual appreciation events</li>
                  </ul>
                </div>
              </div>

              {/* Call to Action */}
              <div className='space-y-4'>
                <div className='flex flex-col sm:flex-row justify-center gap-4'>
                  <Link to='/support'>
                    <Button className='bg-orange-500 hover:bg-orange-600 px-8 py-3 text-base'>
                      Donate Now
                      <Heart className='ml-2 h-4 w-4' />
                    </Button>
                  </Link>
                  <Link to='/volunteer'>
                    <Button
                      variant='outline'
                      className='border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-3 text-base'
                    >
                      Volunteer With Us
                    </Button>
                  </Link>
                </div>

                <p className='text-sm text-gray-500 mt-6'>
                  All donations are tax-deductible. We're registered under
                  Section 12A & 80G.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DonateUs;
