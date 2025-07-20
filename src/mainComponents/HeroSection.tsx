import { motion } from "framer-motion";
import { ChevronRight, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import HeroSectionBgImg from "./../assets/prapti-main.jpeg";

export function HeroSection() {
  const [showFullImage, setShowFullImage] = useState(false);

  return (
    <section className='relative min-h-screen flex items-center overflow-hidden pt-16'>
      {/* Hero image container with overlay */}
      <div className='absolute inset-0 z-0'>
        <img
          src={HeroSectionBgImg}
          alt='Dogs at Prapti Foundation shelter'
          className='w-full h-full object-cover object-center'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-black/70 to-black/30'></div>
      </div>

      <div className='container relative z-10 px-4 md:px-6 py-12 md:py-20'>
        <div className='max-w-3xl space-y-6'>
          <motion.h2
            className='text-4xl md:text-6xl font-bold text-white'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            A Sanctuary for Stray Dogs
          </motion.h2>
          <motion.p
            className='text-lg md:text-xl text-white'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Since 2017, Prapti Foundation has been providing shelter, food, and
            medical care to homeless dogs in Golaghat. Join us in our mission to
            give every dog the love and care they deserve.
          </motion.p>
          <motion.div
            className='flex flex-col sm:flex-row gap-4 pt-4'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to='/adopt' className='w-full sm:w-auto'>
              <Button
                size='lg'
                className='bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white w-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'
              >
                Adopt a dog
              </Button>
            </Link>
            <Link to='/support' className='w-full sm:w-auto'>
              <Button
                size='lg'
                variant='outline'
                className='bg-orange-500 text-white border-white hover:bg-orange-600 w-full'
              >
                Support our cause
                <ChevronRight className='ml-2 h-4 w-4' />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Preview Card - Bottom Right */}
      <motion.div
        className='absolute bottom-6 right-6 z-20'
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <div className='bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-2 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer'>
          <div
            className='relative w-24 h-16 rounded overflow-hidden'
            onClick={() => setShowFullImage(true)}
          >
            <img
              src={HeroSectionBgImg}
              alt='Hero background preview'
              className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
            />
            <div className='absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center'>
              <Eye className='h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Full Image Modal */}
      {showFullImage && (
        <motion.div
          className='fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowFullImage(false)}
        >
          <motion.div
            className='relative max-w-4xl max-h-[90vh] w-full'
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={HeroSectionBgImg}
              alt='Dogs at Prapti Foundation shelter - Full view'
              className='w-full h-full object-contain rounded-lg'
            />
            <Button
              variant='outline'
              size='icon'
              className='absolute top-4 right-4 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20'
              onClick={() => setShowFullImage(false)}
            >
              <X className='h-4 w-4' />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
