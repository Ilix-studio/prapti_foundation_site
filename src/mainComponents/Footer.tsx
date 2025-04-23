import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  PawPrint,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-gray-50 dark:bg-gray-900 border-t'>
      {/* Newsletter Section */}
      <div className='container mx-auto px-4 py-8 border-b'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
          <div className='max-w-md'>
            <h3 className='text-lg font-semibold mb-2'>Join our newsletter</h3>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Stay updated with our latest news, adoption stories, and events.
            </p>
          </div>
          <div className='w-full md:w-auto max-w-md flex flex-col sm:flex-row gap-2'>
            <Input
              type='email'
              placeholder='Your email address'
              className='w-full focus:border-orange-500'
            />
            <Button className='bg-orange-500 hover:bg-orange-600 whitespace-nowrap'>
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className='container mx-auto px-4 py-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* About Column */}
          <div>
            <div className='flex items-center gap-2 mb-4'>
              <PawPrint className='h-5 w-5 text-orange-500' />
              <span className='text-lg font-bold'>Prapti Foundation</span>
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
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className='text-md font-semibold mb-4'>Quick Links</h3>
            <nav className='flex flex-col space-y-2'>
              <Link
                to='/about-us'
                className='text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors'
              >
                About Us
              </Link>
              <Link
                to='/our-dogs'
                className='text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors'
              >
                Our Dogs
              </Link>
              <Link
                to='/blogs'
                className='text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors'
              >
                Blog
              </Link>
              <Link
                to='/adopt'
                className='text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors'
              >
                Adoption Process
              </Link>
              <Link
                to='/report'
                className='text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors'
              >
                Report a Dog
              </Link>
            </nav>
          </div>

          {/* Support Column */}
          <div>
            <h3 className='text-md font-semibold mb-4'>Support Us</h3>
            <nav className='flex flex-col space-y-2'>
              <Link
                to='/donate'
                className='text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors'
              >
                Make a Donation
              </Link>
              <Link
                to='/volunteer'
                className='text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors'
              >
                Volunteer
              </Link>
              <Link
                to='/sponsor'
                className='text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors'
              >
                Sponsor a Dog
              </Link>
              <Link
                to='/fundraise'
                className='text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors'
              >
                Fundraise for Us
              </Link>
              <Link
                to='/supplies'
                className='text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors'
              >
                Donate Supplies
              </Link>
            </nav>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className='text-md font-semibold mb-4'>Contact Us</h3>
            <div className='space-y-3'>
              <div className='flex items-start gap-3'>
                <MapPin className='h-4 w-4 text-orange-500 mt-0.5' />
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                  Golaghat, Assam, India
                </span>
              </div>
              <div className='flex items-center gap-3'>
                <Phone className='h-4 w-4 text-orange-500' />
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                  +91 12345 67890
                </span>
              </div>
              <div className='flex items-center gap-3'>
                <Mail className='h-4 w-4 text-orange-500' />
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                  info@praptifoundation.org
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className='border-t'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              © {currentYear} Prapti Foundation. All rights reserved.
            </p>
            <p className='text-xs text-gray-500 mt-2 sm:mt-0'>
              Designed by{" "}
              <Link
                to='https://ilix-hazarika.vercel.app/'
                target='_blank'
                rel='noopener noreferrer'
                className='text-orange-500 hover:underline'
              >
                ilix-studio
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
