// src/components/public/TotalImpactView.tsx
import React from "react";
import { motion } from "framer-motion";
import { useGetLatestTotalImpactQuery } from "@/redux-store/services/impactApi";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Home, Users, Loader2, AlertCircle } from "lucide-react";

const TotalImpactView: React.FC = () => {
  const {
    data: impactResponse,
    isLoading,
    error,
  } = useGetLatestTotalImpactQuery();

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='mt-12 mb-16 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'
      >
        <Card className='bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 '>
          <CardContent className='p-8 sm:p-10 lg:p-12'>
            <div className='flex items-center justify-center space-x-3'>
              <Loader2 className='w-7 h-7 animate-spin text-orange-600' />
              <span className='text-gray-700 font-medium'>
                Loading impact data...
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='mt-12 mb-16 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'
      >
        <Card className='bg-gradient-to-r from-red-50 to-pink-50 border-red-200 '>
          <CardContent className='p-8 sm:p-10 lg:p-12'>
            <div className='flex items-center justify-center text-red-600'>
              <AlertCircle className='w-6 h-6 mr-3' />
              <span className='font-medium'>Unable to load impact data</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!impactResponse?.data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='mt-12 mb-16 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'
      >
        <Card className='bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 '>
          <CardContent className='p-8 sm:p-10 lg:p-12'>
            <div className='text-center text-gray-600'>
              <p className='font-medium'>No impact data available</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const impact = impactResponse.data;

  return (
    <section className='py-12 sm:py-16 lg:py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className='animate-in fade-in duration-1000'
        >
          <Card className='bg-white duration-300 relative overflow-hidden'>
            {/* Decorative SVG Background Elements */}
            <div className='absolute inset-0 pointer-events-none'>
              {/* Top-left decorative pattern */}
              <svg
                className='absolute top-0 left-0 w-32 h-32 text-orange-100 opacity-60'
                viewBox='0 0 100 100'
                fill='none'
              >
                <circle cx='20' cy='20' r='8' fill='currentColor' />
                <circle cx='50' cy='15' r='5' fill='currentColor' />
                <circle cx='80' cy='25' r='6' fill='currentColor' />
                <circle cx='15' cy='50' r='4' fill='currentColor' />
                <circle cx='75' cy='60' r='7' fill='currentColor' />
                <path
                  d='M10 30 Q30 10 50 30 T90 30'
                  stroke='currentColor'
                  strokeWidth='2'
                  fill='none'
                  opacity='0.5'
                />
              </svg>

              {/* Bottom-right decorative pattern */}
              <svg
                className='absolute bottom-0 right-0 w-40 h-40 text-blue-100 opacity-50'
                viewBox='0 0 120 120'
                fill='none'
              >
                <path
                  d='M20 100 C30 80, 50 80, 60 100 C70 120, 90 120, 100 100'
                  stroke='currentColor'
                  strokeWidth='3'
                  fill='none'
                />
                <circle
                  cx='100'
                  cy='20'
                  r='10'
                  fill='currentColor'
                  opacity='0.7'
                />
                <circle
                  cx='80'
                  cy='40'
                  r='6'
                  fill='currentColor'
                  opacity='0.5'
                />
                <circle
                  cx='60'
                  cy='20'
                  r='8'
                  fill='currentColor'
                  opacity='0.6'
                />
                <rect
                  x='90'
                  y='80'
                  width='12'
                  height='12'
                  rx='2'
                  fill='currentColor'
                  opacity='0.4'
                />
              </svg>

              {/* Center decorative elements */}
              <svg
                className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 text-green-50 opacity-30'
                viewBox='0 0 200 200'
                fill='none'
              >
                <path
                  d='M100 20 C140 60, 140 140, 100 180 C60 140, 60 60, 100 20 Z'
                  fill='currentColor'
                  opacity='0.3'
                />
                <circle
                  cx='100'
                  cy='100'
                  r='40'
                  stroke='currentColor'
                  strokeWidth='2'
                  fill='none'
                  opacity='0.4'
                />
                <circle
                  cx='100'
                  cy='100'
                  r='60'
                  stroke='currentColor'
                  strokeWidth='1'
                  fill='none'
                  opacity='0.2'
                />
              </svg>
            </div>

            <CardContent className='p-8 sm:p-10 lg:p-12 relative z-10'>
              {/* Header Section */}
              <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12'>
                <div className='flex-1 space-y-3 relative'>
                  {/* Small decorative SVG near the title */}
                  <div className='absolute -left-8 top-0 hidden lg:block'>
                    <svg
                      className='w-6 h-6 text-orange-300'
                      viewBox='0 0 24 24'
                      fill='none'
                    >
                      <path
                        d='M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z'
                        fill='currentColor'
                      />
                    </svg>
                  </div>
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight relative inline-block'
                  >
                    Foundation Impact
                    <div className='absolute bottom-0 left-0 w-full h-1 bg-[#F26649] rounded-full'></div>
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className='text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed max-w-lg'
                  >
                    Making a difference
                  </motion.p>
                </div>

                {/* Stats Grid */}
                <div className='flex flex-row sm:flex-row justify-center lg:justify-end items-center gap-6 sm:gap-8 lg:gap-12'>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 0.4,
                      type: "spring",
                      stiffness: 120,
                      damping: 10,
                    }}
                    className='text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-200 relative'
                  >
                    {/* Small decorative SVG for each stat */}
                    <div className='absolute -top-2 -right-2'>
                      <svg
                        className='w-4 h-4 text-orange-200'
                        viewBox='0 0 16 16'
                        fill='none'
                      >
                        <circle
                          cx='8'
                          cy='8'
                          r='6'
                          fill='currentColor'
                          opacity='0.6'
                        />
                        <circle cx='8' cy='8' r='3' fill='white' />
                      </svg>
                    </div>

                    <div className='flex flex-col items-center space-y-2'>
                      <div className='p-2 rounded-full bg-orange-100'>
                        <Heart className='w-6 h-6 sm:w-7 sm:h-7 text-orange-600' />
                      </div>
                      <p className='text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-600 leading-none'>
                        {impact.dogsRescued}
                      </p>
                      <p className='text-xs sm:text-sm text-gray-600 font-medium'>
                        Dogs Rescued
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 0.5,
                      type: "spring",
                      stiffness: 120,
                      damping: 10,
                    }}
                    className='text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-200 relative'
                  >
                    <div className='absolute -top-2 -right-2'>
                      <svg
                        className='w-4 h-4 text-green-200'
                        viewBox='0 0 16 16'
                        fill='none'
                      >
                        <rect
                          x='2'
                          y='2'
                          width='12'
                          height='12'
                          rx='2'
                          fill='currentColor'
                          opacity='0.6'
                        />
                        <rect
                          x='5'
                          y='5'
                          width='6'
                          height='6'
                          rx='1'
                          fill='white'
                        />
                      </svg>
                    </div>

                    <div className='flex flex-col items-center space-y-2'>
                      <div className='p-2 rounded-full bg-green-100'>
                        <Home className='w-6 h-6 sm:w-7 sm:h-7 text-green-600' />
                      </div>
                      <p className='text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 leading-none'>
                        {impact.dogsAdopted}
                      </p>
                      <p className='text-xs sm:text-sm text-gray-600 font-medium'>
                        Adopted
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 0.6,
                      type: "spring",
                      stiffness: 120,
                      damping: 10,
                    }}
                    className='text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-200 relative'
                  >
                    <div className='absolute -top-2 -right-2'>
                      <svg
                        className='w-4 h-4 text-blue-200'
                        viewBox='0 0 16 16'
                        fill='none'
                      >
                        <polygon
                          points='8,2 10,6 14,6 11,9 12,14 8,11 4,14 5,9 2,6 6,6'
                          fill='currentColor'
                          opacity='0.6'
                        />
                      </svg>
                    </div>

                    <div className='flex flex-col items-center space-y-2'>
                      <div className='p-2 rounded-full bg-blue-100'>
                        <Users className='w-6 h-6 sm:w-7 sm:h-7 text-blue-600' />
                      </div>
                      <p className='text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 leading-none'>
                        {impact.volunteers}
                      </p>
                      <p className='text-xs sm:text-sm text-gray-600 font-medium'>
                        Volunteers
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Bottom decorative element */}
              <div className='mt-8 flex justify-center'>
                <svg
                  className='w-24 h-6 text-gray-200'
                  viewBox='0 0 120 24'
                  fill='none'
                >
                  <path
                    d='M0 12 Q30 0 60 12 T120 12'
                    stroke='currentColor'
                    strokeWidth='2'
                    fill='none'
                    opacity='0.5'
                  />
                  <circle
                    cx='20'
                    cy='12'
                    r='2'
                    fill='currentColor'
                    opacity='0.7'
                  />
                  <circle
                    cx='60'
                    cy='12'
                    r='3'
                    fill='currentColor'
                    opacity='0.8'
                  />
                  <circle
                    cx='100'
                    cy='12'
                    r='2'
                    fill='currentColor'
                    opacity='0.7'
                  />
                </svg>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default TotalImpactView;
