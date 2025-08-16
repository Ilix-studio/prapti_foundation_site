import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  PawPrint,
  Eye,
  Users,
  TrendingUp,
  Calendar,
} from "lucide-react";

// Import Visitor API hooks
import {
  useIncrementVisitorCounterMutation,
  useGetVisitorCountQuery,
  useLazyGetVisitorCountQuery,
} from "@/redux-store/services/visitorApi";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [visitorTracked, setVisitorTracked] = useState(false);
  const [showVisitorAnimation, setShowVisitorAnimation] = useState(false);

  // Visitor tracking hooks
  const [
    incrementVisitorCounter,
    { isLoading: incrementLoading, error: incrementError },
  ] = useIncrementVisitorCounterMutation();

  const [getVisitorCount] = useLazyGetVisitorCountQuery();

  const { data: currentVisitorData, isLoading: visitorCountLoading } =
    useGetVisitorCountQuery();

  // Check if user has visited before
  const isReturningVisitor = (): boolean => {
    return localStorage.getItem("visitor_tracked") === "true";
  };

  // Mark user as having visited
  const markAsVisited = (): void => {
    localStorage.setItem("visitor_tracked", "true");
    setVisitorTracked(true);
  };

  // Track visitor on component mount
  useEffect(() => {
    const trackVisitor = async () => {
      if (visitorTracked) return; // Prevent double tracking

      try {
        const returning = isReturningVisitor();

        if (returning) {
          // Returning visitor - just get current count
          console.log("Returning visitor detected");
          await getVisitorCount().unwrap();
        } else {
          // New visitor - increment count
          console.log("New visitor detected, incrementing counter");
          const result = await incrementVisitorCounter().unwrap();
          markAsVisited();
          setShowVisitorAnimation(true);
          console.log("Visitor count incremented to:", result.count);

          // Hide animation after 3 seconds
          setTimeout(() => setShowVisitorAnimation(false), 3000);
        }
      } catch (error) {
        console.error("Error tracking visitor:", error);
        // Fallback: try to get current count
        try {
          await getVisitorCount().unwrap();
        } catch (fallbackError) {
          console.error("Fallback visitor count failed:", fallbackError);
        }
      }
    };

    // Track visitor after a short delay to ensure proper loading
    const timer = setTimeout(trackVisitor, 1000);
    return () => clearTimeout(timer);
  }, [incrementVisitorCounter, getVisitorCount, visitorTracked]);

  // Fixed variants with proper TypeScript typing
  const visitorVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }, // Cubic bezier for ease-out
    },
    pulse: {
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity },
    },
  };

  const newVisitorVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.3 },
    },
  };

  return (
    <footer className='bg-gray-50 dark:bg-gray-900 border-t relative overflow-hidden'>
      {/* Visitor Tracking Section */}
      <div className='bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 border-b'>
        <div className='container mx-auto px-4 py-4'>
          <motion.div
            className='flex flex-col sm:flex-row items-center justify-between gap-4'
            initial='hidden'
            animate='visible'
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {/* Main Visitor Counter */}
            <motion.div
              className='flex items-center gap-3'
              variants={visitorVariants}
              animate={showVisitorAnimation ? "pulse" : "visible"}
            >
              <div className='flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md'>
                <Eye className='w-4 h-4 text-orange-500' />
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  {visitorCountLoading || incrementLoading ? (
                    <span className='animate-pulse'>Loading...</span>
                  ) : (
                    <>
                      {currentVisitorData?.count?.toLocaleString() || "0"}{" "}
                      visitors
                    </>
                  )}
                </span>
                {showVisitorAnimation && (
                  <TrendingUp className='w-3 h-3 text-green-500 animate-pulse' />
                )}
              </div>
            </motion.div>

            {/* Visitor Status and Stats */}
            <motion.div
              className='flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-gray-400'
              variants={visitorVariants}
            >
              {/* Visitor Status */}
              <div className='flex items-center gap-1'>
                <Users className='w-3 h-3' />
                <span>
                  {isReturningVisitor() ? "Welcome back!" : "First visit"}
                </span>
              </div>

              {/* Live indicator */}
              <div className='flex items-center gap-1'>
                <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                <span>Live</span>
              </div>

              {/* Current date */}
              <div className='flex items-center gap-1'>
                <Calendar className='w-3 h-3' />
                <span>{new Date().toLocaleDateString()}</span>
              </div>

              {/* New visitor animation */}
              <AnimatePresence>
                {showVisitorAnimation && (
                  <motion.div
                    className='flex items-center gap-1 text-green-600 font-medium'
                    variants={newVisitorVariants}
                    initial='hidden'
                    animate='visible'
                    exit='exit'
                  >
                    <TrendingUp className='w-3 h-3' />
                    <span>+1 New Visitor!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Error handling */}
          {incrementError && (
            <motion.div
              className='mt-2 text-xs text-red-500 text-center'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Unable to track visitor count
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className='container mx-auto px-4 py-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* About Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className='flex items-center gap-2 mb-4'>
              <PawPrint className='h-5 w-5 text-orange-500' />
              <Link to='/'>
                <span className='text-lg font-bold'>Prapti Foundation</span>
              </Link>
            </div>

            <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
              A sanctuary for stray dogs, providing shelter, food, and medical
              care to homeless dogs in Golaghat since 2017.
            </p>
            <div className='flex items-center gap-3'>
              <a
                href='https://facebook.com'
                aria-label='Facebook'
                className='text-gray-500 hover:text-orange-500 transition-colors'
              >
                <Facebook size={18} />
              </a>
              <a
                href='https://instagram.com'
                aria-label='Instagram'
                className='text-gray-500 hover:text-orange-500 transition-colors'
              >
                <Instagram size={18} />
              </a>
              <a
                href='https://twitter.com'
                aria-label='Twitter'
                className='text-gray-500 hover:text-orange-500 transition-colors'
              >
                <Twitter size={18} />
              </a>
            </div>
          </motion.div>

          {/* Quick Links Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className='text-md font-semibold mb-4'>Quick Links</h3>
            <nav className='flex flex-col space-y-2'>
              <Link
                to='/about'
                className='text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors'
              >
                About Us
              </Link>
              <Link
                to='/blog'
                className='text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors'
              >
                Our Blog
              </Link>
              <Link
                to='/gallery'
                className='text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors'
              >
                Gallery
              </Link>
              <Link
                to='/volunteer'
                className='text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors'
              >
                Volunteer
              </Link>
              <Link
                to='/support'
                className='text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors'
              >
                Support Us
              </Link>
            </nav>
          </motion.div>

          {/* Services Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className='text-md font-semibold mb-4'>Our Services</h3>
            <nav className='flex flex-col space-y-2'>
              <Link
                to='/adopt'
                className='text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors'
              >
                Adoption
              </Link>
              <Link
                to='/report'
                className='text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors'
              >
                Report Stray
              </Link>
              <span className='text-sm text-gray-600 dark:text-gray-400'>
                Medical Care
              </span>
              <span className='text-sm text-gray-600 dark:text-gray-400'>
                Rescue Operations
              </span>
            </nav>
          </motion.div>

          {/* Contact Info Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className='text-md font-semibold mb-4'>Get in Touch</h3>
            <div className='space-y-3'>
              <div className='flex items-start gap-2'>
                <MapPin className='h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0' />
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Golaghat, Assam, India
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <Phone className='h-4 w-4 text-orange-500 flex-shrink-0' />
                <a
                  href='tel:+911234567890'
                  className='text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors'
                >
                  +91 12345 67890
                </a>
              </div>
              <div className='flex items-center gap-2'>
                <Mail className='h-4 w-4 text-orange-500 flex-shrink-0' />
                <a
                  href='mailto:info@praptifoundation.org'
                  className='text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors'
                >
                  info@praptifoundation.org
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Footer */}
      <motion.div
        className='border-t bg-gray-100 dark:bg-gray-800'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className='container mx-auto px-4 py-4'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
            <div className='flex items-center gap-4 text-xs text-gray-500'>
              <p>© {currentYear} Prapti Foundation. All rights reserved.</p>
            </div>
            <p className='text-xs text-gray-700'>
              Paw-crafted with 🧡 by{" "}
              <Link
                to='https://ilix-hazarika.vercel.app/'
                target='_blank'
                rel='noopener noreferrer'
                className='text-orange-500 hover:underline font-bold'
              >
                Ilix-Studio
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Floating particles effect */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute w-1 h-1 bg-orange-200 rounded-full opacity-30'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </footer>
  );
};

export default Footer;
