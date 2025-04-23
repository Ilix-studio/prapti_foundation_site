import React from "react";
import { motion } from "framer-motion";
import { Header } from "@/mainComponents/Header";
import Footer from "@/mainComponents/Footer";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Heart, Users, Calendar, Dog } from "lucide-react";
import { Link } from "react-router-dom";

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
                src='/placeholder.svg?height=600&width=800&text=Prapti+Foundation+Story'
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

      {/* Our Team Section */}
      <section className='py-12 md:py-24'>
        <div className='container px-4 md:px-6'>
          <div className='text-center space-y-4 max-w-3xl mx-auto mb-12'>
            <div className='inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm'>
              Our Team
            </div>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
              Meet the People Behind Prapti
            </h2>
            <p className='text-gray-500'>
              Our dedicated team works tirelessly to ensure the well-being of
              every dog in our care.
            </p>
          </div>

          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-8'>
            {/* Team Member 1 */}
            <div className='bg-white p-6 rounded-lg shadow-sm text-center'>
              <div className='w-24 h-24 rounded-full overflow-hidden mx-auto mb-4'>
                <img
                  src='/placeholder.svg?height=96&width=96&text=KP'
                  alt='Krishnendu Paul'
                  className='w-full h-full object-cover'
                />
              </div>
              <h3 className='text-xl font-semibold'>Dr. Prapti </h3>
              <p className='text-orange-500 mb-2'>Founder & Director</p>
              <p className='text-gray-500 text-sm mb-4'>
                Passionate about animal welfare since childhood, Krishnendu
                established the foundation to create a safe haven for stray
                dogs.
              </p>
            </div>

            {/* Team Member 2 */}
            <div className='bg-white p-6 rounded-lg shadow-sm text-center'>
              <div className='w-24 h-24 rounded-full overflow-hidden mx-auto mb-4'>
                <img
                  src='/placeholder.svg?height=96&width=96&text=DR'
                  alt='Dr. Rajesh Sharma'
                  className='w-full h-full object-cover'
                />
              </div>
              <h3 className='text-xl font-semibold'>Dr. Rajesh Sharma</h3>
              <p className='text-orange-500 mb-2'>Veterinarian</p>
              <p className='text-gray-500 text-sm mb-4'>
                With over 15 years of experience in veterinary medicine, Dr.
                Sharma ensures all our dogs receive the best medical care.
              </p>
            </div>

            {/* Team Member 3 */}
            <div className='bg-white p-6 rounded-lg shadow-sm text-center'>
              <div className='w-24 h-24 rounded-full overflow-hidden mx-auto mb-4'>
                <img
                  src='/placeholder.svg?height=96&width=96&text=PB'
                  alt='Priya Bora'
                  className='w-full h-full object-cover'
                />
              </div>
              <h3 className='text-xl font-semibold'>Priya Bora</h3>
              <p className='text-orange-500 mb-2'>Adoption Coordinator</p>
              <p className='text-gray-500 text-sm mb-4'>
                Priya works diligently to match our dogs with the perfect
                forever homes and provides ongoing support to adopters.
              </p>
            </div>

            {/* Team Member 4 */}
            <div className='bg-white p-6 rounded-lg shadow-sm text-center'>
              <div className='w-24 h-24 rounded-full overflow-hidden mx-auto mb-4'>
                <img
                  src='/placeholder.svg?height=96&width=96&text=AK'
                  alt='Aditya Kumar'
                  className='w-full h-full object-cover'
                />
              </div>
              <h3 className='text-xl font-semibold'>Aditya Kumar</h3>
              <p className='text-orange-500 mb-2'>Shelter Manager</p>
              <p className='text-gray-500 text-sm mb-4'>
                Aditya oversees the day-to-day operations of our shelter,
                ensuring all dogs are well-cared for and comfortable.
              </p>
            </div>

            {/* Team Member 5 */}
            <div className='bg-white p-6 rounded-lg shadow-sm text-center'>
              <div className='w-24 h-24 rounded-full overflow-hidden mx-auto mb-4'>
                <img
                  src='/placeholder.svg?height=96&width=96&text=MB'
                  alt='Meera Baruah'
                  className='w-full h-full object-cover'
                />
              </div>
              <h3 className='text-xl font-semibold'>Meera Baruah</h3>
              <p className='text-orange-500 mb-2'>Fundraising Coordinator</p>
              <p className='text-gray-500 text-sm mb-4'>
                Meera leads our fundraising efforts, organizing events and
                campaigns to support our ongoing mission.
              </p>
            </div>

            {/* Team Member 6 */}
            <div className='bg-white p-6 rounded-lg shadow-sm text-center'>
              <div className='w-24 h-24 rounded-full overflow-hidden mx-auto mb-4'>
                <img
                  src='/placeholder.svg?height=96&width=96&text=RD'
                  alt='Rahul Dutta'
                  className='w-full h-full object-cover'
                />
              </div>
              <h3 className='text-xl font-semibold'>Rahul Dutta</h3>
              <p className='text-orange-500 mb-2'>Volunteer Coordinator</p>
              <p className='text-gray-500 text-sm mb-4'>
                Rahul manages our volunteer program, training and organizing our
                dedicated team of animal lovers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className='py-12 md:py-24 bg-gray-50'>
        <div className='container px-4 md:px-6'>
          <div className='grid gap-12 lg:grid-cols-2 lg:gap-16 items-center'>
            <div className='order-2 lg:order-1 relative rounded-lg overflow-hidden'>
              <img
                src='/placeholder.svg?height=600&width=800&text=Our+Values'
                alt="Prapti Foundation's values"
                className='w-full h-full object-cover'
              />
            </div>
            <div className='order-1 lg:order-2 space-y-4'>
              <div className='inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm'>
                Our Values
              </div>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
                What We Stand For
              </h2>
              <div className='space-y-6'>
                <div className='space-y-2'>
                  <h3 className='text-xl font-semibold'>Compassion</h3>
                  <p className='text-gray-500'>
                    We treat every animal with kindness and respect, recognizing
                    their inherent worth and dignity.
                  </p>
                </div>
                <div className='space-y-2'>
                  <h3 className='text-xl font-semibold'>Dedication</h3>
                  <p className='text-gray-500'>
                    We are committed to providing the best possible care for all
                    dogs in our shelter, no matter their condition.
                  </p>
                </div>
                <div className='space-y-2'>
                  <h3 className='text-xl font-semibold'>Education</h3>
                  <p className='text-gray-500'>
                    We believe in spreading awareness about responsible pet
                    ownership and the importance of animal welfare.
                  </p>
                </div>
                <div className='space-y-2'>
                  <h3 className='text-xl font-semibold'>Community</h3>
                  <p className='text-gray-500'>
                    We value the support of our community and work together to
                    create a better world for dogs and humans alike.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className='py-12 md:py-24'>
        <div className='container px-4 md:px-6'>
          <div className='text-center space-y-4 max-w-3xl mx-auto mb-12'>
            <div className='inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm'>
              Get In Touch
            </div>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
              Contact Us
            </h2>
            <p className='text-gray-500'>
              Have questions or want to learn more about our work? We'd love to
              hear from you.
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            <div className='bg-white p-6 rounded-lg shadow-sm text-center'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-500 mb-4'>
                <Mail className='h-6 w-6' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>Email Us</h3>
              <p className='text-gray-500'>info@praptifoundation.org</p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm text-center'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-500 mb-4'>
                <Phone className='h-6 w-6' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>Call Us</h3>
              <p className='text-gray-500'>+91 123 456 7890</p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm text-center'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-500 mb-4'>
                <MapPin className='h-6 w-6' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>Visit Us</h3>
              <p className='text-gray-500'>
                Prapti Foundation Shelter, Golaghat, Assam, India
              </p>
            </div>
          </div>

          <div className='mt-12 text-center'>
            <Link to='/contact'>
              <Button className='bg-orange-500 hover:bg-orange-600'>
                Send Us a Message
              </Button>
            </Link>
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
              <Link to='/donate'>
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
