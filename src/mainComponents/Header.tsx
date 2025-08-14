import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, PawPrint, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <motion.header
      className='sticky top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b'
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='container flex items-center justify-between h-16 px-4 md:px-6'>
        <Link to='/' className='flex items-center gap-2'>
          <PawPrint className='h-6 w-6 text-orange-500' />
          <motion.span
            className='text-xl font-bold'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Prapti Foundation
          </motion.span>
        </Link>

        <div className='hidden md:flex md:items-center md:gap-4'>
          <nav className='flex items-center gap-6'>
            <Link
              to='/'
              className='relative text-sm font-medium hover:text-orange-500 transition-colors duration-200 group'
            >
              Home
              {/* Decorative underline for active state */}
              <span
                className={`absolute -bottom-1 left-0 h-1 bg-orange-500 transition-all duration-300 ${
                  isActive("/") ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>

            <Link
              to='/about'
              className='relative text-sm font-medium hover:text-orange-500 transition-colors duration-200 group'
            >
              About us
              <span
                className={`absolute -bottom-1 left-0 h-1 bg-orange-500 transition-all duration-300 ${
                  isActive("/about") ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>

            <Link
              to='/blog'
              className='relative text-sm font-medium hover:text-orange-500 transition-colors duration-200 group'
            >
              Blogs
              <span
                className={`absolute -bottom-1 left-0 h-1 bg-orange-500 transition-all duration-300 ${
                  isActive("/blog") ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>

            <Link
              to='/gallery'
              className='relative text-sm font-medium hover:text-orange-500 transition-colors duration-200 group'
            >
              Gallery
              <span
                className={`absolute -bottom-1 left-0 h-1 bg-orange-500 transition-all duration-300 ${
                  isActive("/gallery") ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>

            <Link
              to='/volunteer'
              className='relative text-sm font-medium hover:text-orange-500 transition-colors duration-200 group'
            >
              Volunteer
              <span
                className={`absolute -bottom-1 left-0 h-1 bg-orange-500 transition-all duration-300 ${
                  isActive("/volunteer") ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>

            <Link
              to='/contact'
              className='relative text-sm font-medium hover:text-orange-500 transition-colors duration-200 group'
            >
              Contact
              <span
                className={`absolute -bottom-1 left-0 h-1 bg-orange-500 transition-all duration-300 ${
                  isActive("/contact") ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
          </nav>
        </div>

        <button
          className='md:hidden'
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <motion.div
          className='md:hidden'
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.9 }}
        >
          <nav className='flex flex-col p-4 space-y-4 border-t bg-background'>
            <Link
              to='/'
              className={`relative text-sm font-medium transition-colors duration-200 py-2 ${
                isActive("/")
                  ? "text-orange-500 border-l-2 border-orange-500 pl-3"
                  : "hover:text-orange-500 hover:border-l-2 hover:border-orange-500 hover:pl-3"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            <Link
              to='/about'
              className={`relative text-sm font-medium transition-colors duration-200 py-2 ${
                isActive("/about")
                  ? "text-orange-500 border-l-2 border-orange-500 pl-3"
                  : "hover:text-orange-500 hover:border-l-2 hover:border-orange-500 hover:pl-3"
              }`}
              onClick={() => setIsOpen(false)}
            >
              About us
            </Link>

            <Link
              to='/blog'
              className={`relative text-sm font-medium transition-colors duration-200 py-2 ${
                isActive("/blog")
                  ? "text-orange-500 border-l-2 border-orange-500 pl-3"
                  : "hover:text-orange-500 hover:border-l-2 hover:border-orange-500 hover:pl-3"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Blogs
            </Link>

            <Link
              to='/gallery'
              className={`relative text-sm font-medium transition-colors duration-200 py-2 ${
                isActive("/gallery")
                  ? "text-orange-500 border-l-2 border-orange-500 pl-3"
                  : "hover:text-orange-500 hover:border-l-2 hover:border-orange-500 hover:pl-3"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Gallery
            </Link>

            <Link
              to='/contact'
              className={`relative text-sm font-medium transition-colors duration-200 py-2 ${
                isActive("/contact")
                  ? "text-orange-500 border-l-2 border-orange-500 pl-3"
                  : "hover:text-orange-500 hover:border-l-2 hover:border-orange-500 hover:pl-3"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Contact us
            </Link>

            <Link
              to='/volunteer'
              className={`relative text-sm font-medium transition-colors duration-200 py-2 ${
                isActive("/volunteer")
                  ? "text-orange-500 border-l-2 border-orange-500 pl-3"
                  : "hover:text-orange-500 hover:border-l-2 hover:border-orange-500 hover:pl-3"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Join as a Volunteer
            </Link>

            <div className='flex flex-col gap-2 pt-2 mt-4 border-t border-gray-200'>
              <Link to='/adopt' onClick={() => setIsOpen(false)}>
                <Button
                  variant='outline'
                  className='w-full hover:border-orange-500 hover:text-orange-500'
                >
                  Adopt a dog
                </Button>
              </Link>
              <Link to='/support' onClick={() => setIsOpen(false)}>
                <Button className='w-full bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'>
                  Support our cause
                </Button>
              </Link>
            </div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
