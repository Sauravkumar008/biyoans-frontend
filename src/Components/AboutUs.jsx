import React from "react";
import { motion } from "framer-motion";
import { FaLaptopCode, FaUsers, FaRocket, FaAward } from "react-icons/fa";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SplitText from './ReactBits/SplitText.jsx';
import HomeImg1 from '../Images/HomePage/HomeImg1.png';


const AboutUs = () => {
    return (
        <div className="bg-[#0A0E2B] homepage-scroll fixed inset-0 overflow-x-hidden overflow-y-auto w-screen min-h-screen m-0 p-0 text-white">
            <Navbar />

            {/* Hero Section */}
            <div className="relative flex flex-col md:flex-row w-full mt-10 md:mt-15 h-auto md:h-190 items-center justify-center">
                <div className="w-full md:w-1/2 pl-4 md:pl-10 flex flex-col text-left justify-center text-white text-4xl md:text-7xl py-8 md:py-0">
                    <SplitText
                        className="BiyoansText text-white"
                        text="A team of"
                        delay={100}
                        duration={0.6}
                        ease="power3.out"
                        splitType="chars"
                        from={{ opacity: 0, y: 40 }}
                        to={{ opacity: 1, y: 0 }}
                        threshold={0.1}
                        rootMargin="-100px"
                    />
                    <SplitText
                        className="BiyoansText text-white"
                        text="Developers and"
                        delay={100}
                        duration={0.6}
                        ease="power3.out"
                        splitType="chars"
                        from={{ opacity: 0, y: 40 }}
                        to={{ opacity: 1, y: 0 }}
                        threshold={0.1}
                        rootMargin="-100px"
                    />
                    <span
                        className="text-cyan-300 bName"
                        style={{ letterSpacing: "0.2rem" }}
                    >
                        Visionaries
                    </span>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="text-lg text-blue-100 max-w-2xl mt-4"
                    >
                        At Biyoans, we are a dynamic team dedicated to building digital solutions that drive progress and inspire innovation.
                    </motion.p>
                </div>
                <div className="w-full md:w-1/2 flex justify-center items-center py-4 md:py-0">
                    <motion.img
                        src={HomeImg1}
                        className="homeImg1 max-w-[80vw] md:max-w-full h-auto"
                        initial={{ opacity: 0, x: 60, y: -30 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        alt="About Us"
                    />
                </div>
            </div>

            {/* Mission and Vision Section */}
            <section id="mission-vision" className="py-20 px-4 md:px-20">
                <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -80, scale: 0.9 }}
                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                        viewport={{ once: true }}
                        className="bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition"
                    >
                        <FaRocket className="text-5xl text-cyan-300 mb-4 animate-bounce" />
                        <h2 className="text-2xl font-bold mb-2 text-white">Our Mission</h2>
                        <p className="text-gray-300">
                            To deliver innovative, scalable solutions that empower individuals and businesses to thrive in a digital-first world.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 80, scale: 0.9 }}
                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                        viewport={{ once: true }}
                        className="bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition"
                    >
                        <FaLaptopCode className="text-5xl text-cyan-300 mb-4 animate-spin-slow" />
                        <h2 className="text-2xl font-bold mb-2 text-white">Our Vision</h2>
                        <p className="text-gray-300">
                            To be a global leader in technology and innovation, making a meaningful impact through creativity, excellence, and collaboration.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Our Values Section */}
            <section id="values" className="py-20 px-4 md:px-20 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-3xl font-bold mb-6 text-cyan-300"
                >
                    Our Core Values
                </motion.h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform"
                    >
                        <FaUsers className="text-4xl text-yellow-400 mb-4 mx-auto animate-pulse" />
                        <h3 className="text-xl font-semibold mb-2 text-white">Collaboration</h3>
                        <p className="text-gray-300">
                            We work as one team, valuing every idea and fostering a culture of respect and support.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform"
                    >
                        <FaAward className="text-4xl text-green-400 mb-4 mx-auto animate-pulse" />
                        <h3 className="text-xl font-semibold mb-2 text-white">Excellence</h3>
                        <p className="text-gray-300">
                            We strive for the highest standards in all our endeavors, delivering quality and value.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform"
                    >
                        <FaRocket className="text-4xl text-red-400 mb-4 mx-auto animate-pulse" />
                        <h3 className="text-xl font-semibold mb-2 text-white">Innovation</h3>
                        <p className="text-gray-300">
                            We embrace creativity and technology to shape the future and solve real-world challenges.
                        </p>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AboutUs;
