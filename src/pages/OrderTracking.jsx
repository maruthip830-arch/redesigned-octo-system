import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Truck, CheckCircle, Package, ShieldCheck, MapPin, Search } from 'lucide-react';
import './OrderTracking.css';

const OrderTracking = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlId = queryParams.get('id');

  const [savedOrderId] = useState(() => urlId || localStorage.getItem('astra_order_id') || 'AR-88291');
  const [orderId, setOrderId] = useState(savedOrderId);
  const [isSearching, setIsSearching] = useState(false);
  const [trackingData, setTrackingData] = useState(true);

  // Derive the currently tracked hardware dynamically from the V2 Array database
  const activeOrder = (() => {
    try {
      const v2Orders = JSON.parse(localStorage.getItem('astra_orders_v2') || '[]');
      const found = v2Orders.find(o => o.id === orderId);
      if (found && found.item) return found.item;
    } catch(e) {}
    
    // Legacy payload fallback
    const saved = localStorage.getItem('astra_active_order');
    return saved ? JSON.parse(saved) : null;
  })();

  // Mock search simulation
  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setTrackingData(true);
    }, 1200);
  };

  return (
    <div className="tracking-container">
      <div className="tracking-header-block">
        <div className="container">
          <h1 className="text-gradient">Live Order Tracking</h1>
          <p>Monitor the status of your fleet dispatch in real-time.</p>

          <form className="tracking-search-form" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon" />
              <input 
                type="text" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter Order ID (e.g. AR-88291)" 
                className="input-field"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSearching}>
              {isSearching ? <span className="spinner"></span> : 'Track Fleet'}
            </button>
          </form>
        </div>
      </div>

      <div className="container">
        {isSearching ? (
          <div className="tracking-loading glass-panel">
            <div className="pulse-glow" style={{margin: '0 auto', width: '60px', height: '60px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Search size={30} color="white" />
            </div>
            <h3 style={{marginTop: '1.5rem'}}>Querying Dispatch Database...</h3>
          </div>
        ) : trackingData ? (
          <div className="tracking-content animation-fade">
            <div className="tracking-info-card glass-panel">
              <div className="info-grid">
                <div>
                  <span className="info-label">Order Number</span>
                  <span className="info-value text-gradient">{orderId}</span>
                </div>
                <div>
                  <span className="info-label">Hardware</span>
                  <span className="info-value">{activeOrder?.name || 'Apple MacBook Pro 16"'}</span>
                </div>
                <div>
                  <span className="info-label">Estimated Delivery</span>
                  <span className="info-value">Today, by 8:00 PM</span>
                </div>
                <div>
                  <span className="info-label">Dispatch Status</span>
                  <span className="info-value text-accent">Out for Delivery</span>
                </div>
              </div>
            </div>

            <div className="tracking-timeline-card glass-panel">
              <div className="timeline-container">
                
                {/* Step 1: KYC Approved */}
                <div className="timeline-step completed">
                  <div className="step-icon">
                    <ShieldCheck size={24} />
                  </div>
                  <div className="step-content">
                    <h3>Identity Cryptographically Verified</h3>
                    <p>Aadhaar OCR match confirmed and payment cleared.</p>
                    <span className="step-time">10:45 AM</span>
                  </div>
                </div>

                {/* Step 2: Preparing Hardware */}
                <div className="timeline-step completed">
                  <div className="step-icon">
                    <Package size={24} />
                  </div>
                  <div className="step-content">
                    <h3>Hardware Provisioned & Secured</h3>
                    <p>Device formatted, sanitized, and packed into protective Pelican case.</p>
                    <span className="step-time">12:30 PM</span>
                  </div>
                </div>

                {/* Step 3: Out for Delivery */}
                <div className="timeline-step active">
                  <div className="step-icon pulse-glow-light">
                    <Truck size={24} />
                  </div>
                  <div className="step-content">
                    <h3>Fleet Dispatched</h3>
                    <p>Executive courier is en route to your shipping address.</p>
                    <span className="step-time">02:15 PM</span>
                  </div>
                </div>

                {/* Step 4: Delivered */}
                <div className="timeline-step pending">
                  <div className="step-icon">
                    <MapPin size={24} />
                  </div>
                  <div className="step-content">
                    <h3>Deployment Complete</h3>
                    <p>Awaiting highly secure physical handover.</p>
                    <span className="step-time">Pending</span>
                  </div>
                </div>
                
              </div>
            </div>

            <div style={{textAlign: 'center', marginTop: '3rem', marginBottom: '4rem'}}>
              <Link to="/" className="btn btn-outline"><CheckCircle size={18} style={{marginRight: '0.5rem'}}/> Return Home</Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OrderTracking;
