import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa';
import '../CSS/Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="footer-container relative">
      {/* Visual Divider */}
      <div className="footer-separator" />

      {/* Animated Blobs */}
      <motion.div className="blob blob1"
        animate={{ x: [0, 30, -30, 0], y: [0, -20, 20, 0] }}
        transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
      />
      <motion.div className="blob blob2"
        animate={{ x: [0, -40, 40, 0], y: [0, 30, -30, 0] }}
        transition={{ repeat: Infinity, duration: 30, ease: "easeInOut" }}
      />

      {/* Footer Content */}
      <motion.footer className="footer-glass"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="footer-grid">
          {/* Left: Brand Info */}
          <div>
            <h2 className="footer-title">Biyoans Pvt. Ltd.</h2>
            <p className="footer-tagline">Empowering Future Tech Professionals</p>
            <p className="footer-description">
              Biyoans is a premier institute delivering quality education in Full Stack Development, Ethical Hacking, and competitive exam training.
            </p>
          </div>

          {/* Middle: Contact Info */}
          <div>
            <h3 className="footer-heading">Contact</h3>
            <p>📍 Chaudharidih, Post Sabalpur, Giridih, Jharkhand</p>
            <p>📞 +91-9876543210</p>
            <p>✉️ info@biyoans.com</p>
          </div>

          {/* Right: Useful Links */}
          <div>
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><Link to={'/home/courses'}>Courses</Link></li>
              <li><Link to={'/home/courses'}>Admissions</Link></li>
              <li><Link to={'/home/contact-us'}>Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-icons">
            <a href="#" className="icon-link"><FaFacebookF /></a>
            <a href="#" className="icon-link"><FaInstagram /></a>
            <a href="#" className="icon-link"><FaLinkedinIn /></a>
            <a href="#" className="icon-link"><FaGithub /></a>
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} Biyoans Pvt. Ltd. | All Rights Reserved.</p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Footer;
