import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-section">
      <div className="container hero-container">
        
        <div className="hero-content">
          <div className="hero-badge" onClick={() => scrollToSection('fleet')} style={{cursor: 'pointer'}}>
            <span className="badge-dot"></span>
            New MacBooks Available Now
            <ChevronRight size={16} />
          </div>
          
          <h1 className="hero-title">
            <span className="text-gradient">Premium Power.</span><br />
            Flexible Rentals.
          </h1>
          
          <p className="hero-subtitle">
            Equip your team or yourself with top-tier laptops starting at just ₹1,999/month. 
            Zero maintenance costs. 24/7 technical support included.
          </p>
          
          <div className="hero-actions">
            <button className="btn btn-primary hero-btn" onClick={() => scrollToSection('fleet')}>
              Explore Fleet <ArrowRight size={18} />
            </button>
            <button className="btn btn-outline hero-btn" onClick={() => scrollToSection('process')}>
              How It Works
            </button>
          </div>
          
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Laptops</span>
            </div>
            <div className="stat">
              <span className="stat-number">10k+</span>
              <span className="stat-label">Happy Clients</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="image-wrapper float-animation">
            {/* Using the generated image */}
            <img src="/hero_laptop.png" alt="Premium floating laptop" className="hero-image" />
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default Hero;
