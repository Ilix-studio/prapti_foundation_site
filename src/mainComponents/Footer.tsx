import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className='flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6'>
        <p className='text-xs text-gray-500'>
          © 2025 Prapti Foundation. All rights reserved.
        </p>
        <nav className='sm:ml-auto flex gap-4 sm:gap-6'></nav>
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
      </footer>
    </>
  );
};

export default Footer;
