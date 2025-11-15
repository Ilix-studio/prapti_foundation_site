import React from "react";
import { motion } from "framer-motion";

const BankStatementCard: React.FC = () => {
  return (
    <>
      <section className='relative py-16 md:py-24 bg-amber-50'>
        <div className='container px-4 md:px-6'>
          <div className='max-w-3xl mx-auto text-center space-y-4'>
            <motion.h1
              className='text-4xl font-bold tracking-tighter sm:text-5xl'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Support Our Cause
            </motion.h1>
            <p className='text-gray-500 md:text-xl'>
              Your generosity helps us provide shelter, food, and medical care
              to dogs in need.
            </p>
          </div>
        </div>
      </section>

      <div className=' p-4 sm:p-6 lg:p-8 flex items-center justify-center'>
        <div className='w-full max-w-4xl shadow-lg'>
          <div className='p-6 sm:p-8 lg:p-12'>
            {/* Header Section */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pb-6'>
              <div>
                <div className='text-sm text-gray-600 mb-1'>Bank Name:</div>
                <div className='text-base sm:text-lg font-medium text-gray-900'>
                  The Assam Co-operative Apex Bank Ltd.
                </div>
              </div>
              <div>
                <div className='text-sm text-gray-600 mb-1'>Branch Name:</div>
                <div className='text-base sm:text-lg font-medium text-gray-900'>
                  Golaghat
                </div>
              </div>
            </div>

            {/* Account Details Section */}
            <div className='space-y-4'>
              <div className='grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 sm:gap-4'>
                <div className='text-sm text-gray-600'>Account ID</div>
                <div className='text-base font-medium text-gray-900'>
                  411042010016145
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 sm:gap-4'>
                <div className='text-sm text-gray-600'>Name</div>
                <div className='text-base font-medium text-gray-900'>
                  PRAPTI FOUNDATION
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 sm:gap-4'>
                <div className='text-sm text-gray-600'>Joint Name</div>
                <div className='text-base font-medium text-gray-900'>-</div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 sm:gap-4'>
                <div className='text-sm text-gray-600'>Add1</div>
                <div className='text-base font-medium text-gray-900'>
                  WARD NO 13 GF ROAD
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 sm:gap-4'>
                <div className='text-sm text-gray-600'>Add2</div>
                <div className='text-base font-medium text-gray-900'>
                  Golaghat - 785621
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 sm:gap-4'>
                <div className='text-sm text-gray-600'>Pin Code</div>
                <div className='text-base font-medium text-gray-900'>
                  PO GOLAGHAT DIST GOLAGHAT, ASSAM
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BankStatementCard;
