// HeroSection.tsx
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className='relative min-h-screen flex items-center overflow-hidden pt-16'>
      {/* Hero image container with overlay */}
      <div className='absolute inset-0 z-0'>
        <img
          src='/src/assets/A.jpg'
          alt='Dogs at Prapti Foundation shelter'
          className='w-full h-full object-cover object-center'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-black/70 to-black/30'></div>
      </div>

      <div className='container relative z-10 px-4 md:px-6 py-12 md:py-20'>
        <div className='max-w-3xl space-y-6'>
          <motion.h1
            className='text-4xl md:text-6xl font-bold text-white'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            A Sanctuary for Stray Dogs
          </motion.h1>
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
                className='bg-black hover:bg-gray-800 text-white w-full'
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
    </section>
  );
}
