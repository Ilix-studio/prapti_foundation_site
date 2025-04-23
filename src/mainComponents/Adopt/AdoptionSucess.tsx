import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Home, CalendarDays, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "../../mainComponents/Header";
import Footer from "../../mainComponents/Footer";

const AdoptionSuccess: React.FC = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />

      <main className='flex-1 bg-amber-50 py-16 md:py-24'>
        <div className='container px-4 md:px-6'>
          <motion.div
            className='max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className='bg-orange-500 p-6 text-white text-center'>
              <div className='bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4'>
                <Check className='h-10 w-10 text-orange-500' />
              </div>
              <h1 className='text-2xl md:text-3xl font-bold'>
                Application Received!
              </h1>
              <p className='mt-2 text-white/90'>
                Thank you for your interest in adopting a dog
              </p>
            </div>

            <div className='p-6 md:p-8'>
              <div className='space-y-6'>
                <div className='text-center'>
                  <h2 className='text-xl font-semibold mb-2'>
                    What Happens Next?
                  </h2>
                  <p className='text-gray-600'>
                    Our team will review your application and contact you within
                    2-3 business days to discuss the next steps in the adoption
                    process.
                  </p>
                </div>

                <div className='border-t border-b py-6 space-y-4'>
                  <div className='flex items-start gap-4'>
                    <div className='bg-orange-100 rounded-full p-2 mt-1'>
                      <CalendarDays className='h-5 w-5 text-orange-500' />
                    </div>
                    <div>
                      <h3 className='font-medium'>Application Review</h3>
                      <p className='text-gray-600 text-sm'>
                        Our adoption team will carefully review your application
                        to ensure we find the best match for you and our dogs.
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start gap-4'>
                    <div className='bg-orange-100 rounded-full p-2 mt-1'>
                      <PawPrint className='h-5 w-5 text-orange-500' />
                    </div>
                    <div>
                      <h3 className='font-medium'>Meet and Greet</h3>
                      <p className='text-gray-600 text-sm'>
                        If your application is approved, we'll schedule a time
                        for you to meet potential dogs that match your
                        preferences.
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start gap-4'>
                    <div className='bg-orange-100 rounded-full p-2 mt-1'>
                      <Home className='h-5 w-5 text-orange-500' />
                    </div>
                    <div>
                      <h3 className='font-medium'>Bringing Your Dog Home</h3>
                      <p className='text-gray-600 text-sm'>
                        Once we've found your perfect match, we'll guide you
                        through the final adoption process and support you as
                        your dog settles into their new home.
                      </p>
                    </div>
                  </div>
                </div>

                <div className='text-center space-y-4'>
                  <p className='text-gray-600'>
                    Have questions about your application? Contact us at:
                  </p>
                  <p className='text-orange-500 font-medium'>
                    adoption@praptifoundation.org
                  </p>
                  <div className='pt-2'>
                    <Link to='/'>
                      <Button className='bg-orange-500 hover:bg-orange-600'>
                        Return to Homepage
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdoptionSuccess;
