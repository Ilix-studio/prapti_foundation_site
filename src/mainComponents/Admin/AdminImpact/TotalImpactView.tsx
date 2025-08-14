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
        <Card className='bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 shadow-lg'>
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
        <Card className='bg-gradient-to-r from-red-50 to-pink-50 border-red-200 shadow-lg'>
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
        <Card className='bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 shadow-lg'>
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
          <Card className='bg-white  shadow-xl hover:shadow-2xl transition-shadow duration-300'>
            <CardContent className='p-8 sm:p-10 lg:p-12'>
              {/* Header Section */}
              <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12'>
                <div className='flex-1 space-y-3'>
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight'
                  >
                    Foundation Impact
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className='text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed max-w-lg'
                  >
                    Making a difference in the community through your efforts
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
                    className='text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-200'
                  >
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
                    className='text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-200'
                  >
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
                    className='text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-200'
                  >
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
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default TotalImpactView;
