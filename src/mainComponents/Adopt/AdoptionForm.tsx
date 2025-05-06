import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PawPrint, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "../../mainComponents/Header";
import Footer from "../../mainComponents/Footer";

const AdoptionForm: React.FC = () => {
  const navigate = useNavigate();

  const handleWhatsAppContact = () => {
    // Replace with your actual WhatsApp number
    window.open(
      "https://wa.me/919876543210?text=I'm%20interested%20in%20adopting%20a%20dog%20from%20Prapti%20Foundation",
      "_blank"
    );
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />

      <main className='flex-1 bg-amber-50'>
        {/* Hero Banner */}
        <section className='relative py-12 md:py-16 bg-orange-200'>
          <div className='container px-4 md:px-6 text-center'>
            <motion.h1
              className='text-3xl md:text-4xl font-bold text-black mb-4'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Adopt a Dog
            </motion.h1>
            <motion.p
              className='max-w-2xl mx-auto text-black/90 text-lg'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Begin your journey of giving a loving home to one of our rescued
              dogs by contacting us directly.
            </motion.p>
          </div>
        </section>

        <section className='container px-4 md:px-6 py-12'>
          <div className='max-w-3xl mx-auto'>
            <div className='bg-white rounded-lg shadow-md p-6 md:p-8 text-center'>
              {/* WhatsApp Contact Information */}
              <div className='mb-8 flex flex-col items-center gap-4'>
                <PawPrint className='h-12 w-12 text-orange-500' />
                <div>
                  <h2 className='text-2xl font-bold'>Contact Us to Adopt</h2>
                  <p className='text-gray-500 max-w-lg mx-auto mt-2'>
                    Instead of filling out a form, we prefer to chat with you
                    directly about your adoption interests. This helps us match
                    you with the perfect furry companion for your home and
                    lifestyle.
                  </p>
                </div>
              </div>

              <div className='p-6 bg-green-50 rounded-lg max-w-md mx-auto mb-8'>
                <h3 className='font-semibold text-lg mb-3'>How it works:</h3>
                <ol className='text-left space-y-3 mb-6'>
                  <li className='flex items-start gap-2'>
                    <span className='bg-green-200 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5'>
                      1
                    </span>
                    <span>
                      Contact us via WhatsApp with your adoption interest
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='bg-green-200 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5'>
                      2
                    </span>
                    <span>
                      Our team will ask about your living situation and
                      preferences
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='bg-green-200 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5'>
                      3
                    </span>
                    <span>
                      Schedule a visit to meet potential furry friends
                    </span>
                  </li>
                </ol>

                <Button
                  onClick={handleWhatsAppContact}
                  className='bg-green-500 hover:bg-green-600 w-full flex items-center justify-center gap-2 py-6'
                >
                  <MessageCircle className='h-5 w-5' />
                  Contact Us on WhatsApp
                </Button>
              </div>

              <div className='border-t pt-6'>
                <h3 className='font-semibold mb-3'>
                  Why adopt from Prapti Foundation?
                </h3>
                <div className='grid md:grid-cols-3 gap-4 text-left'>
                  <div className='p-4 bg-amber-50 rounded'>
                    <h4 className='font-medium'>Rescued Dogs</h4>
                    <p className='text-sm text-gray-600'>
                      All our dogs are rescued from difficult situations and
                      deserve loving homes.
                    </p>
                  </div>
                  <div className='p-4 bg-amber-50 rounded'>
                    <h4 className='font-medium'>Vaccinated & Healthy</h4>
                    <p className='text-sm text-gray-600'>
                      Every dog is vaccinated, spayed/neutered, and medically
                      cleared.
                    </p>
                  </div>
                  <div className='p-4 bg-amber-50 rounded'>
                    <h4 className='font-medium'>Post-Adoption Support</h4>
                    <p className='text-sm text-gray-600'>
                      We provide guidance and support even after you bring your
                      new friend home.
                    </p>
                  </div>
                </div>
              </div>

              <div className='mt-8'>
                <Button
                  onClick={() => navigate("/")}
                  variant='outline'
                  className='border-orange-500 text-orange-500 hover:bg-orange-50'
                >
                  Return to Homepage
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AdoptionForm;
