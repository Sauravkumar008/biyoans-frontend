import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../CSS/Navbar.css';
import BiyoansIcon from '../Images/Logo.png';
import { IoPersonCircleSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';

// Helper to read stored user
function getStoredUser() {
  const raw =
    localStorage.getItem("biyoans_user") ||
    sessionStorage.getItem("biyoans_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const storedUser = getStoredUser();

  // check admin role exactly (case-insensitive)
  const isAdmin = !!(
    storedUser &&
    (storedUser.role ?? "").toString().toUpperCase() === "ADMIN"
  );

  const rawAvatar = storedUser?.photoUrl || null;

  // resolve backend URL if it starts with "/"
  const avatar = rawAvatar
    ? rawAvatar.startsWith("/")
      ? `${window.location.protocol}//${window.location.hostname}:${window.location.port === "5173" ? "8080" : window.location.port}${rawAvatar}`
      : rawAvatar
    : null;

  // --- Animation Variants ---
  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        when: 'beforeChildren',
        staggerChildren: 0.1
      },
    },
  };

  const logoVariants = {
    hidden: { scale: 0, opacity: 0, rotate: -180 },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
        duration: 0.2,
        delay: 1
      },
    },
  };

  const brandTextVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.1, ease: 'easeOut', delay: 1 },
    },
  };

  const mobileMenuVariants = {
    closed: { x: '100%', opacity: 0, transition: { type: 'spring', stiffness: 400, damping: 40, when: 'afterChildren', delay: 0.1 } },
    open: { x: '0%', opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 30, staggerChildren: 0.08, delayChildren: 0.2 } },
  };

  const mobileMenuItemVariants = {
    closed: { opacity: 0, x: 50 },
    open: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
  };

  const lineVariants = {
    closed: { rotate: 0, y: 0 },
    open: (i) => ({ rotate: i === 0 ? 45 : -45, y: i === 0 ? 6 : -6, transition: { duration: 0.3 } }),
  };

  return (
    <motion.div
      className='w-full flex navBar fixed top-0 left-0 h-15 py-10 m-0 z-50'
      variants={navbarVariants}
      initial='hidden'
      animate='visible'
    >
      {/* First Half: Logo and Brand Name */}
      <Link to='/home' className='FirstHalfNav pl-5 sm:pl-10 flex items-center h-full w-auto sm:w-[30%]'>
        <motion.img
          src={BiyoansIcon}
          className='ml-2 h-10 w-auto relative animate-float animate-hue'
          alt='Logo'
          style={{ filter: 'drop-shadow(0 0 16px #6366f1) brightness(1.1) saturate(1.2)' }}
          variants={logoVariants}
        />
        <motion.div className='ml-2 sm:ml-4 text-white biyoansText text-xl font-bold' variants={brandTextVariants}>
          Biyoans
        </motion.div>
      </Link>

      {/* Second Half: Desktop Navigation Links */}
      <div className='SecondHalfNav text-white text-xl flex-row gap-7 justify-end items-center pr-5 sm:pr-15 h-full w-[70%] hidden md:flex'>
        <Link className='navBarText relative group' to='/home/courses'>
          Courses
          <span className='absolute bottom-0 left-0 w-full h-0.5 bg-white origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out'></span>
        </Link>

        <Link className='navBarText relative group' to='/home/batches'>
          Batches
          <span className='absolute bottom-0 left-0 w-full h-0.5 bg-white origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out'></span>
        </Link>

        <Link className='navBarText relative group' to='/home/gallery'>
          Gallery
          <span className='absolute bottom-0 left-0 w-full h-0.5 bg-white origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out'></span>
        </Link>

        <Link className='navBarText relative group' to='/home/contact-us'>
          Contact us
          <span className='absolute bottom-0 left-0 w-full h-0.5 bg-white origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out'></span>
        </Link>

        <Link to='/home/about-us' className='navBarText relative group'>
          About us
          <span className='absolute bottom-0 left-0 w-full h-0.5 bg-white origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out'></span>
        </Link>

        {/* ADMIN link: render only for ADMIN role */}
        {isAdmin && (
          <Link to='/admin-dashboard' className='navBarText relative group'>
            Admin
            <span className='absolute bottom-0 left-0 w-full h-0.5 bg-white origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out'></span>
          </Link>
        )}

        <Link to='/home/profile' className='navbarText relative group text-4xl'>
          {avatar ? (
            <img src={avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400" />
          ) : (
            <IoPersonCircleSharp />
          )}
        </Link>
      </div>

      {/* Mobile Menu Button (Hamburger) */}
      <div className='flex md:hidden items-center justify-end w-[70%] pr-5'>
        <button onClick={() => setIsOpen(!isOpen)} className='flex flex-col justify-around h-6 w-8 relative z-50 focus:outline-none'>
          <motion.span className='block h-0.5 w-full bg-white rounded-full' variants={lineVariants} animate={isOpen ? 'open' : 'closed'} custom={0}></motion.span>
          <motion.span className='block h-0.5 w-full bg-white rounded-full' variants={lineVariants} animate={isOpen ? 'open' : 'closed'} custom={1}></motion.span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className='fixed top-14 right-0 w-64 max-h-[calc(100vh-56px)] bg-gray-900 bg-opacity-95 rounded-lg shadow-lg flex flex-col items-start p-6 space-y-4 md:hidden z-40 overflow-y-auto'
            variants={mobileMenuVariants}
            initial='closed'
            animate='open'
            exit='closed'
          >
            <motion.div variants={mobileMenuItemVariants} onClick={() => setIsOpen(false)}>
              <Link className='navBarText text-white text-xl hover:text-gray-300 transition-colors' to='/home/courses'>Courses</Link>
            </motion.div>

            <motion.div variants={mobileMenuItemVariants} onClick={() => setIsOpen(false)}>
              <Link className='navBarText text-white text-xl hover:text-gray-300 transition-colors' to='/home/batches'>Batches</Link>
            </motion.div>

            <motion.div variants={mobileMenuItemVariants} onClick={() => setIsOpen(false)}>
              <Link className='navBarText text-white text-xl hover:text-gray-300 transition-colors' to='/home/gallery'>Gallery</Link>
            </motion.div>

            <motion.div variants={mobileMenuItemVariants} onClick={() => setIsOpen(false)}>
              <Link className='navBarText text-white text-xl hover:text-gray-300 transition-colors' to='/home/contact-us'>Contact us</Link>
            </motion.div>

            <motion.div variants={mobileMenuItemVariants} onClick={() => setIsOpen(false)}>
              <Link className='navBarText text-white text-xl hover:text-gray-300 transition-colors' to='/home/about-us'>About us</Link>
            </motion.div>

            {/* Mobile: ADMIN link visible only for ADMIN role */}
            {isAdmin && (
              <motion.div variants={mobileMenuItemVariants} onClick={() => setIsOpen(false)}>
                <Link className='navBarText text-white text-xl hover:text-gray-300 transition-colors' to='/admin-dashboard'>Admin</Link>
              </motion.div>
            )}

            <motion.div variants={mobileMenuItemVariants} onClick={() => setIsOpen(false)}>
              <Link to='/home/profile' className='navbarText relative group text-4xl'>
                {avatar ? <img src={avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400" /> : <IoPersonCircleSharp />}
              </Link>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;