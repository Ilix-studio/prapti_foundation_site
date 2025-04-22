import React from "react";
import { Link } from "react-router-dom";
import { PawPrint, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Footer from "./Footer";

const NotFound: React.FC = () => {
  return (
    <div className='flex flex-col min-h-screen bg-amber-50'>
      <div className='container flex flex-col items-center justify-center flex-1 px-4 py-12 mx-auto text-center'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='space-y-6'
        >
          <PawPrint className='h-24 w-24 text-orange-500 mx-auto' />

          <h1 className='text-6xl font-bold text-gray-900 md:text-8xl'>404</h1>

          <h2 className='text-3xl font-semibold text-gray-700'>
            Page Not Found
          </h2>

          <p className='max-w-lg mx-auto text-gray-500'>
            Oops! Looks like you've wandered off the trail. This page doesn't
            exist or may have been moved.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center pt-6'>
            <Link to='/'>
              <Button className='bg-orange-500 hover:bg-orange-600 min-w-40'>
                <Home className='mr-2 h-4 w-4' />
                Go Home
              </Button>
            </Link>

            <Link to='/our-dogs'>
              <Button
                variant='outline'
                className='border-orange-500 text-orange-500 hover:bg-orange-50 min-w-40'
              >
                <PawPrint className='mr-2 h-4 w-4' />
                Meet Our Dogs
              </Button>
            </Link>
          </div>

          <div className='pt-8'>
            <Link
              to='/'
              className='inline-flex items-center text-sm font-medium text-orange-500 hover:underline'
            >
              <ArrowLeft className='mr-1 h-4 w-4' />
              Back to homepage
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
