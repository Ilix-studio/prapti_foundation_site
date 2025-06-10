import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, PawPrint, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

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
              to='/about'
              className='text-sm font-medium hover:text-primary transition-colors'
            >
              About us
            </Link>

            <Link
              to='/blog'
              className='text-sm font-medium hover:text-primary transition-colors'
            >
              Blogs
            </Link>
            <Link
              to='/gallery'
              className='text-sm font-medium hover:text-primary transition-colors'
            >
              Gallery
            </Link>
            <Link
              to='/volunteer'
              className='text-sm font-medium hover:text-primary transition-colors'
            >
              Volunteer
            </Link>
            <Link
              to='/contact'
              className='text-sm font-medium hover:text-primary transition-colors'
            >
              Contact
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
          transition={{ duration: 0.3 }}
        >
          <nav className='flex flex-col p-4 space-y-4 border-t bg-background'>
            <Link
              to='/about'
              className='text-sm font-medium hover:text-primary transition-colors'
              onClick={() => setIsOpen(false)}
            >
              About us
            </Link>

            <Link
              to='/blog'
              className='text-sm font-medium hover:text-primary transition-colors'
              onClick={() => setIsOpen(false)}
            >
              Blogs
            </Link>
            <Link
              to='/volunteer'
              className='text-sm font-medium hover:text-primary transition-colors'
              onClick={() => setIsOpen(false)}
            >
              Join as a Volunteer
            </Link>
            <div className='flex flex-col gap-2 pt-2'>
              <Link to='/adopt' onClick={() => setIsOpen(false)}>
                <Button variant='outline' className='w-full'>
                  Adopt a dog
                </Button>
              </Link>
              <Link to='/support' onClick={() => setIsOpen(false)}>
                <Button className='w-full bg-orange-500 hover:bg-orange-600'>
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
