import React from "react";
import { motion } from "framer-motion";
import { Header } from "@/mainComponents/Header";
import Footer from "@/mainComponents/Footer";
import { Button } from "@/components/ui/button";
import { Heart, Users, Calendar, Dog } from "lucide-react";
import { Link } from "react-router-dom";
import aboutusLogo from "./../assets/aboutUS.png";

const AboutUs: React.FC = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />

      {/* Hero Section */}
      <section className='relative py-16 md:py-24 bg-amber-50'>
        <div className='container px-4 md:px-6'>
          <div className='max-w-3xl mx-auto text-center space-y-4'>
            <motion.h1
              className='text-4xl font-bold tracking-tighter sm:text-5xl'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              About Prapti Foundation
            </motion.h1>
            <p className='text-gray-500 md:text-xl'>
              A non-profit organization dedicated to rescuing, rehabilitating,
              and rehoming stray dogs in Golaghat since 2017.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className='py-12 md:py-24'>
        <div className='container px-4 md:px-6'>
          <div className='grid gap-12 lg:grid-cols-2 lg:gap-16 items-center'>
            <div className='space-y-4'>
              <div className='inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm'>
                Our Story
              </div>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
                How It All Began
              </h2>
              <div className='space-y-4 text-gray-500'>
                <p>
                  Prapti Foundation was established in 2017 by a group of
                  passionate animal lovers who couldn't ignore the plight of
                  stray dogs in Golaghat. What started as informal feeding
                  programs and emergency medical assistance gradually evolved
                  into a formal shelter that now provides comprehensive care for
                  homeless dogs.
                </p>
                <p>
                  Over the years, we have rescued hundreds of dogs from dire
                  situations, provided them with medical care, rehabilitation,
                  and helped many find loving forever homes. We believe that
                  every dog deserves dignity, care, and the chance to live a
                  happy life.
                </p>
                <p>
                  Today, Prapti Foundation stands as a sanctuary for stray dogs,
                  a place where they can recover from injury or illness, receive
                  nourishment, and experience the love and kindness they
                  deserve.
                </p>
              </div>
            </div>
            <div className='relative rounded-lg overflow-hidden'>
              <img
                src={aboutusLogo}
                alt="Prapti Foundation's journey"
                className='w-full h-full object-cover'
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Impact Section */}
      <section className='py-12 md:py-24 bg-orange-50'>
        <div className='container px-4 md:px-6'>
          <div className='text-center space-y-4 max-w-3xl mx-auto mb-12'>
            <div className='inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm'>
              Our Impact
            </div>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
              Making a Difference
            </h2>
            <p className='text-gray-500'>
              Since our founding, we've been able to help hundreds of dogs and
              make a positive impact in our community.
            </p>
          </div>

          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-8'>
            <div className='bg-white p-6 rounded-lg shadow-sm text-center'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-500 mb-4'>
                <Dog className='h-6 w-6' />
              </div>
              <h3 className='text-3xl font-bold'>500+</h3>
              <p className='text-gray-500'>Dogs Rescued</p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm text-center'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-500 mb-4'>
                <Heart className='h-6 w-6' />
              </div>
              <h3 className='text-3xl font-bold'>300+</h3>
              <p className='text-gray-500'>Adoptions</p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm text-center'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-500 mb-4'>
                <Users className='h-6 w-6' />
              </div>
              <h3 className='text-3xl font-bold'>50+</h3>
              <p className='text-gray-500'>Active Volunteers</p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm text-center'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-500 mb-4'>
                <Calendar className='h-6 w-6' />
              </div>
              <h3 className='text-3xl font-bold'>6</h3>
              <p className='text-gray-500'>Years of Service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className='py-12 md:py-24 bg-amber-50'>
        <div className='container px-4 md:px-6 text-center'>
          <div className='max-w-3xl mx-auto space-y-6'>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
              Join Us in Making a Difference
            </h2>
            <p className='text-gray-500 md:text-xl'>
              Whether you want to adopt, volunteer, or donate, there are many
              ways to support our mission and help create a better world for
              stray dogs.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
              <Link to='/volunteer'>
                <Button className='bg-orange-500 hover:bg-orange-600 min-w-40'>
                  Become a Volunteer
                </Button>
              </Link>
              <Link to='/support'>
                <Button
                  variant='outline'
                  className='border-orange-500 text-orange-500 hover:bg-orange-50 min-w-40'
                >
                  Make a Donation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
