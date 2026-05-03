import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../CSS/LandingPage.css'
import DecryptedText from './ReactBits/DecryptedText'
import logo from '../Images/logo.png'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import '../CSS/LandingPage.css'
import { FaFacebookSquare, FaGithub } from "react-icons/fa";
import { FaSquareFacebook, FaSquareXTwitter } from "react-icons/fa6";
import { IoMdMail } from 'react-icons/io';
import { BsInstagram, BsYoutube } from 'react-icons/bs';
import LoginModel from './LoginModel.jsx'
import RegistrationModel from './RegistrationModel.jsx'


const LandingPage = () => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

    // controls for navbar show/hide
    const navbarControls = useAnimation();
    // Animation controls
    // const navbarControls = useAnimation();
    const navTextControls = useAnimation();
    const iconControls = useAnimation();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegOpen, setIsRegOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    




    useEffect(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
        return () => {
            document.documentElement.style.scrollBehavior = '';
        };
    }, []);



    useEffect(() => {
        const sequence = async () => {
            await navbarControls.start('visible');
            await navTextControls.start('visible');
            await iconControls.start('visible');
        };
        sequence();
    }, [navbarControls, navTextControls, iconControls]);

    const iconVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { delay: i * 0.12, type: 'spring', stiffness: 300, damping: 18 }
        })
        // Removed hover variant, handled by whileHover prop
    };

    const icons = [
        {
            href: 'https://x.com/guptasaurav7091',
            className: 'twitter',
            icon: <FaSquareXTwitter />,
        },
        {
            href: 'https://www.facebook.com/sanatani.saurabha.831253/',
            className: 'facebook',
            icon: <FaSquareFacebook />,
        },
        {
            href: 'mailto:sauravku7091@gmail.com',
            className: 'mail',
            icon: <IoMdMail />,
        },
        {
            href: 'https://github.com/Sauravkumar008',
            className: 'github',
            icon: <FaGithub />,
        },
        {
            href: 'https://youtube.com/@sauravvlog08?si=I8DjS8BXe_L4KVue',
            className: 'youtube',
            icon: <BsYoutube />,
        },
        {
            href: 'https://www.instagram.com/sanatanii_saurav',
            className: 'instagram',
            icon: <BsInstagram />,
        },
    ];

    // Navbar animation variants
    // const navbarVariants = {
    //     hidden: { opacity: 0, y: -40 },
    //     visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
    // };



  useEffect(() => {
    const sequence = async () => {
      await navbarControls.start("visible");
    };
    sequence();
  }, [navbarControls]);

  const navbarVariants = {
    hidden: { opacity: 0, y: -40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const mobileMenuVariants = {
    closed: {
      x: "100%",
      opacity: 0,
      transition: { type: "spring", stiffness: 400, damping: 40, delay: 0.1 },
    },
    open: {
      x: "0%",
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 30,
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const mobileMenuItemVariants = {
    closed: { opacity: 0, x: 50 },
    open: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
  };

  const lineVariants = {
    closed: { rotate: 0, y: 0 },
    open: (i) => ({
      rotate: i === 0 ? 45 : -45,
      y: i === 0 ? 6 : -6,
      transition: { duration: 0.3 },
    }),
  };

  const navLinks = [
    { name: "Course", to: "/home/courses" },
    { name: "Batches", to: "/home/batches" },
    { name: "Gallery", to: "/home/gallery" },
    { name: "About us", to: "/home/about-us" },
  ];


    // naya lines 


    return (
        <div>
            <div className="background flex flex-col justify-between pt-10 pb-3">

                {/* navbar  */}
                {/*
                <motion.div
                    className='h-10 w-[calc(100% - 2rem)] mx-20 mt-2 flex'
                    variants={navbarVariants}
                    initial="hidden"
                    animate={navbarControls}
                >
                    <div className='h-[100%] w-[calc(100%/2)] flex-direction-cols flex items-center'>
                        <div className='flex items-center rounded-2xl p-2 relative group'>
                            <img
                                className='ml-2 h-12 w-auto relative z-10 animate-float animate-hue'
                                src={logo}
                                alt="Logo"
                                style={{
                                    filter: 'drop-shadow(0 0 16px #6366f1) brightness(1.1) saturate(1.2)'
                                }}
                            />
                            <p className='ml-2 text-xl Biyoans relative z-10'>Biyoans</p>
                        </div>

                        <a className='ml-6 navText text-[1rem] cursor-pointer'>Course</a>
                        <a className='ml-6 navText text-[1rem] cursor-pointer'>Batches</a>
                        <a className='ml-6 navText text-[1rem] cursor-pointer'>Gallery</a>
                        <a className='ml-6 navText text-[1rem] cursor-pointer'>About us</a>

                    </div>
                    <div className='h-[100%] w-[calc(100%/2)] flex flex-direction-cols items-center justify-end gap-12'>
                        <motion.div
                            whileHover={{
                                scale: 1.15,
                                y: -2,
                                // cyan-400
                                textShadow: "0px 0px 8px rgba(34, 211, 238, 0.8), 0px 0px 16px rgba(34, 211, 238, 0.6)",
                                rotate: -1
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20
                            }}
                        >
                            <Link
                                to="/login"
                                className="text-white font-semibold cursor-pointer"
                                style={{ display: 'inline-block' }}
                            >
                                Log in
                            </Link>
                        </motion.div>

                        <div className="relative inset-0 w-32 h-10 flex items-center justify-center cursor-pointer">
                            <div className="absolute top-1/2 left-[2px] -translate-y-1/2 w-[calc(100%)] h-[calc(100%+4px)] JoinUsCont rounded-3xl z-0"></div>
                            <Link to="/home" style={{ width: '100%' }}>
                                <motion.button
                                    className='JoinUs relative z-10 w-32 h-10 text-white flex items-center cursor-pointer justify-center font-semibold text-[1.3rem] rounded-3xl bg-indigo-600'
                                    whileHover={{
                                        scale: 1.08,
                                        boxShadow: "0 0 24px #6366f1, 0 2px 16px #6366f1"
                                    }}
                                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                                >
                                    Join us
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </motion.div>   

                */}



                <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-20 right-0 w-44 max-h-[calc(100vh-56px)] bg-gray-900 bg-opacity-95 rounded-lg shadow-lg flex flex-col items-center p-6 space-y-4 md:hidden z-40 overflow-y-auto"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={i}
                variants={mobileMenuItemVariants}
                onClick={() => setIsOpen(false)}
              >
                <Link
                  to={link.to}
                  className="text-white font-semibold text-lg"
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
            <motion.div
              variants={mobileMenuItemVariants}
              onClick={() => {
                setIsOpen(false);
                setIsLoginOpen(true);
              }}
            >
              <p className="text-white font-semibold text-lg cursor-pointer">
                Log in
              </p>
            </motion.div>
            <motion.div variants={mobileMenuItemVariants}>
              <div className="relative inset-0 w-32 h-10 flex items-center justify-center cursor-pointer">
                <div className="absolute top-1/2 left-[2px] -translate-y-1/2 w-[calc(100%)] h-[calc(100%+4px)] JoinUsCont rounded-3xl z-0"></div>
                <motion.button
                  className="JoinUs relative z-10 w-32 h-10 text-white flex items-center justify-center font-semibold text-[1.1rem] rounded-3xl bg-indigo-600"
                  onClick={() => {
                    setIsRegOpen(true);
                    setIsOpen(false);
                  }}
                  whileHover={{
                    scale: 1.08,
                    boxShadow: "0 0 24px #6366f1, 0 2px 16px #6366f1",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                >
                  Join us
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <motion.div
        className="h-16 w-full px-5 md:px-8 lg:px-20 flex justify-between items-center"
        variants={navbarVariants}
        initial="hidden"
        animate={navbarControls}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-auto animate-float animate-hue"
            style={{
              filter:
                "drop-shadow(0 0 16px #6366f1) brightness(1.1) saturate(1.2)",
            }}
          />
          <p className="ml-2 text-xl Biyoans">Biyoans</p>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              to={link.to}
              className="text-white font-semibold cursor-pointer hover:text-cyan-400"
            >
              {link.name}
            </Link>
          ))}
          <p
            className="text-white font-semibold cursor-pointer"
            onClick={() => setIsLoginOpen(true)}
          >
            Log in
          </p>
          <div className="relative w-32 h-10 flex items-center justify-center cursor-pointer">
            <div className="absolute top-1/2 left-[2px] -translate-y-1/2 w-full h-[calc(100%+4px)] JoinUsCont rounded-3xl z-0"></div>
            <motion.button
              className="JoinUs relative z-10 w-32 h-10 text-white flex items-center justify-center font-semibold text-[1.1rem] rounded-3xl bg-indigo-600"
              onClick={() => setIsRegOpen(true)}
              whileHover={{
                scale: 1.08,
                boxShadow: "0 0 24px #6366f1, 0 2px 16px #6366f1",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
            >
              Join us
            </motion.button>
          </div>
        </div>

        {/* Hamburger Menu */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex md:hidden flex-col justify-around h-6 w-8 relative z-50 focus:outline-none"
        >
          <motion.span
            className="block h-0.5 w-full bg-white rounded-full"
            variants={lineVariants}
            animate={isOpen ? "open" : "closed"}
            custom={0}
          />
          <motion.span
            className="block h-0.5 w-full bg-white rounded-full"
            variants={lineVariants}
            animate={isOpen ? "open" : "closed"}
            custom={1}
          />
        </button>
      </motion.div>



                <div className="mainSection p-0 flex flex-col gap-14 sm:gap-5 w-full md:px-5 xl:px-20 md:mt-8 lg:flex-row lg:items-center max-h-[550px] md:max-h-[650px]">
                    <div className="mt-14 md:mt-0 firstHalf flex justify-center text-4xl md:text-5xl lg:text-7xl xl:text-8xl h-[20%] md:h-[30%] lg:h-full w-full xl:w-[50%] ">
                        <div>
                            <div className='hidden sm:block lg:hidden pl-7 sm:pl-0'>
                                <DecryptedText
                                    className='BiyoansText'
                                    text="Advance your career with "
                                    animateOn="view"
                                    revealDirection="start"
                                />
                            </div>
                            <div className='block sm:hidden lg:block pl-7 sm:pl-0'>
                                <DecryptedText
                                    className='BiyoansText'
                                    text="Advance your "
                                    animateOn="view"
                                    revealDirection="start"
                                />
                                <DecryptedText
                                    className='BiyoansText'
                                    text="career with "
                                    animateOn="view"
                                    revealDirection="start"
                                />
                            </div>
                            <div className='text-white bName pl-7 sm:pl-0'>Biyoans <div style={{ letterSpacing: '0.5rem' }}>Pvt. Ltd.</div></div>
                        </div>
                    </div>

                    <div className="secondHalf h-[60%] sm:h-[80%] md:h-[70%] w-screen lg:h-[100%] xl:w-[50%] flex justify-center items-center p-0 sm:p-5">
                        <div className='h-[520px] w-[520px] scale-50 sm:scale-[0.7] md:scale-80 lg:scale-90 xl:scale-100 '>
                            <div className="firstCircle relative">
                                <div className='CircleIco1'></div>
                                <div className='CircleIco11'></div> 
                                <div className='CircleIco12'></div>
                                <div className='CircleIco13'></div>
                                <div className="secondCircle relative">
                                    {/* link db se lana hai */}
                                    <a target='blank' href='https://portfolio-shivam3410.netlify.app/'><div className="CircleIco2"></div></a>
                                    <a target='blank' href='https://saurav-portfolio-tau.vercel.app/'><div className="CircleIco21"></div></a>
                                    <div className="CircleIco22"></div> 
                                    <div className="thirdCircle relative">
                                        <div className="CircleIco3"></div>
                                        <div className="CircleIco33"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Footer Icons */}
<div className="px-3 sm:px-7 md:px-10 lg:px-20 footer h-20 w-full flex items-center justify-between pb-10 md:pb-0">
  {icons.map((item, i) => (
    <motion.a
      key={i}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: i * 0.15,
        type: "spring",
        stiffness: 300,
        damping: 18,
      }}
      className="text-white text-4xl flex items-center justify-center rounded-full cursor-pointer"
      whileHover={{
        scale: 1.35,
        boxShadow: "0 0 32px #6366f1, 0 2px 24px #6366f1",
        filter: "brightness(1.5) saturate(1.8)",
      }}
    >
      {item.icon}
    </motion.a>
  ))}
</div>

 // ... (pichla code same rahega)

                {isLoginOpen &&
                    <LoginModel isLoginOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} setIsRegOpen={setIsRegOpen} setIsLoginOpen={setIsLoginOpen} />
                }
                {isRegOpen &&
                    <RegistrationModel isRegOpen={isRegOpen} onClose={() => setIsRegOpen(false)} setIsRegOpen={setIsRegOpen} setIsLoginOpen={setIsLoginOpen} />
               }
           </div> 
        </div> 
    )
}

export default LandingPage