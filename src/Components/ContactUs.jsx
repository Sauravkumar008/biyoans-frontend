import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaYoutube,
  FaLinkedin,
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SplitText from './ReactBits/SplitText.jsx';

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  // Email regex for validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!message.trim()) newErrors.message = "Message is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    setSent(true);
    setTimeout(() => setSent(false), 2000);
    setName("");
    setEmail("");
    setMessage("");
  };

  const socialLinks = [
    { icon: <FaLinkedin className="text-blue-500 hover:text-blue-400" />, href: "#" },
    { icon: <FaTwitter className="text-cyan-400 hover:text-cyan-300" />, href: "#" },
    { icon: <FaInstagram className="text-pink-500 hover:text-pink-400" />, href: "#" },
    { icon: <FaWhatsapp className="text-green-500 hover:text-green-400" />, href: "#" },
    { icon: <FaFacebook className="text-blue-700 hover:text-blue-600" />, href: "#" },
    { icon: <FaYoutube className="text-red-500 hover:text-red-400" />, href: "#" },
  ];

  return (
    <div className="bg-[#0A0E2B] homepage-scroll fixed inset-0 overflow-x-hidden overflow-y-auto w-screen min-h-screen m-0 p-0 text-white">
      <Navbar />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-7xl mx-auto px-4 md:px-8 py-24"
        id="contact"
      >
        {/* Header with SplitText */}
        <div className="text-center mb-16">
          <SplitText
            className="BiyoansText text-white text-5xl md:text-7xl font-extrabold mb-4"
            text="Get in Touch"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center text-lg text-gray-300 max-w-2xl mx-auto"
          >
            We'd love to hear from you! Reach out to us via any of the methods
            below, or fill out the form and we'll get back to you soon.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info and Socials */}
          <div className="space-y-12">
            <motion.div
              initial={{ x: -80, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Contact Info Cards */}
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px #06b6d4" }}
                className="flex items-center space-x-5 bg-[#1C1F3F] p-7 rounded-2xl shadow-xl transition-all"
              >
                <FaPhoneAlt className="text-cyan-400 text-4xl animate-pulse" />
                <div>
                  <h3 className="text-2xl font-bold">Phone</h3>
                  <p className="text-gray-300 text-lg">+91 98765 43210</p>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px #06b6d4" }}
                className="flex items-center space-x-5 bg-[#1C1F3F] p-7 rounded-2xl shadow-xl transition-all"
              >
                <FaEnvelope className="text-cyan-400 text-4xl animate-pulse" />
                <div>
                  <h3 className="text-2xl font-bold">Email</h3>
                  <p className="text-gray-300 text-lg">support@example.com</p>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px #06b6d4" }}
                className="flex items-center space-x-5 bg-[#1C1F3F] p-7 rounded-2xl shadow-xl transition-all"
              >
                <FaMapMarkerAlt className="text-cyan-400 text-4xl animate-pulse" />
                <div>
                  <h3 className="text-2xl font-bold">Address</h3>
                  <p className="text-gray-300 text-lg">123 Cyber Street, Tech City</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Social Media Links */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <h3 className="text-2xl font-bold mb-4 text-cyan-300">Connect with us</h3>
              <div className="flex justify-center md:justify-start gap-6">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, rotate: 10, transition: { duration: 0.3 } }}
                    whileTap={{ scale: 0.9 }}
                    className="text-4xl transition-transform"
                  >
                    {link.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ x: 80, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            viewport={{ once: true }}
            className="bg-[#1C1F3F] rounded-3xl shadow-2xl p-6 md:p-10"
          >
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              {/* Name */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <input
                  type="text"
                  placeholder="Your Name"
                  className={`w-full px-5 py-4 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-lg transition-all ${
                    errors.name ? "border-2 border-red-500" : ""
                  }`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <input
                  type="email"
                  placeholder="Your Email"
                  className={`w-full px-5 py-4 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-lg transition-all ${
                    errors.email ? "border-2 border-red-500" : ""
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </motion.div>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <textarea
                  placeholder="Your Message"
                  rows={5}
                  className={`w-full px-5 py-4 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-lg transition-all resize-none ${
                    errors.message ? "border-2 border-red-500" : ""
                  }`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-lg font-bold rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all"
                >
                  {sent ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-6 h-6 text-white animate-bounce"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Sent!
                    </motion.span>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
}