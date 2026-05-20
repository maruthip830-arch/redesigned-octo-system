import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Laptop, Menu, X, User, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, openAuthModal, logout } = useAuth();
  const { cart, openCart } = useCart();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled glass-panel' : ''}`}>
      <div className="container nav-container">
        <div className="logo-container">
          <Link to="/" style={{display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none'}}>
            <div className="logo-icon">
              <Laptop size={28} />
            </div>
            <span className="logo-text">Astra<span className="text-gradient">Rent</span></span>
          </Link>
        </div>

        <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/#fleet">Our Fleet</Link></li>
          <li><Link to="/#process">How it Works</Link></li>
          <li><Link to="/#features">Why Us</Link></li>
          
          {/* Mobile Auth actions */}
          {isMobileMenuOpen && (
            <li className="mobile-auth-actions" style={{ marginTop: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
              {user ? (
                <>
                  {user.email === 'admin@astrarent.com' && (
                    <Link to="/admin" style={{color: 'var(--accent-primary)', marginBottom: '0.8rem', display: 'block', textDecoration: 'none', fontWeight: 'bold'}}>
                      ⚙️ Admin Portal
                    </Link>
                  )}
                  <Link to="/dashboard" style={{color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none'}}>
                    <User size={18} /> Welcome, {user.name || user.displayName || user.email?.split('@')[0] || 'User'}
                  </Link>
                  <button className="btn btn-outline" style={{width: '100%'}} onClick={logout}>Logout</button>
                </>
              ) : (
                <button className="btn btn-primary" style={{width: '100%'}} onClick={openAuthModal}>Sign In / Sign Up</button>
              )}
            </li>
          )}
        </ul>

        <div className="nav-actions">
          
          {/* Cart Status Indicator */}
          <button className="cart-btn" onClick={openCart} aria-label="View Cart">
            <ShoppingCart size={24} />
            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </button>

          {/* Desktop Auth actions */}
          <div className="desktop-auth">
            {user ? (
              <div className="user-menu" style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
                {user.email === 'admin@astrarent.com' && (
                  <Link to="/admin" style={{fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-primary)', textDecoration: 'none', border: '1px solid var(--accent-primary)', padding: '0.3rem 0.8rem', borderRadius: '20px', transition: 'all 0.2s'}}>
                    Admin Portal
                  </Link>
                )}
                <Link to="/dashboard" className="user-name" style={{fontWeight: 500, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', transition: 'color 0.2s ease'}}>
                  <User size={18} /> {user.name || user.displayName || user.email?.split('@')[0] || 'User'}
                </Link>
                <button className="btn btn-outline" onClick={logout} style={{padding: '0.5rem 1.2rem'}}>Logout</button>
              </div>
            ) : (
              <button className="btn btn-primary nav-cta" onClick={openAuthModal}>Sign In</button>
            )}
          </div>
          
          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
