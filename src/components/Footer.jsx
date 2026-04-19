import React from 'react';
import { Laptop, MessageCircle, Share2, Globe } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          
          <div className="footer-brand">
            <div className="logo-container">
              <div className="logo-icon small-logo">
                <Laptop size={20} />
              </div>
              <span className="logo-text">Astra<span className="text-gradient">Rent</span></span>
            </div>
            <p className="footer-desc">
              Premium laptop rental services for professionals and growing businesses. 
              Power your potential today without the upfront costs.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Social"><Globe size={20} /></a>
              <a href="#" aria-label="Social"><Share2 size={20} /></a>
              <a href="#" aria-label="Social"><MessageCircle size={20} /></a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#fleet">Our Fleet</a></li>
              <li><a href="#process">How it Works</a></li>
              <li><a href="#features">Why Choose Us</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact</h4>
            <p>support@astrarent.in</p>
            <p>+91 98765 43210</p>
            <p>Koramangala, Bangalore, India</p>
          </div>

        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} AstraRent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
